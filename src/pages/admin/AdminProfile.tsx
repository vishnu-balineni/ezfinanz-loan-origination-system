import { KeyRound, ShieldAlert } from 'lucide-react';
import './AdminProfile.css';

const AdminProfile = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const adminData = {
        name: storedUser.fullName || "System Administrator",
        email: storedUser.email || "admin@ezfinanz.com",
        empId: `EZ-ADM-${storedUser.id || 8091}`,
        role: storedUser.role || "Administrator",
        hub: "National Processing Center (HQ)",
        lastLogin: new Date().toLocaleString() + " (IP: 192.168.1.1)"
    };

    return (
        <div className="admin-profile-container">
            <div className="admin-profile-header">
                <h1>Administrator Profile</h1>
                <p>Manage your internal platform settings and security permissions.</p>
            </div>

            <div className="admin-identity-card">
                <div className="admin-avatar">
                    {adminData.name.charAt(0)}
                </div>
                <div className="admin-identity-info">
                    <h2>{adminData.name}</h2>
                    <p>{adminData.email}</p>
                    <span className="admin-role-badge">{adminData.role}</span>
                </div>
            </div>

            <div className="admin-details-grid">
                <div className="admin-detail-box">
                    <div className="detail-label">Employee ID</div>
                    <div className="detail-value">{adminData.empId}</div>
                </div>
                <div className="admin-detail-box">
                    <div className="detail-label">Assigned Operating Hub</div>
                    <div className="detail-value">{adminData.hub}</div>
                </div>
                <div className="admin-detail-box" style={{ gridColumn: 'span 2' }}>
                    <div className="detail-label">Last Successful Login</div>
                    <div className="detail-value">{adminData.lastLogin}</div>
                </div>
            </div>

            <div className="admin-security-section">
                <h3><ShieldAlert size={20} color="#3b82f6" /> Security & Access</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                    Your account has elevated privileges. Please ensure you update your password periodically.
                </p>
                <button className="admin-password-btn">
                    <KeyRound size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Change Admin Password
                </button>
            </div>
        </div>
    );
};

export default AdminProfile;
