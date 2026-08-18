import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Stepper } from '../components/Stepper';
import './KycPage.css';

const KycPage = () => {
    const navigate = useNavigate();

    // Form States
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [nationalId, setNationalId] = useState('');

    // Input Masking Handlers
    const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Auto-capitalize, alphanumeric only, max length 10
        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
        setPanNumber(val);
    };

    const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Numeric only, max length 12
        const rawValue = e.target.value.replace(/\D/g, '').slice(0, 12);

        // Format with spaces every 4 digits
        const formatted = rawValue.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        setNationalId(formatted);
    };

    // Validation
    const isFormValid =
        fullName.trim() !== '' &&
        dob !== '' &&
        gender !== '' &&
        address.trim() !== '' &&
        panNumber.length === 10 &&
        nationalId.replace(/\s/g, '').length === 12;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            // Next step placeholder
            navigate('/eligibility');
        }
    };

    return (
        <div className="kyc-page-container">
            <div className="kyc-card">

                <div className="progress-header">
                    <Stepper currentStep={2} />
                    <h1 className="progress-title">KYC Details</h1>
                </div>

                <form onSubmit={handleSubmit} className="kyc-form">

                    <div className="form-grid">

                        {/* Full Name */}
                        <div className="form-group full-width">
                            <label className="form-label" htmlFor="fullName">Full Name (as per ID)</label>
                            <input
                                id="fullName"
                                type="text"
                                className="form-input"
                                placeholder="Enter your full legal name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        {/* Date of Birth */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="dob">Date of Birth</label>
                            <input
                                id="dob"
                                type="date"
                                className="form-input"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                        </div>

                        {/* Gender */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                className="form-select"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Current Address */}
                        <div className="form-group full-width">
                            <label className="form-label" htmlFor="address">Current Address</label>
                            <textarea
                                id="address"
                                className="form-textarea"
                                placeholder="Enter your complete residential address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        {/* PAN Number */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="panNumber">PAN Number</label>
                            <input
                                id="panNumber"
                                type="text"
                                className="form-input"
                                placeholder="ABCDE1234F"
                                value={panNumber}
                                onChange={handlePanChange}
                            />
                            <div className="input-hint">10-character alphanumeric</div>
                        </div>

                        {/* National ID / Aadhaar */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="nationalId">National ID (Aadhaar)</label>
                            <input
                                id="nationalId"
                                type="text"
                                className="form-input"
                                placeholder="XXXX XXXX XXXX"
                                value={nationalId}
                                onChange={handleNationalIdChange}
                            />
                            <div className="input-hint">12-digit numeric ID</div>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="continue-btn"
                        disabled={!isFormValid}
                    >
                        Save & Continue
                        <ArrowRight size={18} />
                    </button>

                </form>
            </div>
        </div>
    );
};

export default KycPage;
