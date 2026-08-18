import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Stepper } from '../components/Stepper';
import './VerificationPage.css';

const VerificationPage = () => {
    const navigate = useNavigate();

    // OTP States
    const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
    const [phoneOtp, setPhoneOtp] = useState(['', '', '', '']);

    // Verification Status States
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    // Timer States
    const [emailTimer, setEmailTimer] = useState(60);
    const [phoneTimer, setPhoneTimer] = useState(60);

    // Handle Timers
    useEffect(() => {
        let timer: number;
        if (emailTimer > 0 && !isEmailVerified) {
            timer = window.setInterval(() => setEmailTimer(prev => prev - 1), 1000);
        }
        return () => window.clearInterval(timer);
    }, [emailTimer, isEmailVerified]);

    useEffect(() => {
        let timer: number;
        if (phoneTimer > 0 && !isPhoneVerified) {
            timer = window.setInterval(() => setPhoneTimer(prev => prev - 1), 1000);
        }
        return () => window.clearInterval(timer);
    }, [phoneTimer, isPhoneVerified]);

    // Handle Input Changes
    const handleEmailOtpChange = (index: number, val: string) => {
        if (!/^\d*$/.test(val)) return;
        const digit = val.slice(-1);
        const newOtp = [...emailOtp];
        newOtp[index] = digit;
        setEmailOtp(newOtp);

        if (digit && index < 5) {
            document.getElementById(`email-otp-${index + 1}`)?.focus();
        }
    };

    const handlePhoneOtpChange = (index: number, val: string) => {
        if (!/^\d*$/.test(val)) return;
        const digit = val.slice(-1);
        const newOtp = [...phoneOtp];
        newOtp[index] = digit;
        setPhoneOtp(newOtp);

        if (digit && index < 3) {
            document.getElementById(`phone-otp-${index + 1}`)?.focus();
        }
    };

    // Handle Backspace
    const handleEmailOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !emailOtp[index] && index > 0) {
            document.getElementById(`email-otp-${index - 1}`)?.focus();
        }
    };

    const handlePhoneOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !phoneOtp[index] && index > 0) {
            document.getElementById(`phone-otp-${index - 1}`)?.focus();
        }
    };

    // Verification Logic
    const verifyEmail = () => {
        if (emailOtp.join('').length === 6) {
            setIsEmailVerified(true);
        }
    };

    const verifyPhone = () => {
        if (phoneOtp.join('').length === 4) {
            setIsPhoneVerified(true);
        }
    };

    // Resend Logic
    const resendEmailOtp = () => {
        setEmailOtp(['', '', '', '', '', '']);
        setEmailTimer(60);
    };

    const resendPhoneOtp = () => {
        setPhoneOtp(['', '', '', '']);
        setPhoneTimer(60);
    };

    // Continue Navigation
    const handleContinue = () => {
        if (isEmailVerified && isPhoneVerified) {
            navigate('/kyc');
        }
    };

    return (
        <div className="verify-page-container">
            <div className="verify-card">

                <div className="progress-header">
                    <Stepper currentStep={1} />
                    <h1 className="progress-title">Verification</h1>
                </div>

                {/* Email Verification Section */}
                <div className="verify-section">
                    <div className="verify-header">
                        <div className="verify-title">
                            <Mail size={20} className={isEmailVerified ? "text-emerald-600" : "text-slate-500"} />
                            Email Verification
                        </div>
                        <div className={`status-badge ${isEmailVerified ? 'status-verified' : 'status-unverified'}`}>
                            {isEmailVerified ? (
                                <><CheckCircle2 size={14} /> Verified</>
                            ) : (
                                <><AlertCircle size={14} /> Unverified</>
                            )}
                        </div>
                    </div>

                    {!isEmailVerified ? (
                        <div className="verify-content">
                            <div className="otp-inputs">
                                {emailOtp.map((digit, i) => (
                                    <input
                                        key={`email-${i}`}
                                        id={`email-otp-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        value={digit}
                                        onChange={(e) => handleEmailOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleEmailOtpKeyDown(i, e)}
                                        className="otp-box"
                                        maxLength={1}
                                    />
                                ))}
                            </div>
                            <div className="action-row">
                                <span className="resend-text">
                                    {emailTimer > 0 ? `Resend code in ${emailTimer}s` : "Didn't receive code?"}
                                </span>
                                {emailTimer === 0 ? (
                                    <button onClick={resendEmailOtp} className="resend-btn">Resend</button>
                                ) : (
                                    <button
                                        onClick={verifyEmail}
                                        disabled={emailOtp.join('').length < 6}
                                        className="verify-action-btn"
                                    >
                                        Verify Email
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="verified-state-msg">
                            Your email address has been securely verified.
                        </div>
                    )}
                </div>

                {/* Phone Verification Section */}
                <div className="verify-section">
                    <div className="verify-header">
                        <div className="verify-title">
                            <Phone size={20} className={isPhoneVerified ? "text-emerald-600" : "text-slate-500"} />
                            Phone Verification
                        </div>
                        <div className={`status-badge ${isPhoneVerified ? 'status-verified' : 'status-unverified'}`}>
                            {isPhoneVerified ? (
                                <><CheckCircle2 size={14} /> Verified</>
                            ) : (
                                <><AlertCircle size={14} /> Unverified</>
                            )}
                        </div>
                    </div>

                    {!isPhoneVerified ? (
                        <div className="verify-content">
                            <div className="otp-inputs">
                                {phoneOtp.map((digit, i) => (
                                    <input
                                        key={`phone-${i}`}
                                        id={`phone-otp-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        value={digit}
                                        onChange={(e) => handlePhoneOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handlePhoneOtpKeyDown(i, e)}
                                        className="otp-box"
                                        maxLength={1}
                                    />
                                ))}
                            </div>
                            <div className="action-row">
                                <span className="resend-text">
                                    {phoneTimer > 0 ? `Resend OTP in ${phoneTimer}s` : "Didn't receive OTP?"}
                                </span>
                                {phoneTimer === 0 ? (
                                    <button onClick={resendPhoneOtp} className="resend-btn">Resend</button>
                                ) : (
                                    <button
                                        onClick={verifyPhone}
                                        disabled={phoneOtp.join('').length < 4}
                                        className="verify-action-btn"
                                    >
                                        Verify Phone
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="verified-state-msg">
                            Your phone number has been securely verified.
                        </div>
                    )}
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!(isEmailVerified && isPhoneVerified)}
                    className="continue-btn"
                >
                    Continue to Application
                    <ArrowRight size={18} />
                </button>

            </div>
        </div>
    );
};

export default VerificationPage;
