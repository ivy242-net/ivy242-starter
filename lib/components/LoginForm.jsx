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

    return (
        <>
            {error && <div>{error}</div>}
            {view === 'sent' && (
                <div class="flex flex-col items-center p-4">
                    <div class="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-primary">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
                        </svg>
                    </div>
                    <p class="text-center text-lg mt-4 font-bold">Check your email!</p>
                    <p class="text-center mt-4">We emailed a magic link to:</p>
                    <p class="text-center text-md font-bold">{email}</p>
                </div>
            )}
            {view === 'form' && (
                <form onSubmit={(e) => handleSubmit(e)}>
                    <fieldset class="fieldset">
                        <label class="fieldset-label">Email</label>
                        <input type="email" class="input w-full" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
                        <button type="submit" class="btn btn-neutral mt-4">Get Magic Link</button>
                    </fieldset>
                </form>
            )}
        </>
    )
}

export default LoginForm;