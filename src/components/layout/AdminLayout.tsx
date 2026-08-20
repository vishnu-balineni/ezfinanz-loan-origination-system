import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    Users,
    FileSearch,
    Banknote,
    LogOut,
    ShieldCheck,
    Briefcase,
    Menu,
    X
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        navigate('/'); // Route back to central auth
    };

    return (
        <div className="admin-layout">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Dark Mode High-Contrast Admin Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="admin-sidebar-top">

                    <div className="admin-brand">
                        <div className="admin-logo">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="admin-brand-name">EZFINANZ</span>
                        <span className="admin-badge">Admin</span>
                        <button
                            className="mobile-close-btn"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="admin-nav-group">
                        <div className="admin-nav-label">Applications</div>

                        <NavLink
                            to="/admin/dashboard"
                            end
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
                        >
                            <Users size={18} />
                            All Applications
                        </NavLink>

                        <NavLink
                            to="/admin/pending"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
                        >
                            <FileSearch size={18} />
                            Pending KYC
                        </NavLink>
                    </div>

                    <div className="admin-nav-group">
                        <div className="admin-nav-label">Finance & Portfolio</div>

                        <NavLink
                            to="/admin/active-loans"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
                        >
                            <Briefcase size={18} />
                            Active Loans
                        </NavLink>

                        <NavLink
                            to="/admin/disbursements"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
                        >
                            <Banknote size={18} />
                            Disbursements
                        </NavLink>
                    </div>
                </div>

                <div className="admin-sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavLink
                        to="/admin/profile"
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
                        style={{ justifyContent: 'center' }}
                    >
                        <ShieldCheck size={18} />
                        Admin Profile
                    </NavLink>

                    <button onClick={handleLogout} className="admin-logout-btn">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area Wrapper */}
            <div className="admin-content">
                {/* Mobile Header */}
                <div className="mobile-header">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <div className="mobile-header-brand">EZFINANZ Admin</div>
                </div>

                <main className="admin-page-container">
                    <Outlet />
                </main>
            </div>

        </div>
    );
};

export default AdminLayout;
