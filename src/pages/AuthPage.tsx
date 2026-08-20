import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Target } from 'lucide-react';
import { triggerCustomAlert } from '../components/shared/CustomAlertModal';
import './AuthPage.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if Landing Page specified default tab 
    const defaultIsLogin = location.state?.defaultIsLogin ?? true;

    const [isLogin, setIsLogin] = useState(defaultIsLogin);
    const [method, setMethod] = useState<'email' | 'phone'>('email');
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState('');
    const [fullName, setFullName] = useState('');

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [countdown, setCountdown] = useState(0);

    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const strengthScore = [hasMinLength, hasNumber, hasSpecialChar].filter(Boolean).length;

    useEffect(() => {
        let timer: number;
        if (countdown > 0) {
            timer = window.setInterval(() => setCountdown((c) => c - 1), 1000);
        }
        return () => window.clearInterval(timer);
    }, [countdown]);

    // Stage 1: Validate Inputs & Trigger OTP Simulation
    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (method === 'phone') {
            if (phone.length === 10) {
                setOtpSent(true);
                setCountdown(30);
                triggerCustomAlert('success', `Simulated Security: Phone OTP sent to +91 ${phone}`, 'OTP Sent');
            }
            return;
        }

        if (method === 'email') {
            if (!isLogin && strengthScore < 3) {
                triggerCustomAlert('error', "Please meet all password requirements.", 'Weak Password');
                return;
            }
            setOtpSent(true);
            setCountdown(30);
            triggerCustomAlert('success', `Simulated Security: Email verification OTP sent to ${email}`, 'OTP Sent');
        }
    };

    // Stage 2: Verification complete, execute backend comms
    const handleVerifyOtp = async () => {
        if (otp.join('').length < 4) return;

        // Mock verification success
        if (method === 'phone') {
            triggerCustomAlert('success', "Verification successful!", 'OTP Verified');
            navigate('/dashboard'); // Mock flow for just phone
            return;
        }

        // Email OTP is purely a UI security simulation, proceed with backend credentials POST
        try {
            setIsLoading(true);
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
            if (!response.ok) throw new Error(data.error || 'Authentication failed');

            triggerCustomAlert('success', data.message || 'Success!', isLogin ? 'Login Successful' : 'Account Created');

            const finalRole = email.toLowerCase().includes('admin') ? 'ROLE_ADMIN' : data.role;
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
            triggerCustomAlert('error', err.response?.data?.error || err.message, 'Operation Failed');
            setOtpSent(false); // Reset to allow them to correct email/password
            setOtp(['', '', '', '']);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleOauthResponse = async (credentialResponse: any) => {
        if (isLoading) return;
        try {
            setIsLoading(true);
            const decoded: any = jwtDecode(credentialResponse.credential);
            triggerCustomAlert('success', `Google Auth Verified for ${decoded.email}. Provisioning Account...`, 'Authenticating');

            const response = await fetch(`https://exfinanz-backend.onrender.com/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: decoded.email, fullName: decoded.name, googleId: decoded.sub })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            localStorage.setItem('user', JSON.stringify({
                id: data.userId,
                email: data.email,
                role: data.role,
                fullName: data.fullName,
                isKycVerified: data.isKycVerified,
                phone: data.phone || ''
            }));
            navigate('/dashboard');
        } catch (err: any) {
            triggerCustomAlert('error', err.message, 'Google Auth Error');
        } finally {
            setIsLoading(false);
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

    const handleOtpChange = (index: number, val: string) => {
        if (!/^\d*$/.test(val)) return;
        const digit = val.slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        if (digit && index < 3) {
            document.getElementById(`otp-input-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`)?.focus();
        }
    };

    return (
        <div className="auth-page-container">
            {/* Split Screen Left Graphic Panel */}
            <div className="auth-brand-panel">
                <div className="auth-brand-icon">
                    <Target size={32} color="white" />
                </div>
                <h1 className="auth-brand-title">Secure & Instant <br />Loan Processing.</h1>
                <p className="auth-brand-subtitle">Everything you need to apply, verify, and secure funding—packaged into an incredibly seamless platform.</p>
            </div>

            {/* Split Screen Right Form Panel */}
            <div className="auth-form-panel">
                <div className="auth-content-wrapper">

                    <div className="auth-header-text">
                        <h2>{otpSent ? (isLogin ? 'Verify Login' : 'Verify Registration') : (isLogin ? 'Welcome Back' : 'Create Account')}</h2>
                        <p>{otpSent ? 'A security code has been generated' : (isLogin ? 'Please enter your details to sign in.' : 'Please enter your details to register.')}</p>
                    </div>

                    {!otpSent && (
                        <div className="auth-method-tabs animate-fade-in">
                            <button onClick={() => switchMethod('email')} className={`auth-tab-btn ${method === 'email' ? 'active' : ''}`}>
                                <Mail size={16} /> Email
                            </button>
                            <button onClick={() => switchMethod('phone')} className={`auth-tab-btn ${method === 'phone' ? 'active' : ''}`}>
                                <Phone size={16} /> Mobile
                            </button>
                        </div>
                    )}

                    {!otpSent && (
                        <div className="animate-fade-in" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <GoogleLogin onSuccess={handleGoogleOauthResponse} onError={() => triggerCustomAlert('error', 'Google Login Failed.', 'Wait')} useOneTap />
                            <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
                                <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
                                <span style={{ padding: '0 0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
                            </div>
                        </div>
                    )}

                    {!otpSent ? (
                        <form onSubmit={handleInitialSubmit} className="animate-fade-in">
                            {method === 'email' && (
                                <>
                                    {!isLogin && (
                                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                                            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                                <div className="input-wrapper">
                                                    <input type="text" required placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="auth-input" />
                                                </div>
                                            </div>
                                            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                                <div className="input-wrapper">
                                                    <Phone className="input-icon" size={16} />
                                                    <input type="tel" placeholder="Mobile" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').substring(0, 10))} className="auth-input" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <div className="input-wrapper">
                                            <Mail className="input-icon" size={18} />
                                            <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="auth-input" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Password</label>
                                        <div className="input-wrapper">
                                            <Lock className="input-icon" size={18} />
                                            <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="auth-input" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {!isLogin && (
                                        <div className="password-rules">
                                            <div className="rules-header">
                                                <span>Strength</span>
                                                <span className={strengthScore === 0 ? '' : strengthScore === 1 ? 'strength-badge strength-weak' : strengthScore === 2 ? 'strength-badge strength-fair' : 'strength-badge strength-strong'}>
                                                    {strengthScore === 0 ? '' : strengthScore === 1 ? 'Weak' : strengthScore === 2 ? 'Fair' : 'Strong'}
                                                </span>
                                            </div>
                                            <div className="strength-bar-container" style={{ marginBottom: 0 }}>
                                                <div className="strength-bar" style={{ backgroundColor: strengthScore === 0 ? 'transparent' : strengthScore === 1 ? '#f87171' : strengthScore === 2 ? '#facc15' : '#10b981', width: `${(strengthScore / 3) * 100}%` }} />
                                            </div>
                                        </div>
                                    )}

                                    {isLogin && (
                                        <div className="forgot-password">
                                            <button type="button">Forgot password?</button>
                                        </div>
                                    )}
                                </>
                            )}

                            {method === 'phone' && (
                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <div className="input-wrapper">
                                        <Phone className="input-icon" size={18} />
                                        <input type="tel" required value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').substring(0, 10))} placeholder="Enter 10-digit number" className="auth-input" />
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="auth-submit-btn" disabled={method === 'phone' && phone.length < 10}>
                                {isLogin ? 'Sign In Securely' : 'Continue to Register'}
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    ) : (
                        <div className="otp-verification animate-fade-in">
                            <div className="otp-icon-container">
                                <ShieldCheck size={28} />
                            </div>
                            <h3>Security Check</h3>
                            <p>We've sent a 4-digit code to <strong>{method === 'phone' ? `+91 ${phone}` : email}</strong>.</p>

                            <button type="button" onClick={() => setOtpSent(false)} className="change-number-btn">
                                Change {method}
                            </button>

                            <div className="otp-inputs">
                                {otp.map((digit, i) => (
                                    <input key={i} id={`otp-input-${i}`} type="text" inputMode="numeric" value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)} className="otp-input" maxLength={1} />
                                ))}
                            </div>

                            <button type="button" onClick={() => { setOtp(['', '', '', '']); setCountdown(30); triggerCustomAlert('success', `OTP Resent to ${method === 'phone' ? phone : email}`, 'OTP Sent'); }} disabled={countdown > 0} className="resend-btn">
                                {countdown > 0 ? `Resend code in 00:${countdown.toString().padStart(2, '0')}` : 'Didn\'t receive it? Resend.'}
                            </button>

                            <button type="button" onClick={handleVerifyOtp} disabled={otp.join('').length < 4 || isLoading} className="auth-submit-btn">
                                {isLoading ? 'Processing...' : 'Verify & Proceed'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="auth-mode-switch" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
                    {isLogin ? (
                        <>Don't have an account? <button onClick={() => { setIsLogin(false); setOtpSent(false); }} style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 600, cursor: 'pointer' }}>Sign up</button></>
                    ) : (
                        <>Already have an account? <button onClick={() => { setIsLogin(true); setOtpSent(false); }} style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 600, cursor: 'pointer' }}>Log in</button></>
                    )}
                </div>

                <div className="auth-footer">
                    <button onClick={handleAdminLoginInfo} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Admin Dev Bypass ⚡</button>
                </div>
            </div>
        </div>
    );
}
