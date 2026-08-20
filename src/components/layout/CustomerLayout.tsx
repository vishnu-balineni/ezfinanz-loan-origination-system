import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { triggerCustomAlert } from '../shared/CustomAlertModal';
import {
    LayoutDashboard,
    User,
    FileText,
    LifeBuoy,
    LogOut,
    Target,
    ShieldCheck,
    PlusCircle,
    History,
    Menu,
    X
} from 'lucide-react';
import './CustomerLayout.css';

const CustomerLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Auto-close sidebar on mobile when navigating pages
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Dynamic Application State
    const storedUser = JSON.parse(localStorage.getItem('user') || '{"fullName": "Guest User", "isKycVerified": false}');
    const userFullName = storedUser.fullName || "Guest User";

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="customer-layout">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Navigation */}
            <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-top">
                    <div className="sidebar-brand">
                        <div className="sidebar-logo">
                            <Target size={28} />
                        </div>
                        <span className="sidebar-brand-name">EZFINANZ</span>
                        <button
                            className="mobile-close-btn"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="sidebar-nav-group">
                        <div className="nav-label">My Space</div>

                        <div
                            onClick={() => { navigate('/dashboard'); setIsSidebarOpen(false); }}
                            className={`sidebar-link ${location.pathname === '/dashboard' || location.pathname === '/dashboard/' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </div>

                        <div
                            onClick={() => { navigate('/dashboard/apply'); setIsSidebarOpen(false); }}
                            className={`sidebar-link ${location.pathname === '/dashboard/apply' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <PlusCircle size={18} />
                            Apply for Loan
                        </div>

                        <div
                            onClick={() => { navigate('/dashboard/verify'); setIsSidebarOpen(false); }}
                            className={`sidebar-link ${location.pathname === '/dashboard/verify' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <ShieldCheck size={18} />
                            {storedUser.isKycVerified ? "Verification Status" : "Get Verified"}
                        </div>

                        <div
                            onClick={() => { navigate('/dashboard/documents'); setIsSidebarOpen(false); }}
                            className={`sidebar-link ${location.pathname === '/dashboard/documents' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <FileText size={18} />
                            Documents
                        </div>

                        <div
                            onClick={() => { navigate('/dashboard/history'); setIsSidebarOpen(false); }}
                            className={`sidebar-link ${location.pathname === '/dashboard/history' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <History size={18} />
                            Loan History
                        </div>

                        <button className="sidebar-link" style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => { setIsSidebarOpen(false); triggerCustomAlert('success', 'Support module initiated.', 'Support Requested'); }}>
                            <LifeBuoy size={18} />
                            Support
                        </button>
                    </div>

                    <div className="sidebar-nav-group">
                        <div className="nav-label">Settings</div>
                        <div
                            onClick={() => { navigate('/dashboard/profile'); setIsSidebarOpen(false); }}
                            className={`sidebar-link ${location.pathname === '/dashboard/profile' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <User size={18} />
                            My Profile
                        </div>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <div className="sidebar-user-info">
                        <div className="user-avatar-small">
                            {getInitials(userFullName)}
                        </div>
                        <div className="user-details-small">
                            <span className="user-name-small">{userFullName}</span>
                            <span className="user-role-small" style={{ color: storedUser.isKycVerified ? '#10b981' : '#f59e0b' }}>
                                {storedUser.isKycVerified ? 'Verified Borrower' : 'Unverified Identity'}
                            </span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-icon-btn" title="Log out">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            {/* Main Content Area Wrapper */}
            <div className="layout-content">
                {/* Mobile Header */}
                <div className="mobile-header">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <div className="mobile-header-brand">EZFINANZ</div>
                </div>

                <main className="page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CustomerLayout;
