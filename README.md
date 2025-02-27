## Getting started
1. Clone this repo
2. Run `npm run setup`
3. You will be prompted for app name & smtp password (found in proton pass)
4. Once setup is completed, run `npm run host` to see your app available on the local network!

## Deploying on PocketHost
This repository includes a Github action which will attempt to deploy to PocketHost on each push to `main`. 

Do get started, create a new instance on PocketHost, then click on the FTP Access tab.

In order to deploy, a handful of secrets must be set on the repository itself: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, and `FTP_SERVER_DIR`.