import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock, CheckCircle2, ChevronRight,
    Banknote, Calendar, ShieldAlert, User, HelpCircle, FileText
} from 'lucide-react';
import KycPage from '../KycPage';
import EligibilityPage from '../EligibilityPage';
import BankDetailsPage from '../BankDetailsPage';
import SelfiePage from '../SelfiePage';
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

    // Verification Flow State (0: KYC, 1: Eligibility, 2: Bank, 3: Selfie, 4: Done)
    const [onboardingStep, setOnboardingStep] = useState(0);

    // Mock Payload for user
    const user = {
        name: "Rahul Sharma",
        loanAmount: 100000,
        tenure: 12,
        emi: 8885
    };

    // If verification is not complete, hijack the dashboard exactly as requested.
    if (onboardingStep < 4) {
        return (
            <div className="onboarding-dashboard-view">
                <header className="welcome-header" style={{ marginBottom: '1rem' }}>
                    <h1>Welcome back, {user.name.split(' ')[0]}</h1>
                    <p>Please complete your verification to unlock your EZFINANZ dashboard.</p>
                </header>

                <div className="onboarding-widget-container" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                    {onboardingStep === 0 && <KycPage onComplete={() => setOnboardingStep(1)} />}
                    {onboardingStep === 1 && <EligibilityPage onComplete={() => setOnboardingStep(2)} />}
                    {onboardingStep === 2 && <BankDetailsPage onComplete={() => setOnboardingStep(3)} />}
                    {onboardingStep === 3 && <SelfiePage onComplete={() => setOnboardingStep(4)} />}
                </div>
            </div>
        );
    }

    return (
        <>
            <header className="welcome-header">
                <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
                <p>Here is the current status of your active loan application.</p>
            </header>

            <div className="dashboard-grid">

                {/* Left Column: Alerts & Loan Details */}
                <div className="dash-left-col">

                    {/* Status Alert Banner */}
                    <div className="status-banner">
                        <div className="status-icon-wrapper">
                            <Clock size={28} />
                        </div>
                        <div className="status-content">
                            <h3>Application Under Review</h3>
                            <p>Your loan application is currently being thoroughly reviewed by our administrative team. We are verifying your KYC documents and identity. You will be notified via SMS and Email once a final decision is made.</p>
                        </div>
                    </div>

                    {/* Loan Overview Card */}
                    <div className="dash-card">
                        <h3 className="card-title">Requested Loan Details</h3>
                        <div className="loan-details-grid">
                            <div className="detail-item">
                                <span className="detail-label"><Banknote size={16} /> Amount</span>
                                <span className="detail-value">{formatCurrency(user.loanAmount)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label"><Calendar size={16} /> Tenure</span>
                                <span className="detail-value">{user.tenure} mo</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label"><ShieldAlert size={16} /> Monthly EMI</span>
                                <span className="detail-value">{formatCurrency(user.emi)}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Timeline & Quick Actions */}
                <div className="dash-right-col">

                    {/* Timeline Tracker */}
                    <div className="dash-card" style={{ marginBottom: '2rem' }}>
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

                    {/* Quick Actions List */}
                    <div className="dash-card">
                        <h3 className="card-title">Quick Actions</h3>
                        <div className="action-list">
                            <button className="quick-action-btn" onClick={() => navigate('/dashboard/profile')}>
                                <div className="quick-action-left">
                                    <User size={18} /> Update Profile
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="quick-action-btn" onClick={() => navigate('/dashboard/documents')}>
                                <div className="quick-action-left">
                                    <FileText size={18} /> View Documents
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="quick-action-btn" onClick={() => alert('Support launched!')}>
                                <div className="quick-action-left">
                                    <HelpCircle size={18} /> Contact Support
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default DashboardHome;
