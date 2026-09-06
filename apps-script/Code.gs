const CONFIG = Object.freeze({
  allowedOrigin: 'https://mmdvv3408.github.io',
  siteUrl: 'https://mmdvv3408.github.io/certiplan-premium/'
});

function doGet() {
  return responsePage_(false, 'This endpoint accepts form submissions only.', '');
}

/**
 * Run once from the Apps Script editor before deploying. The owner's address is
 * stored privately in Script Properties and is never published in site code.
 */
function setup() {
  const ownerEmail = Session.getActiveUser().getEmail();
  if (!ownerEmail) throw new Error('Google could not identify the signed-in project owner.');
  PropertiesService.getScriptProperties().setProperty('DEPLOYER_EMAIL', ownerEmail);
  return 'CertiPlan enquiries will be delivered to ' + ownerEmail;
}

function doPost(e) {
  const values = (e && e.parameter) || {};
  const requestId = clean_(values.request_id, 80);

  try {
    validate_(values);

    const email = clean_(values.email, 180).toLowerCase();
    const cache = CacheService.getScriptCache();
    const rateKey = 'lead-' + digest_(email);
    if (cache.get(rateKey)) throw new Error('Please wait before sending another enquiry.');

    if (MailApp.getRemainingDailyQuota() < 1) {
      throw new Error('The enquiry service is temporarily unavailable.');
    }

    const deployerEmail = PropertiesService.getScriptProperties().getProperty('DEPLOYER_EMAIL');
    if (!deployerEmail) throw new Error('The enquiry service has not been set up yet.');

    const lead = {
      name: clean_(values.name, 120),
      phone: clean_(values.phone, 60),
      email: email,
      service: clean_(values.service, 180),
      postcode: clean_(values.postcode, 30) || 'Not provided',
      message: clean_(values.message, 2500) || 'No additional message',
      receivedAt: Utilities.formatDate(new Date(), 'Europe/London', 'dd MMM yyyy, HH:mm')
    };

    MailApp.sendEmail({
      to: deployerEmail,
      replyTo: lead.email,
      name: 'CertiPlan Website Enquiries',
      subject: '[CERTIPLAN WEBSITE] New quote request — ' + lead.service,
      body: plainText_(lead),
      htmlBody: emailHtml_(lead)
    });

    cache.put(rateKey, '1', 30);
    return responsePage_(true, 'Your enquiry was sent successfully.', requestId);
  } catch (error) {
    console.error(error);
    return responsePage_(false, safeError_(error), requestId);
  }
}

function validate_(values) {
  if (clean_(values.website, 200)) throw new Error('Invalid submission.');

  const startedAt = Number(values.started_at || 0);
  const elapsed = Date.now() - startedAt;
  if (!startedAt || elapsed < 1800 || elapsed > 7200000) throw new Error('Please refresh the page and try again.');

  const name = clean_(values.name, 120);
  const phone = clean_(values.phone, 60);
  const email = clean_(values.email, 180);
  const service = clean_(values.service, 180);
  if (!name || !phone || !email || !service) throw new Error('Please complete all required fields.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.');
  if (!/^[0-9+()\s.-]{7,30}$/.test(phone)) throw new Error('Please enter a valid phone number.');
}

function responsePage_(ok, message, requestId) {
  const payload = JSON.stringify({
    type: 'certiplan-enquiry-result',
    ok: Boolean(ok),
    message: String(message),
    requestId: String(requestId || '')
  }).replace(/</g, '\\u003c');

  const html = '<!doctype html><html><body><script>' +
    'window.parent.postMessage(' + payload + ',"' + CONFIG.allowedOrigin + '");' +
    'if(window.top!==window.parent){window.top.postMessage(' + payload + ',"' + CONFIG.allowedOrigin + '");}' +
    '<\/script></body></html>';

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function emailHtml_(lead) {
  const row = (label, value) =>
    '<tr><td style="padding:11px 0;color:#607287;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;border-bottom:1px solid #e7eef2;width:145px;vertical-align:top">' + esc_(label) + '</td>' +
    '<td style="padding:11px 0;color:#10243a;font-size:15px;font-weight:600;border-bottom:1px solid #e7eef2;vertical-align:top">' + esc_(value).replace(/\n/g, '<br>') + '</td></tr>';

  return '<!doctype html><html><body style="margin:0;background:#eef3f6;font-family:Arial,sans-serif;color:#10243a">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef3f6;padding:32px 12px"><tr><td align="center">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 18px 45px rgba(5,42,77,.12)">' +
    '<tr><td style="background:#073968;padding:30px 34px"><div style="font-size:27px;font-weight:800;color:#ffffff;letter-spacing:-1px">CERTI<span style="color:#3dc6a0">PLAN</span></div>' +
    '<div style="margin-top:8px;color:#bcd0df;font-size:13px">New website quote request</div></td></tr>' +
    '<tr><td style="padding:32px 34px"><div style="display:inline-block;background:#e9f8f3;color:#16735d;border-radius:999px;padding:7px 11px;font-size:11px;font-weight:800">NEW ENQUIRY</div>' +
    '<h1 style="font-size:25px;line-height:1.25;margin:18px 0 5px;color:#073968">' + esc_(lead.name) + ' is interested in<br>' + esc_(lead.service) + '</h1>' +
    '<p style="margin:0 0 22px;color:#607287;font-size:13px">Received ' + esc_(lead.receivedAt) + ' · CertiPlan website</p>' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0">' +
    row('Name', lead.name) + row('Phone', lead.phone) + row('Email', lead.email) + row('Service', lead.service) + row('Postcode', lead.postcode) + row('Message', lead.message) +
    '</table>' +
    '<div style="margin-top:26px;text-align:center"><a href="mailto:' + esc_(lead.email) + '" style="display:inline-block;background:#3dc6a0;color:#073655;text-decoration:none;border-radius:11px;padding:13px 22px;font-size:14px;font-weight:800">Reply to ' + esc_(lead.name) + '</a></div>' +
    '</td></tr><tr><td style="background:#f7fafb;padding:18px 34px;color:#8293a1;font-size:11px;text-align:center">Sent securely from <a href="' + CONFIG.siteUrl + '" style="color:#08725b">certiplan.co.uk</a></td></tr>' +
    '</table></td></tr></table></body></html>';
}

function plainText_(lead) {
  return [
    'New CertiPlan quote request', '',
    'Name: ' + lead.name,
    'Phone: ' + lead.phone,
    'Email: ' + lead.email,
    'Service: ' + lead.service,
    'Postcode: ' + lead.postcode,
    'Message: ' + lead.message,
    'Received: ' + lead.receivedAt
  ].join('\n');
}

function clean_(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function esc_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function digest_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value);
  return Utilities.base64EncodeWebSafe(bytes).slice(0, 32);
}

function safeError_(error) {
  const message = error && error.message ? String(error.message) : '';
  const allowed = [
    'Invalid submission.',
    'Please wait before sending another enquiry.',
    'The enquiry service is temporarily unavailable.',
    'The enquiry service has not been set up yet.',
    'Please refresh the page and try again.',
    'Please complete all required fields.',
    'Please enter a valid email address.',
    'Please enter a valid phone number.'
  ];
  return allowed.includes(message) ? message : 'We could not send your enquiry. Please try again or call us.';
}
