import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    FileText,
    LifeBuoy,
    LogOut,
    Target,
    ShieldCheck,
    PlusCircle
} from 'lucide-react';
import './CustomerLayout.css';

const CustomerLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="customer-layout">

            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-top">
                    <div className="sidebar-brand">
                        <div className="sidebar-logo">
                            <Target size={28} />
                        </div>
                        <span className="sidebar-brand-name">EZFINANZ</span>
                    </div>

                    <div className="sidebar-nav-group">
                        <div className="nav-label">My Space</div>

                        <NavLink
                            to="/dashboard"
                            end
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/dashboard/apply"
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <PlusCircle size={18} />
                            Apply for Loan
                        </NavLink>

                        <NavLink
                            to="/dashboard/verify"
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <ShieldCheck size={18} />
                            Get Verified
                        </NavLink>

                        <NavLink
                            to="/dashboard/documents"
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <FileText size={18} />
                            Documents
                        </NavLink>

                        <button className="sidebar-link" style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => alert('Support module initiated.')}>
                            <LifeBuoy size={18} />
                            Support
                        </button>
                    </div>

                    <div className="sidebar-nav-group">
                        <div className="nav-label">Settings</div>
                        <NavLink
                            to="/dashboard/profile"
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <User size={18} />
                            My Profile
                        </NavLink>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <div className="sidebar-user-info">
                        <div className="user-avatar-small">
                            RS
                        </div>
                        <div className="user-details-small">
                            <span className="user-name-small">Rahul Sharma</span>
                            <span className="user-role-small">Verified Borrower</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-icon-btn" title="Log out">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            {/* Main Content Area Wrapper */}
            <div className="layout-content">
                <main className="page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CustomerLayout;
