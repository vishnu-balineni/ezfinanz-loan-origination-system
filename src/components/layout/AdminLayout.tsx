import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    Users,
    FileSearch,
    Banknote,
    LogOut,
    ShieldCheck
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/'); // Route back to central auth
    };

    return (
        <div className="admin-layout">

            {/* Dark Mode High-Contrast Admin Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-top">

                    <div className="admin-brand">
                        <div className="admin-logo">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="admin-brand-name">EZFINANZ</span>
                        <span className="admin-badge">Admin</span>
                    </div>

                    <div className="admin-nav-group">
                        <div className="admin-nav-label">Applications</div>

                        <NavLink
                            to="/admin/dashboard"
                            end
                            className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
                        >
                            <Users size={18} />
                            All Applications
                        </NavLink>

                        <NavLink
                            to="/admin/pending"
                            className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
                        >
                            <FileSearch size={18} />
                            Pending KYC
                        </NavLink>
                    </div>

                    <div className="admin-nav-group">
                        <div className="admin-nav-label">Finance</div>
                        <NavLink
                            to="/admin/disbursements"
                            className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
                        >
                            <Banknote size={18} />
                            Disbursements
                        </NavLink>
                    </div>
                </div>

                <div className="admin-sidebar-footer">
                    <button onClick={handleLogout} className="admin-logout-btn">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area Wrapper */}
            <div className="admin-content">
                <main className="admin-page-container">
                    <Outlet />
                </main>
            </div>

        </div>
    );
};

export default AdminLayout;
