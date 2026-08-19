import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, FileText, WalletCards, ShieldCheck } from 'lucide-react';
import { Stepper } from '../../components/Stepper';
import { triggerCustomAlert } from '../../components/shared/CustomAlertModal';
import SelfiePage from '../SelfiePage';
import api from '../../services/api';
import './DashboardHome.css';
import './ProfileStyles.css';

// We create an internal inline component for the first "Requirements" step (previously all of ApplyLoan)
const LoanRequirementsStep = ({ onNext }: { onNext: (amount: number, purpose: string) => void }) => {
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
                onClick={() => onNext(loanAmount, purpose)}
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

    // In production, this comes from true localStorage payload synced with backend auth
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isVerified = storedUser.isKycVerified || false;

    const [currentStep, setCurrentStep] = useState(1);

    const [finalAmount, setFinalAmount] = useState(0);
    const [finalPurpose, setFinalPurpose] = useState('');

    const fastTrackSteps = ["Requirements", "Liveness Check", "Done"];

    const activeSteps = fastTrackSteps;

    const handleNext = async (amount?: number, purpose?: string) => {
        if (currentStep === 1 && amount && purpose) {
            setFinalAmount(amount);
            setFinalPurpose(purpose);
            window.scrollTo(0, 0);
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Liveness Selfie is Complete -> Submit to backend!
            try {
                await api.post('/loans/apply', {
                    userId: storedUser.id,
                    requestedAmount: finalAmount,
                    termMonths: 12, // Defaulting logic for fast track
                    purpose: finalPurpose
                });
                window.scrollTo(0, 0);
                setCurrentStep(3);
            } catch (err) {
                triggerCustomAlert('error', 'Failed to create loan application.', 'Application Failed');
                console.error(err);
            }
        }
    };

    // If User is Not verified, they shouldn't even be able to start Apply Flow
    if (!isVerified) {
        return (
            <div className="onboarding-dashboard-view">
                <div className="dash-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
                    <ShieldCheck size={64} color="#eab308" style={{ margin: '0 auto 1.5rem auto' }} />
                    <h2 style={{ color: '#854d0e', marginBottom: '1rem', fontSize: '2rem' }}>Verification Required</h2>
                    <p style={{ color: '#713f12', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.1rem' }}>
                        To prevent fraud and comply with RBI guidelines, you must complete your Identity Verification, KYC, and Bank mapping before applying for a loan.
                    </p>
                    <button onClick={() => navigate('/dashboard/verify')} className="action-btn" style={{ margin: '0 auto', background: '#eab308', color: 'white', border: 'none' }}>
                        Go to Verification Portal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="onboarding-dashboard-view">
            <div className="profile-header-card" style={{ marginBottom: '2rem' }}>
                <div className="header-user-info">
                    <h2 className="header-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShieldCheck size={28} color="#10b981" />
                        Fast-Track Loan Application
                    </h2>
                    <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                        Since you are successfully verified, you just need a quick liveness check to confirm intent!
                    </span>
                </div>
            </div>

            {currentStep < activeSteps.length && (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                    <Stepper currentStep={currentStep} steps={activeSteps} />
                </div>
            )}

            <div className="wizard-content-area step-wrapper-clean">
                {currentStep === 1 && <LoanRequirementsStep onNext={handleNext} />}
                {currentStep === 2 && <SelfiePage onComplete={handleNext} />}

                {currentStep === 3 && (
                    <div className="dash-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
                        <CheckCircle2 size={64} color="#16a34a" style={{ margin: '0 auto 1.5rem auto' }} />
                        <h2 style={{ color: '#065f46', marginBottom: '1rem', fontSize: '2rem' }}>Application Submitted!</h2>
                        <p style={{ color: '#047857', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.1rem' }}>
                            Liveness check passed. Your loan request is now successfully fast-tracked to the Admin desk. Once approved, it will be instantly disbursed to your previously verified bank account.
                        </p>
                        <button onClick={() => navigate('/dashboard')} className="action-btn" style={{ margin: '0 auto' }}>
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyLoan;
