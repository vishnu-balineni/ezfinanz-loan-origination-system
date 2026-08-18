import { useState } from 'react';
import KycPage from '../KycPage';
import EligibilityPage from '../EligibilityPage';
import BankDetailsPage from '../BankDetailsPage';
import SelfiePage from '../SelfiePage';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const VerificationFlow = () => {
    // Verification Flow State (0: KYC, 1: Eligibility, 2: Bank, 3: Selfie, 4: Done)
    const [onboardingStep, setOnboardingStep] = useState(0);

    return (
        <div className="onboarding-dashboard-view">
            <header className="welcome-header" style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: '#1e293b', fontSize: '1.75rem' }}>
                    <ShieldCheck size={28} color="#16a34a" /> Identity & Verification
                </h1>
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Complete the required regulatory steps to unlock your loan disbursal.</p>
            </header>

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
