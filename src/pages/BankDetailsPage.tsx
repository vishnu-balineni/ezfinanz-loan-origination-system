import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, Loader2, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import './BankDetailsPage.css';

const BankDetailsPage = () => {
    const navigate = useNavigate();

    // Form States
    const [accName, setAccName] = useState('');
    const [accNumber, setAccNumber] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [bankName, setBankName] = useState('');

    // Flow States
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);

    // Validation Flags
    const isFormFilled = accName.trim() !== '' && accNumber.trim() !== '' && ifsc.trim().length === 11 && bankName.trim() !== '';

    // IFSC auto-capitalize handler
    const handleIfscChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
        setIfsc(val);
    };

    // Penny Drop Simulation
    const handleVerifyBank = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormFilled) return;

        setIsVerifying(true);

        // Simulate 2 second API call
        setTimeout(() => {
            setIsVerifying(false);
            setIsVerified(true);
        }, 2000);
    };

    const handleFinalProceed = () => {
        if (isVerified && isAccepted) {
            // Move to final success / home / dashboard
            navigate('/selfie');
        }
    };

    return (
        <div className="bank-page-container">
            <div className="bank-card">

                <div className="progress-header">
                    <div className="progress-text">Step 4 of 5</div>
                    <h1 className="progress-title">Disbursement Account</h1>
                </div>

                <form className="bank-form">

                    <div className="form-grid">

                        <div className="form-group full-width">
                            <label className="form-label" htmlFor="accName">Account Holder Name</label>
                            <input
                                id="accName"
                                type="text"
                                className="form-input"
                                placeholder="Exact name as registered with bank"
                                value={accName}
                                onChange={(e) => setAccName(e.target.value)}
                                disabled={isVerifying || isVerified}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label" htmlFor="accNumber">Account Number</label>
                            <input
                                id="accNumber"
                                type="password" // Or text, password adds some privacy to sensitive data usually
                                className="form-input"
                                placeholder="Enter your bank account number"
                                value={accNumber}
                                onChange={(e) => setAccNumber(e.target.value)}
                                disabled={isVerifying || isVerified}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="ifsc">IFSC Code</label>
                            <input
                                id="ifsc"
                                type="text"
                                className="form-input"
                                placeholder="e.g. SBIN0001234"
                                value={ifsc}
                                onChange={handleIfscChange}
                                disabled={isVerifying || isVerified}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="bankName">Bank Name</label>
                            <input
                                id="bankName"
                                type="text"
                                className="form-input"
                                placeholder="e.g. State Bank of India"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                disabled={isVerifying || isVerified}
                            />
                        </div>

                    </div>

                    {!isVerified && (
                        <button
                            type="button"
                            className={`action-btn ${isVerifying ? 'verifying-btn' : ''}`}
                            onClick={handleVerifyBank}
                            disabled={!isFormFilled || isVerifying}
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 size={18} className="spin-icon" />
                                    Verifying Account Details...
                                </>
                            ) : (
                                <>
                                    <Banknote size={18} />
                                    Verify Bank Account
                                </>
                            )}
                        </button>
                    )}

                    {isVerified && (
                        <div className="verify-badge animate-fade-in">
                            <CheckCircle2 size={18} />
                            Bank Account Verified via Penny Drop
                        </div>
                    )}
                </form>

                {isVerified && (
                    <div className="declaration-section animate-fade-in">
                        <div className="declaration-title">
                            <FileText size={20} className="text-emerald-600" />
                            Terms & Declarations
                        </div>

                        <div className="legal-text-box">
                            <p><strong>1. Authorization:</strong> I hereby authorize EZFINANZ to credit the sanctioned loan amount directly into the bank account provided above.</p>
                            <p><strong>2. E-Mandate Setup:</strong> I understand that an NACH/e-Mandate will be registered against this account for the automatic deduction of monthly EMIs as outlined in the loan agreement.</p>
                            <p><strong>3. Accuracy of Information:</strong> I declare that all information provided during this loan application, including identity, employment, and banking details, is accurate and true to the best of my knowledge.</p>
                            <p><strong>4. Credit Bureau:</strong> I authorize EZFINANZ to consult formal credit bureaus to ascertain my creditworthiness.</p>
                        </div>

                        <label className="checkbox-group">
                            <input
                                type="checkbox"
                                className="checkbox-input"
                                checked={isAccepted}
                                onChange={(e) => setIsAccepted(e.target.checked)}
                            />
                            <span className="checkbox-label">
                                I verify that the bank details provided are my own, and I accept the terms and conditions outlined above.
                            </span>
                        </label>

                        <button
                            type="button"
                            className="action-btn"
                            disabled={!isAccepted}
                            onClick={handleFinalProceed}
                        >
                            Proceed to Final Step
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default BankDetailsPage;
