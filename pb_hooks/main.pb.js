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
        } catch (e) {
            console.log('Auth error', e);
        }
    }
    return e.next()
}, -10))