import { useState, useEffect } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck, Fingerprint, Sparkles } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [method, setMethod] = useState<'email' | 'phone'>('email');

    // Email form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Phone form states
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [countdown, setCountdown] = useState(0);

    // Checks for password strength
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strengthScore = [hasMinLength, hasNumber, hasSpecialChar].filter(Boolean).length;

    const getStrengthColor = () => {
        if (strengthScore === 0) return 'bg-gray-200';
        if (strengthScore === 1) return 'bg-red-400';
        if (strengthScore === 2) return 'bg-yellow-400';
        return 'bg-brand-green';
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

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length === 10) {
            setOtpSent(true);
            setCountdown(30);
        }
    };

    const handleResendOtp = () => {
        if (countdown === 0) {
            setOtp(['', '', '', '']);
            setCountdown(30);
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

    const renderPasswordRules = () => (
        <div className="mt-4 space-y-2 text-sm text-brand-textMuted">
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-brand-text">Password strength</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${strengthScore === 3 ? 'bg-brand-greenLight text-brand-greenHover' : strengthScore === 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {getStrengthText()}
                </span>
            </div>
            <div className="flex gap-1 mb-4 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${strengthScore >= 1 ? getStrengthColor() : 'bg-transparent'} ${strengthScore === 1 ? 'w-1/3' : strengthScore === 2 ? 'w-2/3' : strengthScore === 3 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className="flex items-center gap-2 transition-colors duration-300" style={{ color: hasMinLength ? '#14BA73' : 'inherit' }}>
                <CheckCircle2 size={16} className={hasMinLength ? 'text-brand-green' : 'text-gray-300'} />
                <span>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-2 transition-colors duration-300" style={{ color: hasNumber ? '#14BA73' : 'inherit' }}>
                <CheckCircle2 size={16} className={hasNumber ? 'text-brand-green' : 'text-gray-300'} />
                <span>Contains at least one number</span>
            </div>
            <div className="flex items-center gap-2 transition-colors duration-300" style={{ color: hasSpecialChar ? '#14BA73' : 'inherit' }}>
                <CheckCircle2 size={16} className={hasSpecialChar ? 'text-brand-green' : 'text-gray-300'} />
                <span>Contains at least one special character</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 sm:p-8 font-sans text-brand-text relative overflow-hidden">

            {/* Background elements derived from the brand colors */}
            <div className="absolute top-[0%] left-[0%] w-full h-[300px] bg-brand-dark flex items-center justify-center overflow-hidden">
                <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] rounded-full bg-brand-green/5 blur-[120px] pointer-events-none" />
            </div>

            <div className="w-full max-w-md relative z-10 mt-16 sm:mt-0">

                {/* Brand Header */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-brand-sidebar rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-brand-green/20">
                        <Sparkles className="text-brand-green" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white sm:text-brand-dark">
                        EZFINANZ LOS
                    </h1>
                    <p className="text-brand-greenLight/70 sm:text-brand-textMuted mt-2">The next generation loan platform.</p>
                </div>

                {/* Card Container */}
                <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-brand-dark/5 transition-all">

                    {/* Main Toggle (Login vs Signup) */}
                    <div className="flex bg-brand-bg p-1 rounded-xl mb-8 border border-gray-100">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin
                                ? 'bg-white text-brand-sidebar shadow flex items-center justify-center'
                                : 'text-brand-textMuted hover:text-brand-text'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin
                                ? 'bg-white text-brand-sidebar shadow flex items-center justify-center'
                                : 'text-brand-textMuted hover:text-brand-text'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-1 text-brand-dark">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-sm text-brand-textMuted">
                            {isLogin
                                ? 'Enter your details to access your dashboard.'
                                : 'Sign up to start your loan application process.'}
                        </p>
                    </div>

                    {/* Secondary Tab Control (Email vs Phone) */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => { setMethod('email'); setOtpSent(false); }}
                            className={`flex items-center justify-center gap-2 flex-1 pb-3 text-sm font-semibold border-b-[3px] transition-colors ${method === 'email'
                                ? 'border-brand-green text-brand-sidebar'
                                : 'border-transparent text-brand-textMuted hover:text-brand-sidebar'
                                }`}
                        >
                            <Mail size={18} />
                            Email
                        </button>
                        <button
                            onClick={() => setMethod('phone')}
                            className={`flex items-center justify-center gap-2 flex-1 pb-3 text-sm font-semibold border-b-[3px] transition-colors ${method === 'phone'
                                ? 'border-brand-green text-brand-sidebar'
                                : 'border-transparent text-brand-textMuted hover:text-brand-sidebar'
                                }`}
                        >
                            <Phone size={18} />
                            Phone Number
                        </button>
                    </div>

                    {/* Forms */}
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">

                        {method === 'email' && (
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-brand-sidebar ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-brand-green transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-brand-bg border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-sidebar placeholder-gray-400 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-brand-sidebar ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-green transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-11 py-3 bg-brand-bg border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-sidebar placeholder-gray-400 transition-all outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-sidebar transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Strength Meter (Only on Signup) */}
                                {!isLogin && renderPasswordRules()}

                                {isLogin && (
                                    <div className="flex justify-end">
                                        <button type="button" className="text-sm font-medium text-brand-greenHover hover:text-brand-sidebar transition-colors">
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full mt-8 py-3.5 bg-brand-green hover:bg-brand-greenHover text-white font-semibold rounded-xl shadow-[0_8px_20px_-8px_rgba(20,186,115,0.6)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                >
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        )}

                        {method === 'phone' && (
                            <div className="space-y-4">
                                {!otpSent ? (
                                    <form onSubmit={handleSendOtp} className="space-y-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-brand-sidebar ml-1">Phone Number</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-brand-green transition-colors" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={phone}
                                                    onChange={e => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        if (val.length <= 10) setPhone(val);
                                                    }}
                                                    placeholder="Enter 10-digit number"
                                                    className="w-full pl-11 pr-4 py-3 bg-brand-bg border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-sidebar placeholder-gray-400 transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={phone.length < 10}
                                            className="w-full py-3.5 bg-brand-green hover:bg-brand-greenHover text-white font-semibold rounded-xl shadow-[0_8px_20px_-8px_rgba(20,186,115,0.6)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-green disabled:shadow-none"
                                        >
                                            Send OTP
                                            <ArrowRight size={18} />
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="text-center space-y-2">
                                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-greenLight text-brand-green mb-2">
                                                <Fingerprint size={28} />
                                            </div>
                                            <h3 className="text-xl font-bold text-brand-dark">Verify your number</h3>
                                            <p className="text-sm text-brand-textMuted">
                                                We sent a code to <span className="text-brand-sidebar font-semibold">+91 {phone}</span>
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => { setOtpSent(false); setOtp(['', '', '', '']); }}
                                                className="text-xs text-brand-greenHover hover:text-brand-sidebar p-1 font-semibold"
                                            >
                                                Change number
                                            </button>
                                        </div>

                                        <div className="flex justify-center gap-3">
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    id={`otp-input-${i}`}
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                    className="w-14 h-14 text-center text-2xl font-bold bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-sidebar transition-all outline-none shadow-sm"
                                                    maxLength={1}
                                                />
                                            ))}
                                        </div>

                                        <div className="text-center mt-6 space-y-6">
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={countdown > 0}
                                                className="text-sm text-brand-textMuted hover:text-brand-sidebar transition-colors disabled:opacity-50 disabled:hover:text-brand-textMuted font-medium"
                                            >
                                                {countdown > 0
                                                    ? `Resend in 00:${countdown.toString().padStart(2, '0')}`
                                                    : 'Didn\'t receive code? Resend'}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={otp.join('').length < 4}
                                                className="w-full py-3.5 bg-brand-green hover:bg-brand-greenHover text-white font-semibold rounded-xl shadow-[0_8px_20px_-8px_rgba(20,186,115,0.6)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                            >
                                                <ShieldCheck size={18} />
                                                Verify & Proceed
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                <div className="mt-8 text-center text-sm font-medium text-brand-textMuted/70">
                    By continuing, you agree to our <a href="#" className="text-brand-sidebar hover:text-brand-greenHover underline underline-offset-4">Terms</a> and <a href="#" className="text-brand-sidebar hover:text-brand-greenHover underline underline-offset-4">Policy</a>.
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
