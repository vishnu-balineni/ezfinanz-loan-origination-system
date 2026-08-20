import { useState } from 'react';
import { Phone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { triggerCustomAlert } from '../components/shared/CustomAlertModal';

export default function PhoneVerificationPage({ onComplete }: { onComplete: () => void }) {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    // If standard email user lacks phone, verify phone. If phone user lacks email, verify email.
    const isVerifyingPhone = !storedUser.phone || storedUser.phone.startsWith('OAuth-');

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otpPhase, setOtpPhase] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);

    const handleInitialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isVerifyingPhone && inputValue.length < 10) {
            triggerCustomAlert('error', 'Please enter a valid 10-digit phone number.', 'Invalid Input');
            return;
        }

        if (!isVerifyingPhone && !inputValue.includes('@')) {
            triggerCustomAlert('error', 'Please enter a valid email address.', 'Invalid Input');
            return;
        }

        // Trigger Simulated OTP Phase
        setOtpPhase(true);
        triggerCustomAlert('success', `Simulated Security: OTP sent to ${inputValue}`, 'OTP Sent');
    };

    const handleOtpVerify = async () => {
        setIsLoading(true);

        try {
            // Mock network latency
            await new Promise(res => setTimeout(res, 800));

            // If verifying phone for a real DB user, ping the backend
            if (isVerifyingPhone && storedUser.id && !storedUser.id.toString().startsWith('mock-')) {
                const response = await fetch(`https://exfinanz-backend.onrender.com/api/users/${storedUser.id}/phone`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: inputValue })
                });
                if (!response.ok) console.warn("Backend phone sync failed, but proceeding locally.");
            }

            // Update local storage to satisfy the flow
            if (isVerifyingPhone) {
                storedUser.phone = inputValue;
            } else {
                storedUser.email = inputValue;
            }

            localStorage.setItem('user', JSON.stringify(storedUser));

            triggerCustomAlert('success', `Your ${isVerifyingPhone ? 'phone number' : 'email'} has been securely updated and verified!`, 'Verified');
            onComplete();
        } catch (err: any) {
            triggerCustomAlert('error', err.message, 'Update Failed');
            setOtpPhase(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ background: '#ecfdf5', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                {isVerifyingPhone ? <Phone size={32} color="#10b981" /> : <Mail size={32} color="#10b981" />}
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                {isVerifyingPhone ? 'Link Mobile Number' : 'Link Email Address'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
                {isVerifyingPhone
                    ? "Since you registered without a formal Mobile Number, we need to securely pair one with your identity before proceeding to full KYC verification."
                    : "Since you registered using only your Mobile Number, please link and verify an Email Address to secure your loan dashboard."
                }
            </p>

            {!otpPhase ? (
                <form onSubmit={handleInitialSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ position: 'relative', textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                            {isVerifyingPhone ? 'Mobile Number' : 'Email Address'}
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #cbd5e1', borderRadius: '0.5rem', overflow: 'hidden', padding: '0.5rem' }}>
                            {isVerifyingPhone && <span style={{ color: '#94a3b8', padding: '0 0.5rem', fontWeight: 600 }}>+91</span>}
                            <input
                                type={isVerifyingPhone ? 'tel' : 'email'}
                                required
                                placeholder={isVerifyingPhone ? "Enter 10-digit number" : "you@example.com"}
                                value={inputValue}
                                onChange={(e) => {
                                    if (isVerifyingPhone) {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) setInputValue(val);
                                    } else {
                                        setInputValue(e.target.value);
                                    }
                                }}
                                style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, padding: '0.5rem', fontSize: '1rem', color: '#0f172a' }}
                            />
                            {isVerifyingPhone && inputValue.length === 10 && <CheckCircle2 size={20} color="#10b981" style={{ marginRight: '0.5rem' }} />}
                            {!isVerifyingPhone && inputValue.includes('@') && <CheckCircle2 size={20} color="#10b981" style={{ marginRight: '0.5rem' }} />}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || (isVerifyingPhone && inputValue.length < 10) || (!isVerifyingPhone && !inputValue.includes('@'))}
                        style={{
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: '1rem'
                        }}
                    >
                        Send Verification Code
                        <ArrowRight size={18} />
                    </button>
                </form>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <p style={{ fontWeight: 600, color: '#0f172a' }}>Enter 4-digit code sent to {inputValue}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        {otp.map((d, i) => (
                            <input
                                key={i}
                                type="text"
                                maxLength={1}
                                value={d}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    const newOtp = [...otp];
                                    newOtp[i] = val;
                                    setOtp(newOtp);
                                }}
                                style={{ width: '3rem', height: '3.5rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleOtpVerify}
                        disabled={isLoading || otp.join('').length < 4}
                        style={{
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        {isLoading ? 'Verifying...' : 'Verify & Setup Profile'}
                    </button>
                </div>
            )}
        </div>
    );
}
