import React, { useEffect, useState } from 'react';
import api from './api/axios';
import { Link } from 'react-router-dom';

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/activity-logs/'); // Ensure you have this endpoint in Django
                setLogs(res.data.results || res.data);
            } catch (err) { console.error(err); }
        };
        fetchLogs();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <Link to="/">← Back to Dashboard</Link>
            <h2>System Activity Log</h2>
            <table border="1" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        <th>Action</th>
                        <th>Model</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.action_type}</td>
                            <td>{log.model_name}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityLog;