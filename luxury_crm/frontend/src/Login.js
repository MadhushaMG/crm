import React, { useState } from 'react';
import { useAuthStore } from './store/authStore';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
        } catch (err) {
            alert("Login Failed! Check credentials.");
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>Luxury CRM Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required /><br /><br />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br /><br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;