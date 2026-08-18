import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, ShieldAlert, CheckCircle2, Calculator, ArrowRight, RotateCcw } from 'lucide-react';
import './EligibilityPage.css';

type ViewState = 'checking' | 'eligible' | 'rejected';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

const EligibilityPage = () => {
    const navigate = useNavigate();

    // View State
    const [view, setView] = useState<ViewState>('checking');

    // Form States (View 1)
    const [income, setIncome] = useState<string>('');
    const [debts, setDebts] = useState<string>('');
    const [cibil, setCibil] = useState<string>('');

    // EMI Calculator States (View 2)
    const [loanAmount, setLoanAmount] = useState<number>(100000);
    const [tenure, setTenure] = useState<number>(12);
    const INTEREST_RATE = 12; // 12% Annual

    // Input handlers to ensure only clean numeric inputs
    const handleNumericChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        setter(val);
    };

    // Determine Eligibility Logic
    const handleCheckEligibility = (e: React.FormEvent) => {
        e.preventDefault();
        const monthlyIncome = Number(income);
        const monthlyDebts = Number(debts);
        const score = Number(cibil);

        if (monthlyIncome === 0) {
            setView('rejected');
            return;
        }

        const dti = monthlyDebts / monthlyIncome;

        if (score > 700 && dti < 0.5) {
            setView('eligible');
        } else {
            setView('rejected');
        }
    };

    const handleReset = () => {
        setView('checking');
        setIncome('');
        setDebts('');
        setCibil('');
    };

    const handleProceed = () => {
        // Proceed to Phase 7 (Bank Details etc)
        // Here we mock navigation to home for now, can be updated later
        navigate('/home');
    };

    // Calculate EMI Mathematics
    const emiDetails = useMemo(() => {
        const P = loanAmount;
        const R = INTEREST_RATE / 12 / 100; // Monthly Interest Rate
        const N = tenure;

        // Formula: P * R * ((1+R)^N / ((1+R)^N - 1))
        const num = Math.pow(1 + R, N);
        const den = num - 1;
        const emi = Math.round(P * R * (num / den));

        const totalRepayment = emi * N;
        const totalInterest = totalRepayment - P;

        return {
            emi,
            totalInterest,
            totalRepayment
        };
    }, [loanAmount, tenure]);

    return (
        <div className="eligibility-page-container">
            <div className="eligibility-card">

                <div className="progress-header">
                    <div className="progress-text">Step 3 of 5</div>
                    <h1 className="progress-title">Loan Eligibility</h1>
                </div>

                {view === 'checking' && (
                    <form onSubmit={handleCheckEligibility} className="input-grid">

                        <div className="form-group">
                            <label className="form-label" htmlFor="income">Monthly Income</label>
                            <div className="form-input-wrapper">
                                <span className="input-prefix">₹</span>
                                <input
                                    id="income"
                                    type="text"
                                    inputMode="numeric"
                                    className="form-input-numeric"
                                    placeholder="Enter net monthly income"
                                    value={income}
                                    onChange={handleNumericChange(setIncome)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="debts">Current Monthly EMI / Debts</label>
                            <div className="form-input-wrapper">
                                <span className="input-prefix">₹</span>
                                <input
                                    id="debts"
                                    type="text"
                                    inputMode="numeric"
                                    className="form-input-numeric"
                                    placeholder="Total active EMIs"
                                    value={debts}
                                    onChange={handleNumericChange(setDebts)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="cibil">Credit Score (CIBIL)</label>
                            <input
                                id="cibil"
                                type="text"
                                inputMode="numeric"
                                maxLength={3}
                                className="form-input-standard"
                                placeholder="e.g. 750"
                                value={cibil}
                                onChange={handleNumericChange(setCibil)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="action-btn"
                            disabled={!income || !debts || !cibil}
                        >
                            Check Eligibility
                            <ArrowRight size={18} />
                        </button>

                    </form>
                )}

                {view === 'rejected' && (
                    <div className="status-msg status-rejected animate-fade-in">
                        <ShieldAlert size={48} />
                        <div>
                            <h3>Application Not Approved</h3>
                            <p>Based on the provided details, we are currently unable to approve a loan. This may be due to a high debt-to-income ratio or a credit score below our minimum requirements.</p>
                        </div>
                        <button onClick={handleReset} className="reset-btn">
                            <RotateCcw size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                            Re-evaluate Details
                        </button>
                    </div>
                )}

                {view === 'eligible' && (
                    <div className="animate-fade-in">
                        <div className="status-msg status-success">
                            <CheckCircle2 size={40} />
                            <h3>Congratulations! You are officially eligible for an EZFINANZ loan.</h3>
                        </div>

                        <div className="calculator-section">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#1e293b', fontWeight: 'bold' }}>
                                <Calculator size={20} />
                                <h2>Customize Your Loan</h2>
                            </div>

                            {/* Loan Amount Slider */}
                            <div className="range-slider-group">
                                <div className="range-header">
                                    <span className="range-label">Loan Amount</span>
                                    <span className="range-value">{formatCurrency(loanAmount)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="50000"
                                    max="500000"
                                    step="10000"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    className="range-input"
                                />
                                <div className="range-min-max">
                                    <span>₹50K</span>
                                    <span>₹5L</span>
                                </div>
                            </div>

                            {/* Tenure Slider */}
                            <div className="range-slider-group">
                                <div className="range-header">
                                    <span className="range-label">Repayment Tenure</span>
                                    <span className="range-value">{tenure} Months</span>
                                </div>
                                <input
                                    type="range"
                                    min="6"
                                    max="36"
                                    step="1"
                                    value={tenure}
                                    onChange={(e) => setTenure(Number(e.target.value))}
                                    className="range-input"
                                />
                                <div className="range-min-max">
                                    <span>6 Months</span>
                                    <span>36 Months</span>
                                </div>
                            </div>

                            {/* Real-time Result */}
                            <div className="emi-result-container">
                                <div className="emi-primary-result">
                                    <div className="emi-primary-label">Your Monthly EMI</div>
                                    <div className="emi-primary-value">{formatCurrency(emiDetails.emi)}</div>
                                </div>
                                <div className="emi-secondary-grid">
                                    <div className="emi-stat-box">
                                        <div className="emi-stat-label">Total Interest (12% p.a)</div>
                                        <div className="emi-stat-value">{formatCurrency(emiDetails.totalInterest)}</div>
                                    </div>
                                    <div className="emi-stat-box">
                                        <div className="emi-stat-label">Total Repayment</div>
                                        <div className="emi-stat-value">{formatCurrency(emiDetails.totalRepayment)}</div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleProceed} className="action-btn">
                                Proceed to Bank Details
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EligibilityPage;
