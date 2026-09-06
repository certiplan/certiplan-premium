# CertiPlan enquiry mailer

This Google Apps Script receives the public website form and sends a branded HTML email.
The sender and recipient are resolved automatically from the Google account that deploys the web app; no mailbox address is stored in the code.

## Deploy

1. Create a standalone project at https://script.new and name it `CertiPlan Enquiry Mailer`.
2. Replace `Code.gs` with the contents of this folder's `Code.gs`.
3. In Project Settings, enable showing the manifest and replace `appsscript.json` with the supplied manifest.
4. Choose **Deploy → New deployment → Web app**.
5. Set **Execute as** to `Me` and **Who has access** to `Anyone`.
6. Authorize the mail permission and copy the deployed `/exec` URL.
7. Replace `YOUR_APPS_SCRIPT_WEB_APP_URL` in the website's `index.html` with that URL.

When changing the script later, create a new deployment version while keeping the same deployment URL.
To transfer ownership to another person, copy the project to their Google account and let them deploy it as themselves.
