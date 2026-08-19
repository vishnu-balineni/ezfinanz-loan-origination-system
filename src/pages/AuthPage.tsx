import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck, Fingerprint, Sparkles } from 'lucide-react';
import { triggerCustomAlert } from '../components/shared/CustomAlertModal';
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

    // Shared OTP states for Phone login 
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [countdown, setCountdown] = useState(0);

    // Added fullName for Registration
    const [fullName, setFullName] = useState('');

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

    // API Call to Spring Boot
    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (method === 'phone') {
            if (phone.length === 10) {
                setOtpSent(true);
                setCountdown(30);
                triggerCustomAlert('success', `Mock Notice: Phone OTP sent to +91 ${phone}`, 'OTP Sent');
            }
            return;
        }

        // --- EMAIL LOGIN / SIGNUP ---
        if (method === 'email' && email.length > 0) {

            if (!isLogin && strengthScore < 3) {
                triggerCustomAlert('error', "Please meet all password requirements before proceeding.", 'Weak Password');
                return;
            }

            try {
                const baseURL = 'https://exfinanz-backend.onrender.com';
                const endpoint = isLogin ? `${baseURL}/api/auth/login` : `${baseURL}/api/auth/register`;

                const body = isLogin
                    ? { email, password }
                    : { fullName, email, password, phone: phone };

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Authentication failed');
                }

                triggerCustomAlert('success', data.message || 'Success!', isLogin ? 'Login Successful' : 'Registration Complete');

                // Demo Logic: if email contains admin, elevate them to Admin Role locally
                const finalRole = email.toLowerCase().includes('admin') ? 'ROLE_ADMIN' : data.role;

                // Save user info to simulate session
                localStorage.setItem('user', JSON.stringify({
                    id: data.userId,
                    email: data.email,
                    role: finalRole,
                    fullName: data.fullName || 'User',
                    isKycVerified: data.isKycVerified || false,
                    phone: data.phone || ''
                }));

                if (finalRole === 'ROLE_ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/dashboard');
                }

            } catch (err: any) {
                triggerCustomAlert('error', err.response?.data?.error || err.message, 'Registration Failed');
            }
        }
    };


    const handleResendOtp = () => {
        if (countdown === 0) {
            setOtp(['', '', '', '']);
            setCountdown(30);
            const target = method === 'phone' ? `+91 ${phone}` : email;
            triggerCustomAlert('success', `Mock Backend Notice: RE-Sending verification OTP to ${target}`, 'OTP Resent');
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
            triggerCustomAlert('success', "Verification successful!", 'OTP Verified');
            navigate('/dashboard');
        }
    };

    const handleGoogleOauth = async () => {
        try {
            triggerCustomAlert('success', 'Redirecting to Google Secure OAuth...', 'OAuth Initiated');
            await new Promise(resolve => setTimeout(resolve, 1500));

            const googleUser = {
                id: Math.floor(Math.random() * 10000),
                email: 'portfolio_reviewer@gmail.com',
                role: 'ROLE_CUSTOMER',
                fullName: 'Google Authenticated User',
                isKycVerified: false,
                phone: ''
            };

            localStorage.setItem('user', JSON.stringify(googleUser));
            localStorage.setItem('token', 'mock_google_oauth_jwt_token_123'); // Fake token for Auth state

            triggerCustomAlert('success', 'Successfully authenticated via Google!', 'Google Auth Success');
            navigate('/dashboard');

        } catch (err) {
            triggerCustomAlert('error', 'Google OAuth failed. Please try again.', 'Auth Error');
        }
    };

    const handleAdminLoginInfo = () => {
        triggerCustomAlert('success', "Admin Simulator mode activated.", 'Switched to Admin');
        navigate('/admin/dashboard');
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

                    {!otpSent && (
                        <div className="auth-social-mock" style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={handleGoogleOauth}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'white', border: '1px solid #cbd5e1', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, color: '#334155', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
                                <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
                                <span style={{ padding: '0 0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
                            </div>
                        </div>
                    )}

                    {/* Forms */}
                    <div className="animate-fade-in">

                        {!otpSent ? (
                            <form onSubmit={handleAuthSubmit}>
                                {method === 'email' && (
                                    <>
                                        {!isLogin && (
                                            <>
                                                <div className="form-group">
                                                    <label>Full Name</label>
                                                    <div className="input-wrapper">
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="John Doe"
                                                            value={fullName}
                                                            onChange={e => setFullName(e.target.value)}
                                                            className="auth-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Phone Number</label>
                                                    <div className="input-wrapper">
                                                        <Phone className="input-icon" size={20} />
                                                        <input
                                                            type="tel"
                                                            required
                                                            placeholder="Enter 10-digit number"
                                                            value={phone}
                                                            onChange={e => {
                                                                const val = e.target.value.replace(/\D/g, '');
                                                                if (val.length <= 10) setPhone(val);
                                                            }}
                                                            className="auth-input"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
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
                                    {isLogin ? (method === 'email' ? 'Sign In' : 'Send OTP') : (method === 'email' ? 'Create Account' : 'Send Verification OTP')}
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

                <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                    <div>
                        By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                    </div>
                    <button
                        onClick={handleAdminLoginInfo}
                        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                        Simulate Admin Login
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
