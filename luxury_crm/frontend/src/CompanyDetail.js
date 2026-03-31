import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from './api/axios';

const CompanyDetail = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ full_name: '', email: '', phone: '' });

    const fetchDetail = async () => {
        try {
            const compRes = await api.get(`/companies/${id}/`);
            setCompany(compRes.data);
            const contRes = await api.get(`/contacts/?company=${id}`);
            setContacts(contRes.data.results || contRes.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchDetail(); }, [id]);

    const handleAddContact = async (e) => {
        e.preventDefault();
        try {
            await api.post('/contacts/', { ...newContact, company: id });
            setNewContact({ full_name: '', email: '', phone: '' });
            fetchDetail();
            alert("Contact Added!");
        } catch (err) {
            alert("Error: " + JSON.stringify(err.response?.data));
        }
    };

    if (!company) return <p>Loading...</p>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <Link to="/">← Back to Dashboard</Link>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                {company.logo && <img src={company.logo} alt="logo" style={{ width: '80px', marginRight: '20px', borderRadius: '8px' }} />}
                <h1>{company.name} <small style={{ color: '#666', fontSize: '18px' }}>({company.industry})</small></h1>
            </div>

            <hr />

            <h3>Manage Contacts</h3>
            <form onSubmit={handleAddContact} style={{ marginBottom: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                <input type="text" placeholder="Full Name" value={newContact.full_name} onChange={e => setNewContact({...newContact, full_name: e.target.value})} required style={{marginRight: '10px'}} />
                <input type="email" placeholder="Email" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} required style={{marginRight: '10px'}} />
                <input type="text" placeholder="Phone (8-15 digits)" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} style={{marginRight: '10px'}} />
                <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px' }}>Add Contact</button>
            </form>

            <table width="100%" border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
                <thead><tr style={{background: '#eee'}}><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
                <tbody>
                    {contacts.map(cont => (
                        <tr key={cont.id}><td>{cont.full_name}</td><td>{cont.email}</td><td>{cont.phone}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CompanyDetail;