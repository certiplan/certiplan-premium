# CertiPlan enquiry mailer

This Google Apps Script receives the public website form and sends a branded HTML email.
The message is sent by the Google account that owns the deployment to `Info@certiplan.co.uk`. It uses Google Workspace's generic no-reply sender, appears as `CertiPlan Website Leads`, and uses the short subject `New enquiry — Customer Name`. Use the `Reply to Customer Name` button inside the email to reply directly to the customer.

## Deploy

1. Create a standalone project at https://script.new and name it `CertiPlan Enquiry Mailer`.
2. Replace `Code.gs` with the contents of this folder's `Code.gs`.
3. In Project Settings, enable showing the manifest and replace `appsscript.json` with the supplied manifest.
4. Select `setup` in the function menu, click **Run**, and approve the requested permissions once.
5. Choose **Deploy → New deployment → Web app**.
6. Set **Execute as** to `Me` and **Who has access** to `Anyone`.
7. Copy the deployed `/exec` URL.
8. Replace `YOUR_APPS_SCRIPT_WEB_APP_URL` in the website's `index.html` with that URL.

When changing the script later, create a new deployment version while keeping the same deployment URL.
To transfer ownership to another person, copy the project to their Google account and let them deploy it as themselves.

The `noReply` option is available only to Google Workspace accounts. It prevents Gmail from treating the message as mail sent by the inbox to itself. Google ignores the standard `replyTo` field in this mode, so replies must use the customer button provided inside the branded email.
