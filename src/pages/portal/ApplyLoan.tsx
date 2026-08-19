import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, FileText, WalletCards, ShieldCheck } from 'lucide-react';
import { Stepper } from '../../components/Stepper';
import KycPage from '../KycPage';
import EligibilityPage from '../EligibilityPage';
import BankDetailsPage from '../BankDetailsPage';
import SelfiePage from '../SelfiePage';
import './DashboardHome.css';
import './ProfileStyles.css';

// We create an internal inline component for the first "Requirements" step (previously all of ApplyLoan)
const LoanRequirementsStep = ({ onNext }: { onNext: () => void }) => {
    const [loanAmount, setLoanAmount] = useState<number>(50000);
    const [purpose, setPurpose] = useState<string>('');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', maximumFractionDigits: 0
        }).format(value);
    };

    const purposes = [
        { id: 'medical', title: 'Medical' },
        { id: 'home', title: 'Home Renovation' },
        { id: 'education', title: 'Education' },
        { id: 'personal', title: 'Personal/Travel' }
    ];

    return (
        <div className="dash-card animate-fade-in" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText color="#10b981" /> 1. What is the primary purpose of this loan?
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                {purposes.map(p => (
                    <div
                        key={p.id}
                        onClick={() => setPurpose(p.id)}
                        style={{
                            padding: '1.25rem', borderRadius: '1rem', cursor: 'pointer',
                            border: `2px solid ${purpose === p.id ? '#10b981' : '#e2e8f0'}`,
                            background: purpose === p.id ? '#ecfdf5' : 'white',
                            transition: 'all 0.2s', textAlign: 'center',
                            fontWeight: 600, color: purpose === p.id ? '#065f46' : '#64748b'
                        }}
                    >
                        {p.title}
                    </div>
                ))}
            </div>

            <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <WalletCards color="#10b981" /> 2. How much do you need?
            </h3>

            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: 700, color: '#10b981', fontSize: '1.75rem' }}>
                    <span>Amount</span>
                    <span>{formatCurrency(loanAmount)}</span>
                </div>
                <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="5000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    style={{
                        width: '100%', height: '8px', background: '#cbd5e1',
                        borderRadius: '4px', outline: 'none', cursor: 'pointer', marginBottom: '1rem'
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>
                    <span>₹10K</span>
                    <span>₹10L</span>
                </div>
            </div>

            <button
                type="button"
                onClick={onNext}
                disabled={!purpose}
                className="action-btn"
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center' }}
            >
                Confirm Requirements & Continue
            </button>
        </div>
    );
};


const ApplyLoan = () => {
    const navigate = useNavigate();

    // Developer Mock State to trigger Fast-Track behavior
    // In production, this would come from a Redux store or React Context (e.g. user.kycStatus === 'VERIFIED')
    const [isVerified, setIsVerified] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);

    const normalSteps = ["Requirements", "Eligibility", "KYC", "Bank", "Selfie", "Done"];
    const fastTrackSteps = ["Requirements", "Liveness Check", "Done"];

    const activeSteps = isVerified ? fastTrackSteps : normalSteps;

    const handleNext = () => {
        window.scrollTo(0, 0);
        setCurrentStep(prev => prev + 1);
    };

    return (
        <div className="onboarding-dashboard-view">
            <div className="profile-header-card" style={{ marginBottom: '2rem' }}>
                <div className="header-user-info">
                    <h2 className="header-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShieldCheck size={28} color="#10b981" />
                        {isVerified ? "Fast-Track Loan Application" : "Loan Application Wizard"}
                    </h2>
                    <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                        {isVerified
                            ? "Since you are already a verified customer, you just need a quick liveness check!"
                            : "Complete these steps logically to secure your EZFINANZ disbursal."}
                    </span>

                    {/* Developer Mock Toggle */}
                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6366f1', cursor: 'pointer' }}>
                            <input type="checkbox" checked={isVerified} onChange={(e) => { setIsVerified(e.target.checked); setCurrentStep(1); }} />
                            [Dev Toggle] Pre-Verified User?
                        </label>
                    </div>
                </div>
            </div>

            {currentStep < activeSteps.length && (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                    <Stepper currentStep={currentStep} steps={activeSteps} />
                </div>
            )}

            <div className="wizard-content-area step-wrapper-clean">
                {/* 
                   DYNAMIC ROUTING BASED ON isVerified 
                */}
                {isVerified ? (
                    <>
                        {currentStep === 1 && <LoanRequirementsStep onNext={handleNext} />}
                        {currentStep === 2 && <SelfiePage onComplete={handleNext} />}

                        {currentStep === 3 && (
                            <div className="dash-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
                                <CheckCircle2 size={64} color="#16a34a" style={{ margin: '0 auto 1.5rem auto' }} />
                                <h2 style={{ color: '#065f46', marginBottom: '1rem', fontSize: '2rem' }}>Application Fast-Tracked!</h2>
                                <p style={{ color: '#047857', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.1rem' }}>
                                    Liveness check passed. Your loan request will be instantly disbursed to your previously verified bank account.
                                </p>
                                <button onClick={() => navigate('/dashboard')} className="action-btn" style={{ margin: '0 auto' }}>
                                    Return to Dashboard
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {currentStep === 1 && <LoanRequirementsStep onNext={handleNext} />}
                        {currentStep === 2 && <EligibilityPage onComplete={handleNext} />}
                        {currentStep === 3 && <KycPage onComplete={handleNext} />}
                        {currentStep === 4 && <BankDetailsPage onComplete={handleNext} />}
                        {currentStep === 5 && <SelfiePage onComplete={handleNext} />}

                        {currentStep === 6 && (
                            <div className="dash-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
                                <CheckCircle2 size={64} color="#16a34a" style={{ margin: '0 auto 1.5rem auto' }} />
                                <h2 style={{ color: '#065f46', marginBottom: '1rem', fontSize: '2rem' }}>Application Complete!</h2>
                                <p style={{ color: '#047857', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.1rem' }}>
                                    Your application, identity documents, bank details, and selfies have been securely stored.
                                    Please return to the Dashboard to track your administrative review status.
                                </p>
                                <button onClick={() => navigate('/dashboard')} className="action-btn" style={{ margin: '0 auto' }}>
                                    Go to Dashboard
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ApplyLoan;
