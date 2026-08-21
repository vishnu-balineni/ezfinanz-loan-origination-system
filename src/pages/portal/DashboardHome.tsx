import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock, CheckCircle2, ChevronRight,
    Wallet, Banknote, Calendar, ShieldAlert,
    Download, RefreshCcw, Headset,
    PiggyBank, Info
} from 'lucide-react';
import api from '../../services/api';
import './DashboardHome.css';
import './ProfileStyles.css'; // For the dark hero region

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

const mapBackendStatus = (status: string) => {
    if (status === 'PENDING_ADMIN_REVIEW' || status === 'PENDING_KYC') return 'Pending Review';
    if (status === 'APPROVED') return 'Approved & Disbursed';
    if (status === 'CLOSED') return 'Completed';
    if (status === 'REJECTED') return 'Rejected';
    return status;
};

const DashboardHome = () => {
    const navigate = useNavigate();
    // Dynamic Application State
    const [loanDetails, setLoanDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get Logged In User
    const storedUser = JSON.parse(localStorage.getItem('user') || '{"fullName": "Guest"}');
    const firstName = storedUser.fullName ? storedUser.fullName.split(' ')[0] : 'Guest';

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!storedUser.id) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await api.get(`/loans/my-loans/${storedUser.id}`);
                const loans = response.data;
                if (loans && loans.length > 0) {
                    const currentLoan = loans[loans.length - 1];
                    setLoanDetails(currentLoan);
                    localStorage.setItem('currentLoanId', currentLoan.id.toString());
                }
            } catch (err) {
                console.error("Failed to load loan data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getNextEmiDate = () => {
        if (!loanDetails?.createdAt) return 'N/A';
        const date = new Date(loanDetails.createdAt);
        date.setMonth(date.getMonth() + 1);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getFormattedDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const isVerified = storedUser.isKycVerified || false;
    const loanStatus = loanDetails?.status === 'APPROVED' ? 'active' : 'pending';

    if (isLoading) {
        return <div style={{ padding: '2rem' }}>Loading your dashboard...</div>;
    }

    // Completely new user state with no loans whatsoever
    if (!loanDetails) {
        return (
            <>
                <div className="profile-header-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="header-user-info">
                        <h2 className="header-user-name">Welcome aboard, {firstName}!</h2>
                        <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                            Start your seamless digital lending journey today.
                        </span>
                    </div>
                </div>

                <div className="dash-card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <Wallet size={48} color="#94a3b8" style={{ margin: '0 auto 1.5rem auto' }} />
                    <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>No Active Loans Found</h3>
                    <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
                        You haven't requested any loans yet. Get verified and apply below to access customized funding instantly.
                    </p>
                    {isVerified ? (
                        <button onClick={() => navigate('/dashboard/apply')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                            Start Loan Application
                        </button>
                    ) : (
                        <button onClick={() => navigate('/dashboard/verify')} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                            Complete Identity Verification first
                        </button>
                    )}
                </div>
            </>
        )
    }

    return (
        <>
            {/* 1. Hero Region (Dark Navy Top Banner) */}
            <div className="profile-header-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="header-user-info">
                    <h2 className="header-user-name">Welcome back, {firstName}!</h2>
                    <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                        Your central dashboard for managing active loans and applications.
                    </span>
                </div>
            </div>

            {/* Alert Banner */}
            {loanStatus === 'pending' && (
                <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: '#b45309' }}>
                    <Clock size={24} />
                    <div>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Application Under Review</strong>
                        <span style={{ fontSize: '0.9rem' }}>⏳ Your requested loan is currently under Admin Review. We are verifying your details.</span>
                    </div>
                </div>
            )}

            {loanStatus === 'active' && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: '#065f46' }}>
                    <CheckCircle2 size={24} />
                    <div>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Loan Active & Disbursed</strong>
                        <span style={{ fontSize: '0.9rem' }}>🎉 Congratulations! Your loan has been successfully disbursed to your bank account.</span>
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

                            <h3 style={{ fontSize: '1rem', color: '#94a3b8', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Next EMI Payment Due</h3>
                            <div style={{ fontSize: '3.5rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
                                {formatCurrency(loanDetails?.approvedAmount ? Math.floor(loanDetails.approvedAmount * 0.08885) : 8885)}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', marginBottom: '2rem' }}>
                                <Calendar size={18} /> Auto-debit scheduled for {getNextEmiDate()}
                            </div>
                            <button onClick={() => navigate('/dashboard/history', { state: { selectedLoanId: loanDetails.id } })} style={{ background: '#10b981', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: '0.5rem', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                                Pay Manually Now
                            </button>
                        </div>
                    ) : (
                        <div className="dash-card">
                            <h3 className="card-title">Application Timeline Tracker</h3>
                            <div className="timeline-container">
                                <div className="timeline-step">
                                    <div className="timeline-icon completed"><CheckCircle2 size={18} /></div>
                                    <div className="timeline-content completed">
                                        <h4>Form Submitted</h4>
                                        <p>Eligibility & Application sent.</p>
                                    </div>
                                </div>
                                <div className="timeline-step">
                                    <div className={`timeline-icon ${isVerified ? 'completed' : 'pending'}`}>
                                        {isVerified && <CheckCircle2 size={18} />}
                                    </div>
                                    <div className={`timeline-content ${isVerified ? 'completed' : ''}`}>
                                        <h4>Bank & KYC Verified</h4>
                                        <p>{isVerified ? 'Identity confirmed securely.' : 'Pending Identity Verification.'}</p>
                                    </div>
                                </div>
                                <div className="timeline-step">
                                    <div className={`timeline-icon ${loanDetails?.status === 'PENDING_ADMIN_REVIEW' ? 'current' : (loanDetails?.status === 'APPROVED' ? 'completed' : 'pending')}`}>
                                        {loanDetails?.status === 'PENDING_ADMIN_REVIEW' && <Clock size={16} />}
                                        {loanDetails?.status === 'APPROVED' && <CheckCircle2 size={18} />}
                                    </div>
                                    <div className="timeline-content">
                                        <h4>Admin Review</h4>
                                        <p>{loanDetails?.status === 'REJECTED' ? 'Application was rejected.' : 'Currently verifying your profile.'}</p>
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

                    {/* 3. Loan Component Overhauled (Clarified terms) */}
                    <div className="dash-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <h3 className="card-title" style={{ margin: 0 }}>
                                {loanStatus === 'active' ? 'Active Loan Summary' : 'Requested Loan Overview'}
                            </h3>
                            <span title="Details regarding your principal amount and interest.">
                                <Info size={16} color="#94a3b8" />
                            </span>
                        </div>

                        <div className="loan-stats-grid">
                            <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Banknote size={16} color="#10b981" />
                                    {loanStatus === 'active' ? 'Total Disbursed' : 'Requested Amount'}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                                    {formatCurrency(loanStatus === 'active' ? (loanDetails?.approvedAmount || 0) : (loanDetails?.requestedAmount || 0))}
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} color="#3b82f6" />
                                    {loanStatus === 'active' ? 'Total Tenure' : 'Preferred Tenure'}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                                    {loanDetails?.termMonths || 12} Months
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ShieldAlert size={16} color="#8b5cf6" />
                                    {loanStatus === 'active' ? 'Fixed Interest Rate' : 'Expected APR'}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                                    12% p.a.
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem', background: loanStatus === 'active' ? '#ecfdf5' : '#f8fafc', borderRadius: '0.75rem', border: `1px solid ${loanStatus === 'active' ? '#a7f3d0' : '#e2e8f0'}` }}>
                                <div style={{ color: loanStatus === 'active' ? '#047857' : '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {loanStatus === 'active' ? <PiggyBank size={16} /> : <Clock size={16} />}
                                    {loanStatus === 'active' ? 'Outstanding Principal' : 'Current Status'}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: loanStatus === 'active' ? '#065f46' : '#1e293b' }}>
                                    {loanStatus === 'active' ? formatCurrency(loanDetails?.approvedAmount ? loanDetails.approvedAmount * 0.9 : 0) : mapBackendStatus(loanDetails?.status || '')}
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
                            <button className="quick-action-btn" onClick={() => alert('Bank Mandate update initiated.')}>
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
                            {loanDetails?.status === 'APPROVED' && (
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div style={{ color: '#10b981', paddingTop: '2px' }}><CheckCircle2 size={18} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Loan Disbursed</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{getFormattedDate(loanDetails?.updatedAt || loanDetails?.createdAt)}</div>
                                    </div>
                                </div>
                            )}

                            {isVerified && (
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div style={{ color: '#10b981', paddingTop: '2px' }}><CheckCircle2 size={18} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Bank & KYC Verified</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{getFormattedDate(loanDetails?.createdAt)}</div>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ color: '#10b981', paddingTop: '2px' }}><CheckCircle2 size={18} /></div>
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Application Initiated</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{getFormattedDate(loanDetails?.createdAt)}</div>
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
