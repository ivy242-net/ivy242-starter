## Quickstart
```
npx ivy242-starter my-app
```

1. Run `npx ivy242-starter my-app`
2. Run `cd my-app && npm run setup`
3. You will be prompted for app name and SMTP credentials. Setup script will use this information to configure your project.
4. Once setup is completed, run `npm run dev` to start building your application!

## Commands

```
npx ivy242-starter my-app
```

This is the fastest way to get a new ivy242 starter app rolling! Just pass the target directory as the first argument (my-app) and the script will download the latest release of the ivy242-starter and unzip it into the directory you indicated. Once done, just run `cd my-app && npm run setup` to get started. 

```
npm run setup
```

Prompts you for some input & gets your local setup all good to go. Installs dependencies, setups up package.json with your app name, downloads the correct version of PocketBase, instantiates your local database and sets SMTP and starting superuser credentials.

```
npm run dev
```

Starts watching for changes to client and rebuilds on save. Then boots up a local Pocketbase instance at `https://127.0.0.1:8090`, which restarts with any change to server or client code. 

_Note: There is no hot module replacement (HMR), so changes take effect on page refresh._

```
npm run preview
```

Builds your client and server code, then starts Pocketbase on a URL visible to the local network. Helpful for local-only projects, testing on mobile, or checking multiuser scenarios.

_Note: For macs that can't add things to firewalls try:
`/usr/libexec/ApplicationFirewall/socketfilterfw --add <path-to-pocketbase-executable>`_

```
npm run deploy
```

Builds your client and server code, then prompts you for PocketHost login inforomation and instance name. The script will deploy your build to PocketHost  (via FTP) directly from your local installation.

_Note: Only the contents of `dist` will be deployed. No data from your local database is deployed! Only the server code (hooks,  migrations) and built versions of your client code._

## Deploying on PocketHost

Do get started, create a new instance on PocketHost and note the instance name you set it up with.

You can deploy from your local codebase with `npm run deploy`. This will prompt you for your PocketHost login info, and the instance name where you'd like to deploy. Once all the information has been provided, it will automatically build and deploy your codebase to PocketHost.

This repository also includes a Github Action which will attempt to deploy to PocketHost on each push to `main`. 

In order to deploy on push (via the Github Action), a handful of secrets must be set on the repository itself: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, and `FTP_SERVER_DIR`. 

FTP_SERVER should be: `ftp.pockethost.io`.
FTP_USERNAME should be your PocketHost login (email address).
FTP_PASSWORD should be your PocketHost password.
FTP_SERVER_DIR should be your PocketHost instance name.