import React, { useState, useEffect } from 'react';
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
        if (strengthScore === 0) return 'bg-gray-700';
        if (strengthScore === 1) return 'bg-red-500';
        if (strengthScore === 2) return 'bg-yellow-500';
        return 'bg-emerald-500';
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
        <div className="mt-4 space-y-2 text-sm text-gray-400">
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Password strength</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${strengthScore === 3 ? 'bg-emerald-500/20 text-emerald-400' : strengthScore === 2 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    {getStrengthText()}
                </span>
            </div>
            <div className="flex gap-1 mb-4 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${strengthScore >= 1 ? getStrengthColor() : 'bg-transparent'} ${strengthScore === 1 ? 'w-1/3' : strengthScore === 2 ? 'w-2/3' : strengthScore === 3 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className="flex items-center gap-2 transition-colors duration-300" style={{ color: hasMinLength ? '#34d399' : 'inherit' }}>
                <CheckCircle2 size={16} className={hasMinLength ? 'text-emerald-400' : 'text-gray-600'} />
                <span>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-2 transition-colors duration-300" style={{ color: hasNumber ? '#34d399' : 'inherit' }}>
                <CheckCircle2 size={16} className={hasNumber ? 'text-emerald-400' : 'text-gray-600'} />
                <span>Contains at least one number</span>
            </div>
            <div className="flex items-center gap-2 transition-colors duration-300" style={{ color: hasSpecialChar ? '#34d399' : 'inherit' }}>
                <CheckCircle2 size={16} className={hasSpecialChar ? 'text-emerald-400' : 'text-gray-600'} />
                <span>Contains at least one special character</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-8 font-sans text-gray-100 relative overflow-hidden">

            {/* Background ambient glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-600/20 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">

                {/* Brand Header */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
                        <Sparkles className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        EZFINANZ LOS
                    </h1>
                    <p className="text-gray-400 mt-2">The next generation loan platform.</p>
                </div>

                {/* Card Container */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl transition-all">

                    {/* Main Toggle (Login vs Signup) */}
                    <div className="flex bg-gray-900/50 p-1 rounded-2xl mb-8 border border-white/5">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${isLogin
                                    ? 'bg-white/10 text-white shadow-sm border border-white/10'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${!isLogin
                                    ? 'bg-white/10 text-white shadow-sm border border-white/10'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-1">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-sm text-gray-400">
                            {isLogin
                                ? 'Enter your details to access your dashboard.'
                                : 'Sign up to start your loan application process.'}
                        </p>
                    </div>

                    {/* Secondary Tab Control (Email vs Phone) */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => { setMethod('email'); setOtpSent(false); }}
                            className={`flex items-center justify-center gap-2 flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${method === 'email'
                                    ? 'border-indigo-400 text-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <Mail size={16} />
                            Email
                        </button>
                        <button
                            onClick={() => setMethod('phone')}
                            className={`flex items-center justify-center gap-2 flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${method === 'phone'
                                    ? 'border-indigo-400 text-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <Phone size={16} />
                            Phone Number
                        </button>
                    </div>

                    {/* Forms */}
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">

                        {method === 'email' && (
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-gray-600 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-11 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-gray-600 transition-all outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Strength Meter (Only on Signup) */}
                                {!isLogin && renderPasswordRules()}

                                {isLogin && (
                                    <div className="flex justify-end">
                                        <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
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
                                            <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Phone className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
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
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-gray-600 transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={phone.length < 10}
                                            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-500 disabled:shadow-none"
                                        >
                                            Send OTP
                                            <ArrowRight size={18} />
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="text-center space-y-2">
                                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-2">
                                                <Fingerprint size={24} />
                                            </div>
                                            <h3 className="text-lg font-medium">Verify your number</h3>
                                            <p className="text-sm text-gray-400">
                                                We sent a code to <span className="text-white">+91 {phone}</span>
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => { setOtpSent(false); setOtp(['', '', '', '']); }}
                                                className="text-xs text-indigo-400 hover:text-indigo-300 p-1"
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
                                                    className="w-14 h-14 text-center text-xl font-bold bg-gray-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white transition-all outline-none"
                                                    maxLength={1}
                                                />
                                            ))}
                                        </div>

                                        <div className="text-center mt-4 space-y-6">
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={countdown > 0}
                                                className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:hover:text-gray-400"
                                            >
                                                {countdown > 0
                                                    ? `Resend in 00:${countdown.toString().padStart(2, '0')}`
                                                    : 'Didn\'t receive code? Resend'}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={otp.join('').length < 4}
                                                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
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

                <div className="mt-8 text-center text-xs text-gray-500">
                    By continuing, you agree to our <a href="#" className="text-gray-400 hover:text-white underline underline-offset-2">Terms of Service</a> and <a href="#" className="text-gray-400 hover:text-white underline underline-offset-2">Privacy Policy</a>.
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
