import { useState, useEffect } from 'react';
import { Download, History, CheckCircle2, FileText, ArrowLeft, Banknote, Calendar, ChevronRight, Clock } from 'lucide-react';
import api from '../../services/api';
import './DashboardHome.css';
import './ProfileStyles.css'; // For the dark hero region

const mapBackendStatus = (status: string) => {
    if (status === 'PENDING_ADMIN_REVIEW' || status === 'PENDING_KYC') return 'Pending Approval';
    if (status === 'APPROVED') return 'Active';
    if (status === 'REJECTED') return 'Closed'; // or Rejected
    return status;
};

const LoanHistory = () => {
    // If null, show the list of all loans. Otherwise, show the details for the selected loan ID.
    const [selectedLoan, setSelectedLoan] = useState<string | null>(null);

    // Dynamic User Data
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = storedUser.id;

    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchLoans = async () => {
            try {
                const res = await api.get(`/loans/my-loans/${userId}`);
                setLoans(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load loan history", err);
                setLoading(false);
            }
        };
        fetchLoans();
    }, [userId]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
    };

    // Helper for Status Badge styling
    const getStatusStyle = (status: string) => {
        if (status === 'Active') return { bg: '#dcfce7', text: '#166534' };
        if (status === 'Pending Approval') return { bg: '#fef3c7', text: '#b45309' };
        return { bg: '#e2e8f0', text: '#475569' };
    };

    const getIconStyle = (status: string) => {
        if (status === 'Active') return { bg: '#ecfdf5', text: '#10b981' };
        if (status === 'Pending Approval') return { bg: '#fef9c3', text: '#ca8a04' };
        return { bg: '#f1f5f9', text: '#64748b' };
    };

    // VIEW: All Loans List
    if (!selectedLoan) {
        return (
            <div className="history-page" style={{ paddingBottom: '2rem' }}>
                <div className="profile-header-card" style={{ marginBottom: '2rem' }}>
                    <div className="header-user-info">
                        <h2 className="header-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <History size={28} color="#10b981" /> My Loan History
                        </h2>
                        <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                            A complete record of your active, pending, and past loan applications.
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading history...</div>
                    ) : loans.length === 0 ? (
                        <div className="dash-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                            You have no loan applications recorded.
                        </div>
                    ) : loans.map((loan: any) => {
                        const displayStatus = mapBackendStatus(loan.status);
                        const statusStyle = getStatusStyle(displayStatus);
                        const iconStyle = getIconStyle(displayStatus);

                        return (
                            <div key={loan.id} className="dash-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s', cursor: 'pointer', border: '1px solid #e2e8f0' }} onClick={() => setSelectedLoan(loan.id)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                    <div style={{ background: iconStyle.bg, color: iconStyle.text, padding: '1rem', borderRadius: '0.75rem' }}>
                                        <Banknote size={24} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>{loan.purpose || 'Personal Loan'}</h3>
                                            <span style={{
                                                background: statusStyle.bg,
                                                color: statusStyle.text,
                                                padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600
                                            }}>
                                                {displayStatus}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                                            <span>ID: {loan.id}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> Requested {new Date(loan.createdAt || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>{formatCurrency(loan.requestedAmount)}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{loan.termMonths} Months</div>
                                    </div>
                                    <div style={{ color: '#94a3b8' }}>
                                        <ChevronRight size={24} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // VIEW: Specific Loan Details
    const activeLoan = loans.find((l: any) => l.id.toString() === selectedLoan?.toString());
    const isPending = mapBackendStatus(activeLoan?.status || '') === 'Pending Approval';

    return (
        <div className="history-page" style={{ paddingBottom: '2rem' }}>
            <button
                onClick={() => setSelectedLoan(null)}
                style={{
                    background: 'transparent', border: 'none', color: '#3b82f6',
                    fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem',
                    cursor: 'pointer', padding: 0, marginBottom: '1.5rem'
                }}
            >
                <ArrowLeft size={18} /> Back to All Loans
            </button>

            <div className="profile-header-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="header-user-info">
                    <h2 className="header-user-name">{activeLoan?.purpose || 'Personal Loan'} Overview</h2>
                    <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                        Loan Reference ID: {selectedLoan}
                    </span>
                </div>
                <div style={{ textAlign: 'right', background: 'rgba(255, 255, 255, 0.1)', padding: '1rem 1.5rem', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {isPending ? 'Requested Amount' : 'Total Disbursed'}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{formatCurrency(activeLoan?.requestedAmount || 0)}</div>
                </div>
            </div>

            {/* Payment Schedule & Receipts */}
            <div className="dash-card" style={{ marginBottom: '2rem' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                    <FileText size={20} color="#10b981" />
                    Payment Schedule & Receipts
                </h3>

                {isPending ? (
                    <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '0.5rem', border: '2px dashed #cbd5e1', color: '#64748b' }}>
                        <Clock size={32} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Awaiting Approval</h4>
                        <p style={{ margin: 0 }}>Your payment schedule will be generated automatically once your application passes Admin Review and funds are disbursed.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                    <th style={{ padding: '1rem' }}>Transaction ID</th>
                                    <th style={{ padding: '1rem' }}>Description</th>
                                    <th style={{ padding: '1rem' }}>Amount</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mapBackendStatus(activeLoan?.status || '') === 'Active' && (
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '1rem', color: '#1e293b' }}>05 Nov 2026</td>
                                        <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Upcoming</td>
                                        <td style={{ padding: '1rem', color: '#1e293b' }}>EMI Payment (Month 3)</td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>₹8,885</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>Pending</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>Pay Now</button>
                                        </td>
                                    </tr>
                                )}
                                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#fdfdfd' }}>
                                    <td style={{ padding: '1rem', color: '#1e293b' }}>05 {mapBackendStatus(activeLoan?.status || '') === 'Active' ? 'Oct' : 'Sep'} 2026</td>
                                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>TXN-9844321A</td>
                                    <td style={{ padding: '1rem', color: '#1e293b' }}>EMI Payment</td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>₹{Math.floor((activeLoan?.requestedAmount || 0) * 0.09)}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ background: '#ecfdf5', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>Paid</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button style={{ background: 'transparent', border: 'none', color: '#10b981', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Download size={14} /> Receipt
                                        </button>
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1rem', color: '#1e293b' }}>05 {mapBackendStatus(activeLoan?.status || '') === 'Active' ? 'Sep' : 'Aug'} 2026</td>
                                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>TXN-3211559C</td>
                                    <td style={{ padding: '1rem', color: '#1e293b' }}>EMI Payment</td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>₹{Math.floor((activeLoan?.requestedAmount || 0) * 0.09)}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ background: '#ecfdf5', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>Paid</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button style={{ background: 'transparent', border: 'none', color: '#10b981', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Download size={14} /> Receipt
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Application Logs */}
            <div className="dash-card">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                    <CheckCircle2 size={20} color="#10b981" />
                    Application Milestone Logs
                </h3>

                <div style={{ padding: '1rem 0' }}>

                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ minWidth: '120px', color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>{new Date(activeLoan?.createdAt || Date.now()).toLocaleDateString()}<br />14:02 PM</div>
                        <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1.5rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-7px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>Bank Mandate Registered</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Successful NACH registration with verified bank account.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ minWidth: '120px', color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>{new Date(activeLoan?.createdAt || Date.now()).toLocaleDateString()}<br />13:50 PM</div>
                        <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1.5rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-7px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>KYC Verified</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Aadhaar XML and PAN verification confirmed via automated systems.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ minWidth: '120px', color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>{new Date(activeLoan?.createdAt || Date.now()).toLocaleDateString()}<br />13:00 PM</div>
                        <div style={{ borderLeft: '2px solid transparent', paddingLeft: '1.5rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-7px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>Application Initialized</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>New {activeLoan?.purpose || 'Personal Loan'} application started via the Platform.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoanHistory;
