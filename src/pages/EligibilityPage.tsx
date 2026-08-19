import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, Calculator, ArrowRight, RotateCcw } from 'lucide-react';
import './EligibilityPage.css';

type ViewState = 'checking' | 'eligible' | 'rejected';

interface EligibilityProps {
    onComplete?: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

const EligibilityPage = ({ onComplete }: EligibilityProps) => {
    const navigate = useNavigate();

    // View State
    const [view, setView] = useState<ViewState>('checking');

    // Form States (View 1)
    const [income, setIncome] = useState<string>('');
    const [debts, setDebts] = useState<string>('');
    const [cibil, setCibil] = useState<string>('');
    const [employerName, setEmployerName] = useState<string>('');
    const [employerDesignation, setEmployerDesignation] = useState<string>('');

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
        if (onComplete) {
            onComplete();
        } else {
            navigate('/bank');
        }
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

        // Breakdown logic as per Phase 5 spec
        const processingFeePercentage = 2; // 2% PF
        const processingFee = Math.round((P * processingFeePercentage) / 100);
        const gst = Math.round((processingFee * 18) / 100); // 18% GST on PF

        const netDisbursement = P - processingFee - gst;

        // Approximate IRR factoring in upfront deductions
        const irrCalculation = (((emi * N) / netDisbursement - 1) / (N / 12)) * 100 * 1.1; // Simulated formula

        return {
            emi,
            totalInterest,
            totalRepayment,
            processingFee,
            gst,
            netDisbursement,
            irr: irrCalculation.toFixed(2)
        };
    }, [loanAmount, tenure]);

    // Smart Offers Handlers
    const selectOffer = (amount: number, months: number) => {
        setLoanAmount(amount);
        setTenure(months);
    };

    // Derived quick EMI calculations for static smart cards
    const calcEmiFor = (amount: number, months: number) => {
        const r = 12 / 12 / 100;
        const emi = (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
        return formatCurrency(Math.round(emi));
    };

    return (
        <div className="eligibility-page-container">
            <div className="eligibility-card">

                <div className="progress-header">
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

                        <div className="form-group" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="form-label" htmlFor="employerName">Employer Name</label>
                                <input
                                    id="employerName"
                                    type="text"
                                    className="form-input-standard"
                                    placeholder="Company Name"
                                    value={employerName}
                                    onChange={(e) => setEmployerName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label" htmlFor="employerDesignation">Designation</label>
                                <input
                                    id="employerDesignation"
                                    type="text"
                                    className="form-input-standard"
                                    placeholder="Your Role"
                                    value={employerDesignation}
                                    onChange={(e) => setEmployerDesignation(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="action-btn"
                            disabled={!income || !debts || !cibil || !employerName || !employerDesignation}
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
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Congratulations! You are officially eligible for an EZFINANZ loan.</h3>
                                <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9 }}>You have been pre-approved based on your initial profile. Customize your loan details below.</p>
                            </div>
                        </div>

                        {/* SMART OFFERS TIER (Phase 10.8) */}
                        <div className="smart-offers-container animate-fade-in">
                            <div className="smart-offers-title">
                                <CheckCircle2 size={18} color="#16a34a" /> Recommended For You
                            </div>
                            <div className="smart-offers-grid">

                                <div className="offer-card" onClick={() => selectOffer(50000, 6)}>
                                    <div className="offer-name">Quick Payoff</div>
                                    <div className="offer-emi">{calcEmiFor(50000, 6)}<span>/mo</span></div>
                                    <div className="offer-details">₹50,000 for 6 Months</div>
                                </div>

                                <div className="offer-card popular" onClick={() => selectOffer(200000, 12)}>
                                    <div className="offer-badge">Most Popular</div>
                                    <div className="offer-name">Balanced</div>
                                    <div className="offer-emi">{calcEmiFor(200000, 12)}<span>/mo</span></div>
                                    <div className="offer-details">₹2,00,000 for 12 Months</div>
                                </div>

                                <div className="offer-card" onClick={() => selectOffer(500000, 36)}>
                                    <div className="offer-name">Low Burden</div>
                                    <div className="offer-emi">{calcEmiFor(500000, 36)}<span>/mo</span></div>
                                    <div className="offer-details">₹5,00,000 for 36 Months</div>
                                </div>

                            </div>
                        </div>

                        <div className="calculator-card animate-slide-up">
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

                            <div className="emi-result-container">
                                <div className="emi-primary-result">
                                    <div className="emi-primary-label">Your Monthly EMI</div>
                                    <div className="emi-primary-value">{formatCurrency(emiDetails.emi)}</div>
                                </div>
                                <div className="emi-secondary-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                                    <div className="emi-stat-box">
                                        <div className="emi-stat-label">Total Interest (12% p.a)</div>
                                        <div className="emi-stat-value" style={{ color: '#dc2626' }}>{formatCurrency(emiDetails.totalInterest)}</div>
                                    </div>
                                    <div className="emi-stat-box">
                                        <div className="emi-stat-label">Total Repayment Amount</div>
                                        <div className="emi-stat-value">{formatCurrency(emiDetails.totalRepayment)}</div>
                                    </div>
                                    <div className="emi-stat-box">
                                        <div className="emi-stat-label">Processing Fee (incl. 18% GST)</div>
                                        <div className="emi-stat-value" style={{ color: '#dc2626' }}>
                                            {formatCurrency(emiDetails.processingFee + emiDetails.gst)}
                                        </div>
                                    </div>
                                    <div className="emi-stat-box" style={{ background: '#dcfce7', borderColor: '#bbf7d0', gridColumn: 'span 2' }}>
                                        <div className="emi-stat-label" style={{ color: '#166534' }}>Net Disbursement Amount</div>
                                        <div className="emi-stat-value" style={{ color: '#166534' }}>{formatCurrency(emiDetails.netDisbursement)}</div>
                                    </div>
                                    <div className="emi-stat-box" style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}>
                                        <div className="emi-stat-label" style={{ color: '#5b21b6' }}>Applicable IRR</div>
                                        <div className="emi-stat-value" style={{ color: '#5b21b6' }}>{emiDetails.irr}%</div>
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
