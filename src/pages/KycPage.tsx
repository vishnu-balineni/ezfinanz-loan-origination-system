import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import TrustFooter from '../components/shared/TrustFooter';
import { triggerCustomAlert } from '../components/shared/CustomAlertModal';
import api from '../services/api';
import './KycPage.css';

interface KycProps {
    onComplete?: () => void;
}

const KycPage = ({ onComplete }: KycProps) => {
    const navigate = useNavigate();

    // Form States
    const [fullName, setFullName] = useState('');
    const [dobDate, setDobDate] = useState<Date | null>(null);
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [documentType, setDocumentType] = useState('AADHAR');
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        dobDate !== null &&
        gender !== '' &&
        address.trim() !== '' &&
        panNumber.length === 10 &&
        nationalId.replace(/\s/g, '').length === 12 &&
        documentFile !== null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsSubmitting(true);
        // Simulate API call to PUT /api/loans/{loanId}/kyc
        // In a real app, you would upload the file to S3 first and get a URL, 
        // or send as multipart/form-data. For now we use the mock DTO we built.
        try {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = storedUser.id;

            if (!userId) {
                triggerCustomAlert('error', 'Session expired. Please log in again.', 'Unauthorized');
                navigate('/');
                return;
            }

            let docUrl = "https://dummyurl.com/doc.pdf";
            if (documentFile) {
                const base64data = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(documentFile);
                });
                const docId = 'doc_' + Date.now();
                localStorage.setItem(docId, base64data);
                docUrl = 'local:' + docId;
            }

            const payload = {
                documentType: documentType,
                documentUrl: docUrl
            };

            await api.post(`/verification/${userId}/kyc`, payload);

            triggerCustomAlert('success', "KYC Documents Uploaded & Submitted successfully!", 'KYC Verified');

            if (onComplete) {
                onComplete();
            } else {
                navigate('/eligibility');
            }
        } catch (error) {
            triggerCustomAlert('error', 'Failed to submit KYC documentation. Please try again.', 'KYC Submission Failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="kyc-page-container">
            <div className="kyc-card">

                <div className="progress-header">
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

                        {/* Date of Birth - Custom Datepicker */}
                        <div className="form-group custom-datepicker-wrapper">
                            <label className="form-label" htmlFor="dob">Date of Birth</label>
                            <DatePicker
                                id="dob"
                                selected={dobDate}
                                onChange={(date: Date | null) => setDobDate(date)}
                                className="form-input"
                                placeholderText="Select Date"
                                dateFormat="dd-MM-yyyy"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                maxDate={new Date()}
                            />
                        </div>

                        {/* Gender - Replaced Dropdown with Smooth Selectors */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="gender">Gender</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {['Male', 'Female', 'Other'].map(opt => (
                                    <button
                                        type="button"
                                        key={opt}
                                        onClick={() => setGender(opt)}
                                        style={{
                                            flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: '2px solid',
                                            borderColor: gender === opt ? '#10b981' : '#e2e8f0',
                                            background: gender === opt ? '#ecfdf5' : 'white',
                                            color: gender === opt ? '#065f46' : '#64748b',
                                            fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer',
                                            boxShadow: gender === opt ? '0 4px 6px -1px rgba(16, 185, 129, 0.2)' : 'none'
                                        }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
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

                    {/* Mandatory ID Upload */}
                    <div className="form-group full-width" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#1e293b' }}>Upload KYC Documents</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Document Type</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {[{ val: 'AADHAR', label: 'Aadhaar Card' }, { val: 'PAN', label: 'PAN Card' }, { val: 'PASSPORT', label: 'Passport' }].map(opt => (
                                    <button
                                        type="button"
                                        key={opt.val}
                                        onClick={() => setDocumentType(opt.val)}
                                        style={{
                                            flex: 1, minWidth: '120px', padding: '0.75rem', borderRadius: '0.75rem', border: '2px solid',
                                            borderColor: documentType === opt.val ? '#10b981' : '#e2e8f0',
                                            background: documentType === opt.val ? '#ecfdf5' : 'white',
                                            color: documentType === opt.val ? '#065f46' : '#64748b',
                                            fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer', textAlign: 'center',
                                            boxShadow: documentType === opt.val ? '0 4px 6px -1px rgba(16, 185, 129, 0.2)' : 'none'
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Document File (Required)</label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setDocumentFile(e.target.files ? e.target.files[0] : null)}
                            style={{ padding: '0.75rem', border: '1px dashed #94a3b8', borderRadius: '0.5rem', background: '#ffffff', width: '100%', cursor: 'pointer' }}
                        />
                        <div className="input-hint" style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#64748b' }}>Formats: JPG, PNG, PDF. Max size: 5MB.</div>

                        {documentFile && (
                            <div style={{ marginTop: '0.5rem', color: '#16a34a', fontSize: '0.85rem', fontWeight: 600 }}>
                                <CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                Attached: {documentFile.name}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="continue-btn"
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? 'Uploading...' : 'Save & Continue'}
                        <ArrowRight size={18} />
                    </button>
                </form>
            </div>
            <TrustFooter />
        </div >
    );
};

export default KycPage;
