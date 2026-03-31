import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import CompanyDetail from './CompanyDetail';
import ActivityLog from './ActivityLog';
import { useAuthStore } from './store/authStore';

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/company/:id" element={token ? <CompanyDetail /> : <Navigate to="/login" />} />
        <Route path="/activity-log" element={token ? <ActivityLog /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;