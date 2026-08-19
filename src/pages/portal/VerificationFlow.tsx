import { useState } from 'react';
import KycPage from '../KycPage';
import EligibilityPage from '../EligibilityPage';
import BankDetailsPage from '../BankDetailsPage';
import SelfiePage from '../SelfiePage';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Stepper } from '../../components/Stepper';
import './ProfileStyles.css';

const VerificationFlow = () => {
    // Get Logged In User
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isVerified = storedUser.isKycVerified || false;

    // Verification Flow State (0: KYC, 1: Eligibility, 2: Bank, 3: Selfie, 4: Done)
    const [onboardingStep, setOnboardingStep] = useState(isVerified ? 4 : 0);

    return (
        <div className="onboarding-dashboard-view">
            <div className="profile-header-card" style={{ marginBottom: '2rem' }}>
                <div className="header-user-info">
                    <h2 className="header-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShieldCheck size={28} color="#10b981" /> Identity & Verification
                    </h2>
                    <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                        Complete the required regulatory steps to unlock your loan disbursal.
                    </span>
                </div>
            </div>

            <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                <Stepper currentStep={onboardingStep + 2} />
            </div>

            {onboardingStep < 4 ? (
                <div className="onboarding-widget-container" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                    {onboardingStep === 0 && <KycPage onComplete={() => setOnboardingStep(1)} />}
                    {onboardingStep === 1 && <EligibilityPage onComplete={() => setOnboardingStep(2)} />}
                    {onboardingStep === 2 && <BankDetailsPage onComplete={() => setOnboardingStep(3)} />}
                    {onboardingStep === 3 && <SelfiePage onComplete={() => setOnboardingStep(4)} />}
                </div>
            ) : (
                <div style={{ background: '#ecfdf5', padding: '3rem', borderRadius: '1rem', border: '1px solid #a7f3d0', textAlign: 'center', marginTop: '2rem' }}>
                    <CheckCircle2 size={64} color="#16a34a" style={{ margin: '0 auto 1.5rem auto' }} />
                    <h2 style={{ color: '#065f46', marginBottom: '1rem' }}>Verification Complete!</h2>
                    <p style={{ color: '#047857', maxWidth: '600px', margin: '0 auto' }}>
                        Your identity documents, bank details, and selfies have been securely submitted.
                        Please return to the Dashboard to track your administrative review status.
                    </p>
                </div>
            )}
        </div>
    );
};

export default VerificationFlow;
