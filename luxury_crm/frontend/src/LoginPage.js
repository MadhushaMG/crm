import React, { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from './store/authStore';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/v1/login/', { username, password });
            setAuth(res.data.access);
            alert("Logged!");
        } catch (err) {
            alert("Username or password is incorrect!");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <h2 style={{ color: '#61dafb' }}>Luxury CRM Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} style={{ padding: '10px' }} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px' }} />
                <button type="submit" style={{ padding: '10px', background: '#61dafb', cursor: 'pointer', border: 'none' }}>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;