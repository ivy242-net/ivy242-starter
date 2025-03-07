## Getting started
1. Clone this repo
2. Run `npm run setup`
3. You will be prompted for app name & smtp password (found in proton pass)
4. Once setup is completed, run `npm run host` to see your app available on the local network!

For macs that can't add things to firewalls try:
`/usr/libexec/ApplicationFirewall/socketfilterfw --add <path-to-pocketbase-executable`

## Deploying on PocketHost
Do get started, create a new instance on PocketHost and note the instance name you set it up with.

You can deploy from your local codebase with `npm run deploy`. This will prompt you for your PocketHost login info, and the instance name where you'd like to deploy. Once all the information has been provided, it will automatically build and deploy your codebase to PocketHost.

This repository also includes a Github Action which will attempt to deploy to PocketHost on each push to `main`. 

In order to deploy on push (via the Github Action), a handful of secrets must be set on the repository itself: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, and `FTP_SERVER_DIR`. 

FTP_SERVER should be: `ftp.pockethost.io`.
FTP_USERNAME should be your PocketHost login (email address).
FTP_PASSWORD should be your PocketHost password.
FTP_SERVER_DIR should be your PocketHost instance name.