import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

function LoginForm({ label }) {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [view, setView] = useState('form');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const req = await pb.collection('users').requestOTP(email);
            setView('sent');
        } catch (err) {
            setError(err.message);
        }
    }

    switch (view) {
        case 'sent':
            return <div>Magic link sent to: <b>{email}</b></div>;
        case 'form':
            return (
                <form onSubmit={handleSubmit}>
                    {error && <div>{error}</div>}
                    <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
                    <button type="submit">Submit</button>
                </form>
            )
    }
}

export default LoginForm;