import { useState } from 'react';
import { Download, History, CheckCircle2, FileText, ArrowLeft, Banknote, Calendar, ChevronRight } from 'lucide-react';
import './DashboardHome.css';

const LoanHistory = () => {
    // If null, show the list of all loans. Otherwise, show the details for the selected loan ID.
    const [selectedLoan, setSelectedLoan] = useState<string | null>(null);

    // Mock data for multiple loans
    const loans = [
        { id: 'L-10294', type: 'Personal Loan', amount: 100000, date: 'Oct 24, 2026', status: 'Active', tenure: 12 },
        { id: 'L-08112', type: 'Consumer Durable', amount: 45000, date: 'Jan 15, 2025', status: 'Closed', tenure: 6 },
        { id: 'L-05331', type: 'Medical Emergency', amount: 200000, date: 'Mar 10, 2023', status: 'Closed', tenure: 24 }
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
    };

    // VIEW: All Loans List
    if (!selectedLoan) {
        return (
            <div className="history-page" style={{ paddingBottom: '2rem' }}>
                <header className="page-header" style={{ marginBottom: '2rem' }}>
                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                        <History size={28} color="#10b981" /> My Loan History
                    </h1>
                    <p className="page-subtitle" style={{ color: '#64748b' }}>Select an active or previous loan to view its payment schedule, logs, and receipts.</p>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {loans.map(loan => (
                        <div key={loan.id} className="dash-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s', cursor: 'pointer', border: '1px solid #e2e8f0' }} onClick={() => setSelectedLoan(loan.id)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <div style={{ background: loan.status === 'Active' ? '#ecfdf5' : '#f1f5f9', color: loan.status === 'Active' ? '#10b981' : '#64748b', padding: '1rem', borderRadius: '0.75rem' }}>
                                    <Banknote size={24} />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>{loan.type}</h3>
                                        <span style={{
                                            background: loan.status === 'Active' ? '#dcfce7' : '#e2e8f0',
                                            color: loan.status === 'Active' ? '#166534' : '#475569',
                                            padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600
                                        }}>
                                            {loan.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                                        <span>ID: {loan.id}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> Issued {loan.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>{formatCurrency(loan.amount)}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{loan.tenure} Months</div>
                                </div>
                                <div style={{ color: '#94a3b8' }}>
                                    <ChevronRight size={24} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // VIEW: Specific Loan Details
    const activeLoan = loans.find(l => l.id === selectedLoan);

    return (
        <div className="history-page" style={{ paddingBottom: '2rem' }}>
            <button
                onClick={() => setSelectedLoan(null)}
                style={{
                    background: 'transparent', border: 'none', color: '#3b82f6',
                    fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem',
                    cursor: 'pointer', padding: 0, marginBottom: '2rem'
                }}
            >
                <ArrowLeft size={18} /> Back to All Loans
            </button>

            <header className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                        {activeLoan?.type} Details
                    </h1>
                    <p className="page-subtitle" style={{ color: '#64748b' }}>Loan Reference ID: {selectedLoan}</p>
                </div>
                <div style={{ textAlign: 'right', background: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Total Disbursed</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{formatCurrency(activeLoan?.amount || 0)}</div>
                </div>
            </header>

            {/* Payment Schedule & Receipts */}
            <div className="dash-card" style={{ marginBottom: '2rem' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                    <FileText size={20} color="#10b981" />
                    Payment Schedule & Receipts
                </h3>

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
                            {activeLoan?.status === 'Active' && (
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
                                <td style={{ padding: '1rem', color: '#1e293b' }}>05 {activeLoan?.status === 'Active' ? 'Oct' : 'Sep'} 2026</td>
                                <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>TXN-9844321A</td>
                                <td style={{ padding: '1rem', color: '#1e293b' }}>EMI Payment</td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>₹{Math.floor((activeLoan?.amount || 0) * 0.08)}</td>
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
                                <td style={{ padding: '1rem', color: '#1e293b' }}>05 {activeLoan?.status === 'Active' ? 'Sep' : 'Aug'} 2026</td>
                                <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>TXN-3211559C</td>
                                <td style={{ padding: '1rem', color: '#1e293b' }}>EMI Payment</td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>₹{Math.floor((activeLoan?.amount || 0) * 0.08)}</td>
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
            </div>

            {/* Application Logs */}
            <div className="dash-card">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                    <CheckCircle2 size={20} color="#10b981" />
                    Application Milestone Logs
                </h3>

                <div style={{ padding: '1rem 0' }}>

                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ minWidth: '120px', color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>{activeLoan?.date}<br />14:02 PM</div>
                        <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1.5rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-7px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>Bank Mandate Registered</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Successful NACH registration with verified bank account.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ minWidth: '120px', color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>{activeLoan?.date}<br />13:50 PM</div>
                        <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1.5rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-7px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>KYC Verified</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Aadhaar XML and PAN verification confirmed via automated systems.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ minWidth: '120px', color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>{activeLoan?.date}<br />13:00 PM</div>
                        <div style={{ borderLeft: '2px solid transparent', paddingLeft: '1.5rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-7px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>Application Initialized</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>New {activeLoan?.type} application started via the Platform.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoanHistory;
