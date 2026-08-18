import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck, Fingerprint, Sparkles } from 'lucide-react';
import './AuthPage.css'; // Importing normal CSS

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [method, setMethod] = useState<'email' | 'phone'>('email');

    // Email form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Phone form states
    const [phone, setPhone] = useState('');

    // Shared OTP states
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [countdown, setCountdown] = useState(0);

    // Checks for password strength
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strengthScore = [hasMinLength, hasNumber, hasSpecialChar].filter(Boolean).length;

    const getStrengthColor = () => {
        if (strengthScore === 0) return '#e2e8f0';
        if (strengthScore === 1) return '#f87171';
        if (strengthScore === 2) return '#facc15';
        return '#10b981';
    };

    const getStrengthBadgeClass = () => {
        if (strengthScore === 0) return '';
        if (strengthScore === 1) return 'strength-weak';
        if (strengthScore === 2) return 'strength-fair';
        return 'strength-strong';
    };

    const getStrengthText = () => {
        if (strengthScore === 0) return '';
        if (strengthScore === 1) return 'Weak';
        if (strengthScore === 2) return 'Fair';
        return 'Strong';
    };

    // Timer logic for OTP
    useEffect(() => {
        let timer: number;
        if (countdown > 0) {
            timer = window.setInterval(() => {
                setCountdown((c) => c - 1);
            }, 1000);
        }
        return () => window.clearInterval(timer);
    }, [countdown]);

    // Send OTP logic (Mocking real backend API)
    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();

        let valid = false;
        let target = '';

        if (method === 'phone' && phone.length === 10) {
            valid = true;
            target = '+91 ' + phone;
        } else if (method === 'email' && email.length > 0) {
            // For sign-ups, we want to ensure password is also strong, but for demo we just check length
            if (!isLogin && strengthScore < 3) {
                alert("Please meet all password requirements before proceeding.");
                return;
            }
            valid = true;
            target = email;
        }

        if (valid) {
            setOtpSent(true);
            setCountdown(30);
            alert(`Mock Backend Notice: Sending verification OTP to ${target}.\n\nIn a real app, this would use a service like Twilio or regular email backend!`);
        }
    };

    const handleResendOtp = () => {
        if (countdown === 0) {
            setOtp(['', '', '', '']);
            setCountdown(30);
            const target = method === 'phone' ? `+91 ${phone}` : email;
            alert(`Mock Backend Notice: RE-Sending verification OTP to ${target}`);
        }
    };

    const handleOtpChange = (index: number, val: string) => {
        if (!/^\d*$/.test(val)) return;
        const digit = val.slice(-1);

        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        // Auto Advance
        if (digit && index < 3) {
            const nextEl = document.getElementById(`otp-input-${index + 1}`);
            nextEl?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevEl = document.getElementById(`otp-input-${index - 1}`);
            prevEl?.focus();
        }
    };

    const handleVerifyOtp = () => {
        // Here we mock verifying the OTP with the backend API
        if (otp.join('').length === 4) {
            alert("Verification successful!");
            navigate('/verify');
        }
    };

    const switchMethod = (newMethod: 'email' | 'phone') => {
        setMethod(newMethod);
        setOtpSent(false);
        setOtp(['', '', '', '']);
    };

    const renderPasswordRules = () => (
        <div className="password-rules">
            <div className="rules-header">
                <span>Password strength</span>
                <span className={`strength-badge ${getStrengthBadgeClass()}`}>
                    {getStrengthText()}
                </span>
            </div>
            <div className="strength-bar-container">
                <div
                    className="strength-bar"
                    style={{
                        backgroundColor: getStrengthColor(),
                        width: strengthScore === 1 ? '33.33%' : strengthScore === 2 ? '66.66%' : strengthScore === 3 ? '100%' : '0'
                    }}
                />
            </div>
            <div className="rule-item" style={{ color: hasMinLength ? '#059669' : 'inherit' }}>
                <CheckCircle2 size={16} color={hasMinLength ? '#059669' : '#cbd5e1'} />
                <span>At least 8 characters</span>
            </div>
            <div className="rule-item" style={{ color: hasNumber ? '#059669' : 'inherit' }}>
                <CheckCircle2 size={16} color={hasNumber ? '#059669' : '#cbd5e1'} />
                <span>Contains at least one number</span>
            </div>
            <div className="rule-item" style={{ color: hasSpecialChar ? '#059669' : 'inherit' }}>
                <CheckCircle2 size={16} color={hasSpecialChar ? '#059669' : '#cbd5e1'} />
                <span>Contains at least one special character</span>
            </div>
        </div>
    );

    return (
        <div className="auth-page-container">
            {/* Background ambient glows */}
            <div className="auth-ambient-glow-1" />
            <div className="auth-ambient-glow-2" />

            <div className="auth-content-wrapper">

                {/* Brand Header */}
                <div className="auth-brand-header">
                    <div className="auth-logo-box">
                        <Sparkles size={28} />
                    </div>
                    <h1 className="auth-title">
                        EZFINANZ LOS
                    </h1>
                    <p className="auth-subtitle">The next generation loan platform.</p>
                </div>

                {/* Card Container */}
                <div className="auth-card">

                    {/* Main Toggle (Login vs Signup) */}
                    <div className="auth-main-toggle">
                        <button
                            onClick={() => { setIsLogin(true); setOtpSent(false); }}
                            className={`auth-toggle-btn ${isLogin ? 'active' : 'inactive'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setOtpSent(false); }}
                            className={`auth-toggle-btn ${!isLogin ? 'active' : 'inactive'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {!otpSent && (
                        <div className="auth-header-text animate-fade-in">
                            <h2>
                                {isLogin ? 'Welcome back' : 'Create an account'}
                            </h2>
                            <p>
                                {isLogin
                                    ? 'Enter your details to access your dashboard.'
                                    : 'Sign up to start your loan application process.'}
                            </p>
                        </div>
                    )}

                    {/* Secondary Tab Control (Email vs Phone) */}
                    {!otpSent && (
                        <div className="auth-method-tabs animate-fade-in">
                            <button
                                onClick={() => switchMethod('email')}
                                className={`auth-tab-btn ${method === 'email' ? 'active' : ''}`}
                            >
                                <Mail size={16} />
                                Email
                            </button>
                            <button
                                onClick={() => switchMethod('phone')}
                                className={`auth-tab-btn ${method === 'phone' ? 'active' : ''}`}
                            >
                                <Phone size={16} />
                                Phone Number
                            </button>
                        </div>
                    )}

                    {/* Forms */}
                    <div className="animate-fade-in">

                        {!otpSent ? (
                            <form onSubmit={handleSendOtp}>
                                {method === 'email' && (
                                    <>
                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <div className="input-wrapper">
                                                <Mail className="input-icon" size={20} />
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="you@example.com"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    className="auth-input"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Password</label>
                                            <div className="input-wrapper">
                                                <Lock className="input-icon" size={20} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="auth-input"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="password-toggle"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        {!isLogin && renderPasswordRules()}

                                        {isLogin && (
                                            <div className="forgot-password">
                                                <button type="button">Forgot password?</button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {method === 'phone' && (
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <div className="input-wrapper">
                                            <Phone className="input-icon" size={20} />
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    if (val.length <= 10) setPhone(val);
                                                }}
                                                placeholder="Enter 10-digit number"
                                                className="auth-input"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="auth-submit-btn"
                                    disabled={method === 'phone' && phone.length < 10}
                                >
                                    {isLogin ? (method === 'email' ? 'Sign In w/ OTP' : 'Send OTP') : 'Send Verification OTP'}
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        ) : (
                            <div className="otp-verification animate-fade-in">
                                <div className="otp-icon-container">
                                    <Fingerprint size={24} />
                                </div>
                                <h3>Verify your {method}</h3>
                                <p>
                                    We sent a code to <strong>{method === 'phone' ? `+91 ${phone}` : email}</strong>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setOtpSent(false)}
                                    className="change-number-btn"
                                >
                                    Change {method}
                                </button>

                                <div className="otp-inputs">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-input-${i}`}
                                            type="text"
                                            inputMode="numeric"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            className="otp-input"
                                            maxLength={1}
                                        />
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={countdown > 0}
                                    className="resend-btn"
                                >
                                    {countdown > 0
                                        ? `Resend in 00:${countdown.toString().padStart(2, '0')}`
                                        : 'Didn\'t receive code? Resend'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={otp.join('').length < 4}
                                    className="auth-submit-btn"
                                >
                                    <ShieldCheck size={18} />
                                    Verify & Proceed
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="auth-footer">
                    By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
