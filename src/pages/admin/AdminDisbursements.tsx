import { useState } from 'react';
import {
    Banknote, CheckCircle2, ShieldCheck,
    ArrowRight, Wallet, Activity, RefreshCw
} from 'lucide-react';
import './AdminDashboard.css';

// Mock data representing loans fully approved by underwriters and ready for bank transfer
const mockDisbursements = [
    {
        id: "EZ-1049",
        name: "Ravi Kumar",
        amount: 250000,
        bank: "HDFC Bank (**** 4567)",
        approvedBy: "Admin_Sarah",
        time: "10 mins ago",
        status: "Ready"
    },
    {
        id: "EZ-1050",
        name: "Anita Desai",
        amount: 50000,
        bank: "ICICI Bank (**** 8901)",
        approvedBy: "Admin_Rahul",
        time: "1 hour ago",
        status: "Ready"
    },
    {
        id: "EZ-1033",
        name: "Mohammad Ali",
        amount: 500000,
        bank: "SBI (**** 1122)",
        approvedBy: "Auto-Underwritten",
        time: "2 hours ago",
        status: "Ready"
    }
];

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

const AdminDisbursements = () => {
    // We maintain a list of completed transactions to simulate real-time UI updates
    const [queue, setQueue] = useState(mockDisbursements);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleDisburse = (id: string) => {
        setProcessingId(id);

        // Simulating an API call to a payment gateway (e.g. RazorPayX)
        setTimeout(() => {
            setQueue(prev => prev.filter(app => app.id !== id));
            setProcessingId(null);
            // In a real app we'd dispatch a success toast here
        }, 1500);
    };

    const totalTobeDisbursed = queue.reduce((sum, app) => sum + app.amount, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* 1. Hero Region */}
            <div className="profile-header-card">
                <div className="header-user-info">
                    <h2 className="header-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Banknote size={28} color="#10b981" /> Treasury & Final Disbursements
                    </h2>
                    <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                        Release funds for approved applications. Ensure institutional wallet balance covers the queue.
                    </span>
                </div>
            </div>

            {/* 2. Treasury Wallet Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

                {/* Corporate Wallet Balance */}
                <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '1rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Master Pool Balance</div>
                        <Wallet size={20} color="#10b981" />
                    </div>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem' }}>₹1.25 Cr</div>
                        <div style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem' }}>
                            <ShieldCheck size={14} /> ICICI Escrow Account Connected
                        </div>
                    </div>
                </div>

                {/* Queue Requirements */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Required for Queue</div>
                        <div style={{ background: '#fef3c7', padding: '0.35rem', borderRadius: '0.5rem' }}>
                            <Banknote size={16} color="#d97706" />
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', color: '#1e293b' }}>{formatCurrency(totalTobeDisbursed)}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                            For {queue.length} approved applications
                        </div>
                    </div>
                </div>

                {/* Integration Health */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Payment API Health</div>
                        <Activity size={20} color="#3b82f6" />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>RazorPayX (Online)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>IMPS/NEFT Gateway (Online)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Disbursement Queue Table */}
            <div className="table-card">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '1rem 1rem 0 0' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={20} color="#10b981" /> Approved for Disbursal
                    </h3>
                </div>

                <div style={{ overflowX: 'auto', background: 'white', borderRadius: '0 0 1rem 1rem' }}>
                    {queue.length === 0 ? (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
                            <Banknote size={48} color="#10b981" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                            <h3>Disbursement Queue Empty</h3>
                            <p>All approved applications have been fully funded.</p>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>App ID</th>
                                    <th>Applicant</th>
                                    <th>Beneficiary Account</th>
                                    <th>Approved By</th>
                                    <th>Disbursement Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queue.map((app) => (
                                    <tr key={app.id}>
                                        <td className="app-id">#{app.id}</td>
                                        <td>
                                            <div className="app-name">{app.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>Waiting since: {app.time}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{app.bank}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                                                <CheckCircle2 size={12} /> Account Verified
                                            </div>
                                        </td>
                                        <td style={{ color: '#475569', fontSize: '0.9rem' }}>
                                            {app.approvedBy}
                                        </td>
                                        <td style={{ fontWeight: 800, color: '#065f46', fontSize: '1.1rem' }}>
                                            {formatCurrency(app.amount)}
                                        </td>
                                        <td>
                                            <button
                                                disabled={processingId === app.id}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                    background: processingId === app.id ? '#94a3b8' : '#10b981',
                                                    color: 'white', border: 'none', padding: '0.5rem 1rem',
                                                    borderRadius: '9999px', fontWeight: 600, cursor: processingId === app.id ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.2s', width: '135px', justifyContent: 'center'
                                                }}
                                                onClick={() => handleDisburse(app.id)}
                                            >
                                                {processingId === app.id ? (
                                                    <>
                                                        <RefreshCw size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>Release Funds <ArrowRight size={14} /></>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AdminDisbursements;
