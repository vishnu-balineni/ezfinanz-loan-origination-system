import { useNavigate } from 'react-router-dom';
import {
    Activity, Clock, CheckCircle2, ChevronRight,
    Users, Banknote, ShieldAlert, FileText, Download,
    Settings, Briefcase
} from 'lucide-react';
import './AdminDashboard.css';
import '../portal/ProfileStyles.css'; // For the dark hero region

// Mock applications for the Queue
const mockApplications = [
    {
        id: "EZ-1042",
        name: "Rahul Sharma",
        amount: 100000,
        tenure: 12,
        stage: "Admin Review",
        date: "Today, 14:30",
        cibil: 752,
        status: "Pending" // Yellow
    },
    {
        id: "EZ-1041",
        name: "Priya Patel",
        amount: 450000,
        tenure: 36,
        stage: "Disbursed",
        date: "Today, 09:15",
        cibil: 810,
        status: "Approved" // Green
    },
    {
        id: "EZ-1040",
        name: "Amit Kumar",
        amount: 50000,
        tenure: 6,
        stage: "Eligibility Failed",
        date: "Yesterday",
        cibil: 590,
        status: "Rejected" // Red
    }
];

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-dashboard-page" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* 1. Hero Region (Dark Navy Banner) */}
            <div className="profile-header-card">
                <div className="header-user-info">
                    <h2 className="header-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Briefcase size={28} color="#10b981" /> System Health & Originations Overview
                    </h2>
                    <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                        Welcome to your administrative hub. Monitor queues, underwrite loans, and disburse funds.
                    </span>
                </div>
            </div>

            {/* 2. Admin System Overview Snapshot */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Total Applications</div>
                        <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '0.5rem', color: '#3b82f6' }}><Users size={20} /></div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>1,284</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                        ↑ 12% from last week
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Pending in Queue</div>
                        <div style={{ background: '#fef3c7', padding: '0.5rem', borderRadius: '0.5rem', color: '#d97706' }}><Clock size={20} /></div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>24</div>
                    <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                        Requires underwriting action
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Total Disbursed (MTD)</div>
                        <div style={{ background: '#ecfdf5', padding: '0.5rem', borderRadius: '0.5rem', color: '#10b981' }}><Banknote size={20} /></div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>₹42.5L</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                        Acquired target: ₹40L
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>System Alerts</div>
                        <div style={{ background: '#fee2e2', padding: '0.5rem', borderRadius: '0.5rem', color: '#ef4444' }}><ShieldAlert size={20} /></div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>3</div>
                    <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                        KYC API failures detected
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>

                {/* 3. Left Column: Main Queue Table */}
                <div className="table-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={20} color="#3b82f6" /> Ongoing Application Queue
                        </h3>
                        <button onClick={() => navigate('/admin/pending')} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
                            View Full Queue
                        </button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>App ID</th>
                                    <th>Applicant</th>
                                    <th>Amount</th>
                                    <th>CIBIL</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockApplications.map((app) => (
                                    <tr key={app.id}>
                                        <td className="app-id">#{app.id}</td>
                                        <td>
                                            <div className="app-name">{app.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.date}</div>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{formatCurrency(app.amount)}</td>
                                        <td>
                                            <span style={{
                                                display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600,
                                                background: app.cibil > 750 ? '#dcfce7' : '#f1f5f9', color: app.cibil > 750 ? '#166534' : '#475569'
                                            }}>
                                                {app.cibil}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${app.status.toLowerCase()}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            {app.status === 'Pending' ? (
                                                <button className="review-btn" onClick={() => navigate(`/admin/review/${app.id}`)}>
                                                    Review
                                                </button>
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>PROCESSED</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. Right Column: Quick Actions & Recent Platform Logs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Admin Quick Actions */}
                    <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1e293b' }}>Global Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1e293b', fontWeight: 600 }}>
                                    <Download size={18} color="#10b981" /> Export EOD Report
                                </div>
                                <ChevronRight size={18} color="#94a3b8" />
                            </button>
                            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1e293b', fontWeight: 600 }}>
                                    <Settings size={18} color="#3b82f6" /> System Governance
                                </div>
                                <ChevronRight size={18} color="#94a3b8" />
                            </button>
                        </div>
                    </div>

                    {/* Platform Activity */}
                    <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={20} color="#f59e0b" /> Audit Log
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ color: '#10b981', paddingTop: '2px' }}><CheckCircle2 size={16} /></div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>Manual Disbursal Authorized</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Admin user processed ₹4,50,000 for EZ-1041.</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>Today, 09:12 AM</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ color: '#ef4444', paddingTop: '2px' }}><ShieldAlert size={16} /></div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>Automated Rejection</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>CIBIL dropped to 590 for EZ-1040, below threshold.</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>Yesterday, 14:10 PM</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
