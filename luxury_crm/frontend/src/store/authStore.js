import { create } from 'zustand';
import api from '../api/axios'; 

export const useAuthStore = create((set) => ({
    token: localStorage.getItem('token') || null,
 
    login: async (username, password) => {
        try {
       
            const res = await api.post('/login/', { username, password });
            
        
            const accessToken = res.data.access;
            
            if (accessToken) {
                localStorage.setItem('token', accessToken);
                set({ token: accessToken });
                return true;
            }
        } catch (err) {
            console.error("Login Error:", err.response?.data || err.message);
            throw err; 
        }
    },

    setAuth: (token) => {
        localStorage.setItem('token', token);
        set({ token });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ token: null });
       
        window.location.href = '/login'; 
    }
}));