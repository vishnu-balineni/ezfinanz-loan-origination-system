import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Auto-close sidebar on mobile when navigating pages
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

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

                        <div
                            onClick={() => { navigate('/admin/dashboard'); setIsSidebarOpen(false); }}
                            className={`admin-link ${location.pathname === '/admin/dashboard' || location.pathname === '/admin' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <Users size={18} />
                            All Applications
                        </div>

                        <div
                            onClick={() => { navigate('/admin/pending'); setIsSidebarOpen(false); }}
                            className={`admin-link ${location.pathname === '/admin/pending' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <FileSearch size={18} />
                            Pending KYC
                        </div>
                    </div>

                    <div className="admin-nav-group">
                        <div className="admin-nav-label">Finance & Portfolio</div>

                        <div
                            onClick={() => { navigate('/admin/active-loans'); setIsSidebarOpen(false); }}
                            className={`admin-link ${location.pathname === '/admin/active-loans' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <Briefcase size={18} />
                            Active Loans
                        </div>

                        <div
                            onClick={() => { navigate('/admin/disbursements'); setIsSidebarOpen(false); }}
                            className={`admin-link ${location.pathname === '/admin/disbursements' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <Banknote size={18} />
                            Disbursements
                        </div>
                    </div>
                </div>

                <div className="admin-sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div
                        onClick={() => { navigate('/admin/profile'); setIsSidebarOpen(false); }}
                        className={`admin-link ${location.pathname === '/admin/profile' ? 'active' : ''}`}
                        style={{ justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <ShieldCheck size={18} />
                        Admin Profile
                    </div>

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
