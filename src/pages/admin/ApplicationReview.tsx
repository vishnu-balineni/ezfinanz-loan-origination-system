import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User2, MapPin, Receipt, CheckCircle2 } from 'lucide-react';
import './ApplicationReview.css';

const ApplicationReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data fetched for ID (Phase 1-9 collection point)
    const mockData = {
        name: "Rahul Sharma",
        dob: "15 Aug 1990",
        pan: "ABCDE1234F",
        aadhaar: "XXXX-XXXX-1234",
        address: "Apt 4B, Serenity Heights, Sector 45, Gurgaon, Haryana 122003",
        income: "₹85,000 / month",
        debts: "₹10,000 / month",
        cibil: 752,
        reqAmount: "₹1,00,000",
        emi: "₹8,885",
        bank: "State Bank of India",
        acctUrl: "XXXX-XXXX-1234",
        pennyDrop: true,
        mandate: "I hereby authorize EZFINANZ to deduct EMI obligations directly from my verified disbursement bank account."
    };

    const handleReject = () => {
        alert("Application Rejected. Notifying applicant.");
        navigate('/admin/dashboard');
    };

    const handleApprove = () => {
        alert("Application Approved! Initializing RazorPay disbursement.");
        navigate('/admin/dashboard');
    };

    return (
        <div className="review-page">
            <div className="review-header">
                <div>
                    <h1>Review Application #{id}</h1>
                    <p>Cross-reference KYC and financial capability before disbursement.</p>
                </div>
                <Link to="/admin/dashboard" className="back-btn">Back to Dashboard</Link>
            </div>

            <div className="review-grid">

                {/* Column 1: Identity */}
                <div className="review-card">
                    <h2><User2 size={18} style={{ display: 'inline', marginRight: '8px' }} />Identity Verification</h2>

                    <div className="data-group">
                        <label>Full Legal Name</label>
                        <div className="value">{mockData.name}</div>
                    </div>
                    <div className="data-group">
                        <label>Date of Birth</label>
                        <div className="value">{mockData.dob}</div>
                    </div>
                    <div className="data-group">
                        <label>PAN Number</label>
                        <div className="value">{mockData.pan}</div>
                        <div className="verified-tag"><ShieldCheck size={12} /> NSDL Verified</div>
                    </div>
                    <div className="data-group">
                        <label>National ID (Aadhaar)</label>
                        <div className="value">{mockData.aadhaar}</div>
                        <div className="verified-tag"><ShieldCheck size={12} /> UIDAI OK</div>
                    </div>
                    <div className="data-group">
                        <label><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Registered Address</label>
                        <div className="value" style={{ fontSize: '0.85rem' }}>{mockData.address}</div>
                    </div>
                </div>

                {/* Column 2: Financials */}
                <div className="review-card">
                    <h2><Receipt size={18} style={{ display: 'inline', marginRight: '8px' }} />Financial Health</h2>

                    <div className="data-group">
                        <label>Requested Loan Amount</label>
                        <div className="value" style={{ color: '#3b82f6', fontSize: '1.25rem' }}>{mockData.reqAmount}</div>
                    </div>
                    <div className="data-group">
                        <label>Calculated EMI</label>
                        <div className="value">{mockData.emi}</div>
                    </div>
                    <div className="data-group" style={{ display: 'flex', gap: '2rem' }}>
                        <div>
                            <label>Monthly Income</label>
                            <div className="value">{mockData.income}</div>
                        </div>
                        <div>
                            <label>Existing Debts</label>
                            <div className="value">{mockData.debts}</div>
                        </div>
                    </div>
                    <div className="data-group">
                        <label>CIBIL Score</label>
                        <div className="value" style={{ color: '#16a34a', fontSize: '1.25rem' }}>{mockData.cibil} (Excellent)</div>
                    </div>
                    <div className="data-group" style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                        <label>Bank Account (Disbursement)</label>
                        <div className="value">{mockData.bank} - {mockData.acctUrl}</div>
                        {mockData.pennyDrop && (
                            <div className="verified-tag" style={{ marginTop: '0.5rem' }}>
                                <CheckCircle2 size={14} /> Penny Drop Verified
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 3: Selfie & Consent */}
                <div className="review-card">
                    <h2><ShieldCheck size={18} style={{ display: 'inline', marginRight: '8px' }} />Visual & Consent</h2>

                    <div className="data-group">
                        <label>Live Selfie Capture</label>
                        <div className="selfie-box">
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=400" alt="Applicant Selfie" />
                        </div>
                    </div>

                    <div className="data-group">
                        <label>E-Mandate Signature</label>
                        <div className="mandate-text">
                            "{mockData.mandate}"
                        </div>
                        <div className="verified-tag" style={{ marginTop: '0.5rem' }}>
                            <CheckCircle2 size={12} /> Digitally Signed via OTP
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="admin-sticky-footer">
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#0f172a' }}>Decision Panel</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Finalizing action will lock this application state.</p>
                </div>
                <div className="action-buttons">
                    <button className="btn-reject" onClick={handleReject}>Reject Application</button>
                    <button className="btn-approve" onClick={handleApprove}>Approve & Disburse Funds</button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationReview;
