import { useState, useEffect } from 'react';
import {
    Briefcase, Search, AlertTriangle,
    CheckCircle2, ChevronRight, Activity, TrendingUp, HelpCircle, X
} from 'lucide-react';
import api from '../../services/api';
import './AdminDashboard.css';

// Removed unused mockActiveLoans

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

const AdminActiveLoans = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedLoan, setSelectedLoan] = useState<any>(null);
    const [queue, setQueue] = useState<any[]>([]);

    useEffect(() => {
        const fetchActive = async () => {
            try {
                const res = await api.get('/loans/admin/all');
                const active = res.data.filter((l: any) => l.status === 'APPROVED').map((app: any) => ({
                    id: app.id.toString(),
                    name: app.applicant?.fullName || 'Unknown',
                    principal: app.requestedAmount || 0,
                    outstanding: app.approvedAmount || app.requestedAmount || 0,
                    emi: Math.round(((app.approvedAmount || app.requestedAmount || 0) * 1.15) / (app.termMonths || 12)),
                    nextDueDate: new Date(Date.now() + 30 * 86400000).toLocaleDateString(),
                    status: 'Current',
                    tenure: `${app.termMonths || 12} Mos`,
                    paidMos: 0
                }));
                setQueue(active);
            } catch (err) {
                console.error(err);
            }
        };
        fetchActive();
    }, []);

    const filteredLoans = queue.filter(loan => {
        const matchesSearch = loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loan.id.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesStatus = true;
        if (activeFilter !== 'All') {
            matchesStatus = loan.status === activeFilter;
        }

        return matchesSearch && matchesStatus;
    });

    const StatusBadge = ({ status }: { status: string }) => {
        let bg = '#f1f5f9';
        let color = '#475569';

        if (status === 'Current') { bg = '#ecfdf5'; color = '#10b981'; } // Green
        if (status === 'Delinquent') { bg = '#fee2e2'; color = '#ef4444'; } // Red
        if (status === 'Closed') { bg = '#f1f5f9'; color = '#64748b'; } // Slate

        return (
            <span style={{
                background: bg, color, padding: '0.25rem 0.6rem',
                borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
            }}>
                {status === 'Current' && <CheckCircle2 size={12} />}
                {status === 'Delinquent' && <AlertTriangle size={12} />}
                {status === 'Closed' && <CheckCircle2 size={12} />}
                {status}
            </span>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>

            {/* Header */}
            <div className="profile-header-card">
                <div className="header-user-info">
                    <h2 className="header-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Briefcase size={28} color="#10b981" /> Active Loan Portfolio
                    </h2>
                    <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                        Monitor health of disbursed loans, track outgoing EMIs, and manage default risks.
                    </span>
                </div>
            </div>

            {/* Portfolio Health Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Total Active Portfolio</div>
                        <div style={{ background: '#ecfdf5', padding: '0.5rem', borderRadius: '0.5rem', color: '#10b981' }}><TrendingUp size={20} /></div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>₹4.2 Cr</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                        Outstanding Principal
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Expected EMI (This Month)</div>
                        <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '0.5rem', color: '#3b82f6' }}><Activity size={20} /></div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>₹12.5L</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                        ₹9.2L already collected
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Portfolio at Risk (NPA)</div>
                        <div style={{ background: '#fee2e2', padding: '0.5rem', borderRadius: '0.5rem', color: '#ef4444' }}><AlertTriangle size={20} /></div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>4.2%</div>
                    <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                        3 Delinquent Accounts
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Find loan by ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem 1rem 0.75rem 3rem',
                                borderRadius: '9999px', border: '1px solid #e2e8f0',
                                outline: 'none', fontSize: '0.9rem',
                                transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#10b981'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    <div style={{ display: 'flex', background: 'white', border: '1px solid #e2e8f0', borderRadius: '9999px', padding: '0.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        {['All', 'Current', 'Delinquent', 'Closed'].map(filter => (
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
            </div>

            {/* Loans Table */}
            <div className="table-card">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '1rem 1rem 0 0' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Briefcase size={20} color="#3b82f6" /> Contract Directory ({filteredLoans.length})
                    </h3>
                </div>

                <div style={{ overflowX: 'auto', background: 'white', borderRadius: '0 0 1rem 1rem' }}>
                    {filteredLoans.length === 0 ? (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
                            <HelpCircle size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                            <h3>No loans match this filter.</h3>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Loan Account</th>
                                    <th>Status</th>
                                    <th>Principal / Outstanding</th>
                                    <th>Monthly EMI</th>
                                    <th>Next Due</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLoans.map((loan) => (
                                    <tr key={loan.id} style={{ transition: 'background 0.2s' }}>
                                        <td>
                                            <div className="app-id" style={{ display: 'inline-block', marginBottom: '0.25rem' }}>#{loan.id}</div>
                                            <div className="app-name">{loan.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                                                Paid {loan.paidMos} of {loan.tenure}
                                            </div>
                                        </td>
                                        <td>
                                            <StatusBadge status={loan.status} />
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.9rem', color: '#64748b', textDecoration: 'line-through' }}>{formatCurrency(loan.principal)}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginTop: '0.2rem' }}>
                                                {formatCurrency(loan.outstanding)}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{formatCurrency(loan.emi)}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: loan.status === 'Delinquent' ? '#ef4444' : '#1e293b' }}>
                                                {loan.nextDueDate}
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                className="review-btn"
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#10b981', color: 'white', border: 'none' }}
                                                onClick={() => setSelectedLoan(loan)}
                                            >
                                                Details <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* View Statement Modal UI */}
            {selectedLoan && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.75)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
                }}>
                    <div className="animate-fade-in" style={{
                        background: 'white', borderRadius: '1rem', width: '100%', maxWidth: '600px',
                        overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        <div style={{ background: '#0f172a', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>{selectedLoan.name} - #{selectedLoan.id}</h2>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>Full Account Statement</div>
                            </div>
                            <button onClick={() => setSelectedLoan(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Original Principal</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>{formatCurrency(selectedLoan.principal)}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Monthly EMI</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>{formatCurrency(selectedLoan.emi)}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Outstanding Balance</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{formatCurrency(selectedLoan.outstanding)}</div>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#1e293b' }}>Payment History</h3>
                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
                                {selectedLoan.paidMos === 0 ? (
                                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', padding: '1rem 0' }}>
                                        No EMI payments have been scheduled or processed yet.
                                    </div>
                                ) : (
                                    <>
                                        {Array.from({ length: Math.min(selectedLoan.paidMos, 5) }).map((_, i) => {
                                            const d = new Date(2026, 6 - i, 1); // Mock relative logic starting from July 2026
                                            const monthYear = d.toLocaleString('default', { month: 'short', year: 'numeric' });
                                            const isLast = i === Math.min(selectedLoan.paidMos, 5) - 1;
                                            return (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: isLast ? 'none' : '1px solid #e2e8f0' }}>
                                                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{monthYear} EMI</span>
                                                    <span style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>Paid - {formatCurrency(selectedLoan.emi)}</span>
                                                </div>
                                            );
                                        })}
                                        {selectedLoan.paidMos > 5 && (
                                            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>
                                                View {selectedLoan.paidMos - 5} older payments...
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminActiveLoans;
