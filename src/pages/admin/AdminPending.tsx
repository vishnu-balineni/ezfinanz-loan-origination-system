import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, Clock, AlertCircle,
    ShieldAlert, FileText, ChevronRight,
    CheckSquare, Square
} from 'lucide-react';
import api from '../../services/api';
import './AdminDashboard.css';

// Removed unused mockPendingQueue

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

const AdminPending = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [queue, setQueue] = useState<any[]>([]);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await api.get('/loans/admin/all');
                // Calculate waiting time to determine Urgency / SLA
                const pending = res.data.filter((l: any) => l.status === 'PENDING_ADMIN_REVIEW').map((app: any) => {
                    const hoursWaiting = (Date.now() - new Date(app.createdAt).getTime()) / (1000 * 60 * 60);
                    let currentSla = 'On Track';
                    if (hoursWaiting > 24) currentSla = 'Breached';
                    else if (hoursWaiting > 6) currentSla = 'Breaching Soon';

                    // Business Logic Overrides based on new fields
                    if (app.purpose === 'medical') {
                        currentSla = 'Breached'; // Force into Critical Region
                    } else if (app.isUrgent && currentSla === 'On Track') {
                        currentSla = 'Breaching Soon'; // Force into Urgent Region
                    }

                    return {
                        id: app.id.toString(),
                        name: app.applicant?.fullName || 'Unknown',
                        date: new Date(app.createdAt).toLocaleString(),
                        issue: app.purpose === 'medical' ? 'Medical Emergency' : (app.isUrgent ? 'User Marked Urgent' : (app.isKycSubmitted ? 'Awaiting Human Verification' : 'KYC Docs Missing')),
                        severity: app.purpose === 'medical' ? 'Critical' : (app.isUrgent ? 'High' : (app.isKycSubmitted ? 'Medium' : 'High')),
                        slaState: currentSla,
                        amount: app.requestedAmount || 0,
                        rawStatus: app.status
                    };
                });
                // Sort by ID falling backwards
                setQueue(pending.sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id)));
            } catch (err) {
                console.error(err);
            }
        };
        fetchPending();
    }, []);

    // Simulate selection state for bulk actions
    const [selectedApps, setSelectedApps] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        setSelectedApps(prev =>
            prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
        );
    };

    // Compute the filtered list dynamically
    const filteredQueue = queue.filter(app => {
        // Search Filter
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.id.toLowerCase().includes(searchTerm.toLowerCase());

        // Urgency Toggle Filter (SLA-based)
        let matchesStatus = true;
        if (activeFilter === 'Critical') {
            matchesStatus = app.slaState === 'Breached';
        } else if (activeFilter === 'Urgent') {
            matchesStatus = app.slaState === 'Breaching Soon' || app.slaState === 'Breached';
        }

        return matchesSearch && matchesStatus;
    });

    const toggleSelectAll = () => {
        if (selectedApps.length === filteredQueue.length) {
            setSelectedApps([]);
        } else {
            setSelectedApps(filteredQueue.map(app => app.id));
        }
    };

    const StatusBadge = ({ issue, severity }: { issue: string, severity: string }) => {
        let bg = '#f1f5f9';
        let color = '#475569';

        if (severity === 'Critical') { bg = '#fee2e2'; color = '#ef4444'; }
        if (severity === 'High') { bg = '#fef3c7'; color = '#d97706'; }
        if (severity === 'Medium') { bg = '#e0e7ff'; color = '#4f46e5'; }

        return (
            <span style={{
                background: bg, color, padding: '0.25rem 0.6rem',
                borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
            }}>
                {severity === 'Critical' && <ShieldAlert size={12} />}
                {severity === 'High' && <AlertCircle size={12} />}
                {issue}
            </span>
        );
    };

    const SlaBadge = ({ state }: { state: string }) => {
        let color = '#10b981'; // Green
        if (state === 'Breached') color = '#ef4444'; // Red
        if (state === 'Breaching Soon') color = '#f59e0b'; // Amber

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color, fontSize: '0.8rem', fontWeight: 600 }}>
                <Clock size={14} />
                {state}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Header */}
            <div className="profile-header-card">
                <div className="header-user-info">
                    <h2 className="header-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Filter size={28} color="#10b981" /> Pending KYC & Exception Queue
                    </h2>
                    <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                        Resolve application blockages requiring human intervention. Prioritize breached SLAs.
                    </span>
                </div>
            </div>

            {/* Quick Stats / Action Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* Search & Filters */}
                <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search by App ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem 1rem 0.75rem 3rem',
                                borderRadius: '9999px', border: '1px solid #e2e8f0',
                                outline: 'none', fontSize: '0.9rem',
                                transition: 'all 0.2s',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#10b981'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    <div style={{ display: 'flex', background: 'white', border: '1px solid #e2e8f0', borderRadius: '9999px', padding: '0.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        {['All', 'Critical', 'Urgent'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                style={{
                                    padding: '0.5rem 1.25rem', border: 'none', borderRadius: '9999px',
                                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                                    background: activeFilter === filter ? '#10b981' : 'transparent',
                                    color: activeFilter === filter ? 'white' : '#64748b',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bulk Actions Placeholder */}
                {selectedApps.length > 0 && (
                    <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#ecfdf5', padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
                        <span style={{ fontSize: '0.9rem', color: '#065f46', fontWeight: 600 }}>{selectedApps.length} selected</span>
                        <button style={{ background: 'white', border: '1px solid #a7f3d0', color: '#047857', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                            Assign to me
                        </button>
                    </div>
                )}
            </div>

            {/* Queue Table */}
            <div className="table-card">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '1rem 1rem 0 0' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={20} color="#3b82f6" /> Exception Backlog ({filteredQueue.length})
                    </h3>
                </div>
                <div style={{ overflowX: 'auto', background: 'white', borderRadius: '0 0 1rem 1rem' }}>

                    {filteredQueue.length === 0 ? (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
                            <CheckSquare size={48} color="#10b981" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                            <h3>No pending applications found.</h3>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40px' }}>
                                        <div style={{ cursor: 'pointer', color: '#64748b' }} onClick={toggleSelectAll}>
                                            {selectedApps.length === filteredQueue.length && filteredQueue.length > 0
                                                ? <CheckSquare size={18} color="#10b981" />
                                                : <Square size={18} />}
                                        </div>
                                    </th>
                                    <th>Application Info</th>
                                    <th>Exception Reason</th>
                                    <th>Loan Amount</th>
                                    <th>SLA Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQueue.map((app) => {
                                    const isSelected = selectedApps.includes(app.id);
                                    return (
                                        <tr key={app.id} style={{ background: isSelected ? '#f8fafc' : 'transparent', transition: 'background 0.2s' }}>
                                            <td>
                                                <div style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => toggleSelection(app.id)}>
                                                    {isSelected ? <CheckSquare size={18} color="#10b981" /> : <Square size={18} />}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="app-id" style={{ display: 'inline-block', marginBottom: '0.25rem' }}>#{app.id}</div>
                                                <div className="app-name">{app.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>{app.date}</div>
                                            </td>
                                            <td>
                                                <StatusBadge issue={app.issue} severity={app.severity} />
                                            </td>
                                            <td style={{ fontWeight: 600, color: '#1e293b' }}>
                                                {formatCurrency(app.amount)}
                                            </td>
                                            <td>
                                                <SlaBadge state={app.slaState} />
                                            </td>
                                            <td>
                                                <button
                                                    className="review-btn"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#10b981', color: 'white', border: 'none' }}
                                                    onClick={() => navigate(`/admin/review/${app.id}`)}
                                                >
                                                    Resolve <ChevronRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPending;
