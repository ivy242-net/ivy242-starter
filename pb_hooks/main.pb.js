onRecordAuthRequest((e) => {
    try {
        const appUrl = $app.settings().appURL;
        // Create and set a cookie with the token in it (pb_auth)
        e.setCookie({
            name: 'pb_auth',
            value: e.token,
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            secure: appUrl?.startsWith('https://') ? true : false,
            httpOnly: true,
            sameSite: true,
        });
    } catch (err) {
        console.log('Auth cookie error', err);
    }
    e.next()
});

// Logout route, to clear the pb_auth cookie
routerAdd("GET", "/logout", (e) => {
    try {
        const appUrl = $app.settings().appURL;
        const cookies = e.request.cookies();
        const pbAuth = cookies.find((cookie) => cookie.name === 'pb_auth');
        e.setCookie({
            name: 'pb_auth',
            value: '',
            path: '/',
            maxAge: 0,
            secure: appUrl?.startsWith('https://') ? true : false,
            httpOnly: true,
            sameSite: true
        });
        e.redirect(302, '/login');
    } catch (err) {
        console.log('Logout error', err);
    }
});

routerUse(new Middleware((e) => {
    const cookies = e.request.cookies();
    const pbAuth = cookies.find((cookie) => cookie.name === 'pb_auth');
    if (pbAuth && pbAuth.value) {
        try {
            const token = pbAuth.value;
            const record = $app.findAuthRecordByToken(token, "auth");
            e.auth = record;
        } catch (err) {
            if (err.value.error() === 'sql: no rows in result set') {
                // Invalid cookie, quietly ignore
            } else {
                console.log('Auth error', err);
            }
        }
    }
    return e.next()
}, -10))

$app.rootCmd.addCommand(new Command({
    use: "meta",
    run: (cmd, args) => {
        const argsObj = args.reduce((acc, arg) => {
            const [key, value] = arg.split('=');
            acc[key] = value;
            return acc;
        }, {});
        let settings = $app.settings();
        // for all available settings fields you could check
        // https://pocketbase.io/jsvm/interfaces/core.Settings.html
        const allowedKeys = ['appName', 'appURL'];
        for (const arg of Object.keys(argsObj)) {
            if (allowedKeys.includes(arg)) {
                settings.meta[arg] = argsObj[arg];
            }
        }
        $app.save(settings)
    },
}))

$app.rootCmd.addCommand(new Command({
    use: "smtp",
    run: (cmd, args) => {
        const argsObj = args.reduce((acc, arg) => {
            const [key, value] = arg.split('=');
            acc[key] = value;
            return acc;
        }, {});
        let settings = $app.settings();
        // for all available settings fields you could check
        // https://pocketbase.io/jsvm/interfaces/core.Settings.html
        const allowedKeys = ['enabled', 'host', 'port', 'username', 'password'];
        // If enabled is not set, set it to true by default
        if (!argsObj.hasOwnProperty('enabled')) {
            argsObj.enabled = true;
        }
        // If the type of enabled is string, convert it to boolean
        if (typeof argsObj.enabled === 'string') {
            argsObj.enabled = argsObj.enabled === 'true';
        }
        // If the type of port is string, convert it to number
        if (argsObj.port && typeof argsObj.port === 'string') {
            argsObj.port = parseInt(argsObj.port);
        }
        for (const arg of Object.keys(argsObj)) {
            if (allowedKeys.includes(arg)) {
                settings.smtp[arg] = argsObj[arg];
            }
        }
        $app.save(settings)
    },
}))

$app.rootCmd.addCommand(new Command({
    use: "superuser",
    run: (cmd, args) => {
        const argsObj = args.reduce((acc, arg) => {
            const [key, value] = arg.split('=');
            acc[key] = value;
            return acc;
        }, {});
        const allowedKeys = ['email', 'password'];
        let superusers = $app.findCollectionByNameOrId("_superusers")
        let record = new Record(superusers)
        // note: the values can be eventually loaded via $os.getenv(key)
        // or from a special local config file
        if (!argsObj.hasOwnProperty('email') || !argsObj.hasOwnProperty('password')) {
            throw new Error('email and password are required')
        }
        record.set("email", argsObj.email)
        record.set("password", argsObj.password)
        $app.save(record)
    },
}))