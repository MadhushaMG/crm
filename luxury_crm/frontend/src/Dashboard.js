import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 
import api from './api/axios';
import { useAuthStore } from './store/authStore';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({ username: 'User', role: 'Staff' });
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', industry: '' });
    const [logoFile, setLogoFile] = useState(null);
    
    const fileInputRef = useRef(null);
    const navigate = useNavigate(); // navigate function 

    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    const fetchData = async () => {
        try {
            if (token) {
                const decoded = jwtDecode(token);
                setUserInfo({ 
                    username: decoded.username || "Authenticated User", 
                    role: decoded.role || "ADMIN" 
                });
            }
            const res = await api.get('/companies/');
            setCompanies(res.data.results || res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddModal = () => {
        setIsEditing(false);
        setFormData({ id: '', name: '', industry: '' });
        setLogoFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsModalOpen(true);
    };

    const openEditModal = (company) => {
        setIsEditing(true);
        setFormData({ id: company.id, name: company.name, industry: company.industry });
        setLogoFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('industry', formData.industry);
        if (logoFile) data.append('logo', logoFile);

        try {
            if (isEditing) {
                await api.patch(`/companies/${formData.id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/companies/', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert("Failed: " + (err.response?.status === 403 ? "Permission Denied" : "Error"));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Only Admins can delete. Are you sure?")) {
            try {
                await api.delete(`/companies/${id}/`);
                fetchData();
            } catch (err) {
                alert("Denied: Only Admins can delete!");
            }
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading Luxury CRM...</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '15px', borderRadius: '8px', borderBottom: '2px solid #eee' }}>
                <div>
                    <h2 style={{ margin: 0 }}>CRM Dashboard</h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>Role: <span style={{ color: 'green', fontWeight: 'bold' }}>{userInfo.role}</span></p>
                </div>
                <div>
                    <Link to="/activity-log" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Activity Logs</Link>
                    <button onClick={logout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>Companies Management</h3>
                <button onClick={openAddModal} style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>+ Add Company</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                <thead>
                    <tr style={{ background: '#343a40', color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '12px', width: '60px' }}>Logo</th>
                        <th style={{ padding: '12px' }}>Company Name</th>
                        <th style={{ padding: '12px' }}>Industry</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map((c) => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px' }}>
                                {c.logo ? (
                                    <img src={c.logo} alt="logo" style={{ width: '45px', height: '45px', borderRadius: '5px', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '45px', height: '45px', background: '#ccc', borderRadius: '5px' }}></div>
                                )}
                            </td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{c.name}</td>
                            <td style={{ padding: '12px' }}>{c.industry}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                {/* VIEW BUTTON - Contacts පෙන්වන තැනට යන්න */}
                                <button 
                                    onClick={() => navigate(`/company/${c.id}`)} 
                                    style={{ marginRight: '5px', padding: '5px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    View
                                </button>
                                <button 
                                    onClick={() => openEditModal(c)} 
                                    style={{ marginRight: '5px', padding: '5px 12px', background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(c.id)} 
                                    style={{ padding: '5px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* MODAL (Add & Edit) - logic remains same as provided in previous code */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 0 15px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0 }}>{isEditing ? "Edit Company" : "Add New Company"}</h3>
                        <label>Company Name:</label>
                        <input type="text" value={formData.name} style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px', boxSizing: 'border-box' }} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        <label>Industry:</label>
                        <input type="text" value={formData.industry} style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px', boxSizing: 'border-box' }} onChange={(e) => setFormData({...formData, industry: e.target.value})} />
                        <label>Logo:</label>
                        <input type="file" ref={fileInputRef} accept="image/*" style={{ width: '100%', marginTop: '5px', marginBottom: '20px' }} onChange={(e) => setLogoFile(e.target.files[0])} />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setIsModalOpen(false)} style={{ marginRight: '10px', padding: '8px 15px', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>{isEditing ? "Save" : "Create"}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Dashboard;