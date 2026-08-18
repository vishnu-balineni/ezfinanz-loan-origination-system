import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock, CheckCircle2, ChevronRight,
    Wallet, Banknote, Calendar, ShieldAlert,
    Download, RefreshCcw, Headset
} from 'lucide-react';
import './DashboardHome.css';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

const DashboardHome = () => {
    const navigate = useNavigate();

    // Toggle for Demo purposes to show both states asked in UX blueprint
    const [loanStatus, setLoanStatus] = useState<'pending' | 'active'>('active');

    // Mock Payload for user
    const user = {
        name: "Rahul Sharma",
        loanAmount: 100000,
        tenure: 12,
        interestRate: 12,
        outstandingBalance: 65000,
        emi: 8885
    };

    return (
        <>
            {/* Demo Toggle Banner (To easily show the user both UX states) */}
            <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100, background: 'white', padding: '0.5rem', borderRadius: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', gap: '0.5rem', border: '1px solid #e2e8f0' }}>
                <button
                    onClick={() => setLoanStatus('pending')}
                    style={{ background: loanStatus === 'pending' ? '#eab308' : 'transparent', color: loanStatus === 'pending' ? 'white' : '#64748b', padding: '0.5rem 1rem', borderRadius: '1.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                    Pending View
                </button>
                <button
                    onClick={() => setLoanStatus('active')}
                    style={{ background: loanStatus === 'active' ? '#10b981' : 'transparent', color: loanStatus === 'active' ? 'white' : '#64748b', padding: '0.5rem 1rem', borderRadius: '1.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                    Active View
                </button>
            </div>

            {/* 1. Welcome Header & Alert Banner */}
            <header className="welcome-header">
                <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
                <p>Welcome to your central loan management hub.</p>
            </header>

            {loanStatus === 'pending' && (
                <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: '#b45309' }}>
                    <Clock size={24} />
                    <div>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Application Under Review</strong>
                        <span style={{ fontSize: '0.9rem' }}>⏳ Your application is currently under Admin Review. Our team is verifying your details.</span>
                    </div>
                </div>
            )}

            {loanStatus === 'active' && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: '#065f46' }}>
                    <CheckCircle2 size={24} />
                    <div>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Loan Active & Disbursed</strong>
                        <span style={{ fontSize: '0.9rem' }}>🎉 Congratulations! Your loan of {formatCurrency(user.loanAmount)} has been approved and disbursed.</span>
                    </div>
                </div>
            )}

            <div className="dashboard-grid">

                {/* Left Column: Hero Widget & Snapshot */}
                <div className="dash-left-col">

                    {/* 2. Hero Widget */}
                    {loanStatus === 'active' ? (
                        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '2.5rem 2rem', borderRadius: '1rem', color: 'white', marginBottom: '2rem', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
                                <Wallet size={150} />
                            </div>

                            <h3 style={{ fontSize: '1rem', color: '#94a3b8', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Next Payment Due</h3>
                            <div style={{ fontSize: '3.5rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
                                {formatCurrency(user.emi)}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', marginBottom: '2rem' }}>
                                <Calendar size={18} /> Due on 05 Nov 2026
                            </div>
                            <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: '0.5rem', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                                Pay Now
                            </button>
                        </div>
                    ) : (
                        <div className="dash-card">
                            <h3 className="card-title">Application Status</h3>
                            <div className="timeline-container">
                                <div className="timeline-step">
                                    <div className="timeline-icon completed"><CheckCircle2 size={18} /></div>
                                    <div className="timeline-content completed">
                                        <h4>Form Submitted</h4>
                                        <p>Eligibility & Application sent.</p>
                                    </div>
                                </div>
                                <div className="timeline-step">
                                    <div className="timeline-icon completed"><CheckCircle2 size={18} /></div>
                                    <div className="timeline-content completed">
                                        <h4>Bank & KYC Verified</h4>
                                        <p>Identity confirmed securely.</p>
                                    </div>
                                </div>
                                <div className="timeline-step">
                                    <div className="timeline-icon current"><Clock size={16} /></div>
                                    <div className="timeline-content">
                                        <h4>Admin Review</h4>
                                        <p>Currently verifying your profile.</p>
                                    </div>
                                </div>
                                <div className="timeline-step">
                                    <div className="timeline-icon pending"></div>
                                    <div className="timeline-content">
                                        <h4>Disbursal</h4>
                                        <p>Funds transfer to bank account.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Loan Snapshot */}
                    <div className="dash-card">
                        <h3 className="card-title">Loan Snapshot</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Banknote size={16} color="#10b981" /> Total Amount
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                                    {formatCurrency(user.loanAmount)}
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} color="#3b82f6" /> Tenure
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                                    {user.tenure} Months
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ShieldAlert size={16} color="#8b5cf6" /> Interest Rate
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                                    {user.interestRate}% p.a.
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem', background: loanStatus === 'active' ? '#ecfdf5' : '#f8fafc', borderRadius: '0.75rem', border: `1px solid ${loanStatus === 'active' ? '#a7f3d0' : '#e2e8f0'}` }}>
                                <div style={{ color: loanStatus === 'active' ? '#047857' : '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Wallet size={16} /> Current Balance
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: loanStatus === 'active' ? '#065f46' : '#1e293b' }}>
                                    {loanStatus === 'active' ? formatCurrency(user.outstandingBalance) : '₹0'}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Quick Actions & Recent Activity */}
                <div className="dash-right-col">

                    {/* 4. Quick Actions */}
                    <div className="dash-card">
                        <h3 className="card-title">Quick Actions</h3>
                        <div className="action-list">
                            <button className="quick-action-btn" onClick={() => navigate('/dashboard/documents')}>
                                <div className="quick-action-left">
                                    <Download size={18} color="#10b981" /> Download Loan Agreement
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="quick-action-btn">
                                <div className="quick-action-left">
                                    <RefreshCcw size={18} color="#3b82f6" /> Update Bank Mandate
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="quick-action-btn" onClick={() => alert('Support launched!')}>
                                <div className="quick-action-left">
                                    <Headset size={18} color="#8b5cf6" /> Contact Support
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* 5. Recent Activity */}
                    <div className="dash-card">
                        <h3 className="card-title">Recent Activity</h3>
                        <div style={{ paddingBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                                <div style={{ color: '#10b981', paddingTop: '2px' }}><CheckCircle2 size={18} /></div>
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Bank Account Verified</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Oct 24, 2026</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                                <div style={{ color: '#10b981', paddingTop: '2px' }}><CheckCircle2 size={18} /></div>
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>KYC Documents Submitted</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Oct 24, 2026</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ color: '#10b981', paddingTop: '2px' }}><CheckCircle2 size={18} /></div>
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Application Initiated</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Oct 24, 2026</div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard/history')}
                            style={{
                                width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0',
                                padding: '1rem', borderRadius: '0.5rem', color: '#3b82f6',
                                fontWeight: 700, cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }}
                        >
                            View Full Timeline & History <ChevronRight size={16} />
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default DashboardHome;
