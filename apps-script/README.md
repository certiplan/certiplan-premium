# CertiPlan enquiry mailer

This Google Apps Script receives the public website form and sends a branded HTML email.
The sender and recipient are registered from the signed-in project owner during setup; no mailbox address is stored in the code or GitHub.

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
