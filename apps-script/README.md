# CertiPlan enquiry mailer

This Google Apps Script receives the public website form and sends a branded HTML email.
The message is sent by the Google account that owns the deployment to `Info@certiplan.co.uk`. It appears as `CertiPlan Website Leads`, uses the short subject `New enquiry — Customer Name`, and replies go directly to the customer.

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

If the deployment owner is also `Info@certiplan.co.uk`, Gmail may label the sender as `me` because the mailbox is sending a message to itself. The custom sender name is still included in the message headers. To avoid the `me` label completely, send from a different Google account while keeping `Info@certiplan.co.uk` as the recipient.
