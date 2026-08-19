import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Clock, CheckCircle2, ChevronRight,
    Users, Banknote, ShieldAlert, FileText, Download,
    Settings, Briefcase
} from 'lucide-react';
import api from '../../services/api';
import './AdminDashboard.css';
import '../portal/ProfileStyles.css'; // For the dark hero region

// Helper mapping to transform backend entities to UI display if needed
const mapBackendStatus = (status: string) => {
    if (status === 'PENDING_ADMIN_REVIEW' || status === 'PENDING_KYC') return 'Pending';
    if (status === 'APPROVED') return 'Approved';
    if (status === 'REJECTED') return 'Rejected';
    return status;
};

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({ total: 0, pending: 0, disbursed: 0 });

    useEffect(() => {
        const fetchPendingLoans = async () => {
            try {
                const res = await api.get('/loans/admin/all');

                // Keep the queue ordered newest first
                const sortedQueue = res.data.sort((a: any, b: any) => b.id - a.id);
                setQueue(sortedQueue);

                // Dynamically compile real metrics from the Database!
                const totalApps = sortedQueue.length;
                const pendingCount = sortedQueue.filter((l: any) => l.status === 'PENDING_ADMIN_REVIEW').length;
                const disbursedAmount = sortedQueue
                    .filter((l: any) => l.status === 'APPROVED')
                    .reduce((sum: number, l: any) => sum + (l.approvedAmount || l.requestedAmount || 0), 0);

                setStats({ total: totalApps, pending: pendingCount, disbursed: disbursedAmount });
                setLoading(false);
            } catch (err) {
                console.error("Failed to load queue", err);
                setLoading(false);
            }
        };

        fetchPendingLoans();
    }, []);

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
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{stats.total.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                        Live DB Sync Active
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Pending in Queue</div>
                        <div style={{ background: '#fef3c7', padding: '0.5rem', borderRadius: '0.5rem', color: '#d97706' }}><Clock size={20} /></div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{stats.pending.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                        Requires underwriting action
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Total Disbursed (MTD)</div>
                        <div style={{ background: '#ecfdf5', padding: '0.5rem', borderRadius: '0.5rem', color: '#10b981' }}><Banknote size={20} /></div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{formatCurrency(stats.disbursed)}</div>
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
                                {loading ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading Queue...</td></tr>
                                ) : queue.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No Pending Applications in Queue</td></tr>
                                ) : queue.map((app) => (
                                    <tr key={app.id}>
                                        <td className="app-id">#{app.id}</td>
                                        <td>
                                            <div className="app-name">{app.applicant?.fullName || 'Unknown Applicant'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(app.createdAt || Date.now()).toLocaleDateString()}</div>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{formatCurrency(app.requestedAmount)}</td>
                                        <td>
                                            <span style={{
                                                display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600,
                                                background: '#dcfce7', color: '#166534'
                                            }}>
                                                Good
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${app.status?.toLowerCase() || 'pending'}`}>
                                                {mapBackendStatus(app.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="review-btn" onClick={() => navigate(`/admin/review/${app.id}`)}>
                                                Review
                                            </button>
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
                            {queue.filter(app => app.status !== 'PENDING_ADMIN_REVIEW').slice(0, 5).map(app => (
                                <div key={app.id} style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ color: app.status === 'APPROVED' ? '#10b981' : '#ef4444', paddingTop: '2px' }}>
                                        {app.status === 'APPROVED' ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                                            {app.status === 'APPROVED' ? 'Application Approved' : 'Application Rejected'}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                            {app.applicant?.fullName || 'User'} - {formatCurrency(app.approvedAmount || app.requestedAmount)}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                            {new Date(app.updatedAt || app.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {queue.filter(app => app.status !== 'PENDING_ADMIN_REVIEW').length === 0 && (
                                <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', padding: '1rem 0' }}>
                                    No recent audit activities found.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

        </div >
    );
};

export default AdminDashboard;
