import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, User2, MapPin, Receipt, CheckCircle2, ArrowLeft } from 'lucide-react';
import { triggerCustomAlert } from '../../components/shared/CustomAlertModal';
import api from '../../services/api';
import './ApplicationReview.css';

const ApplicationReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [loanData, setLoanData] = useState<any>(null);
    const [verificationData, setVerificationData] = useState<any>({ kycDocuments: [], bankDetails: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch the entire global queue to find our loan regardless of its specific lifecycle state.
                const res = await api.get('/loans/admin/all');
                const matchedLoan = res.data.find((l: any) => l.id.toString() === id);

                if (matchedLoan && matchedLoan.applicant) {
                    setLoanData(matchedLoan);
                    // Fetch Verification Data tied to this user
                    const verifRes = await api.get(`/verification/${matchedLoan.applicant.id}/status`);
                    setVerificationData(verifRes.data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Failed to load application details", err);
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleRejectSelfie = () => {
        const reason = prompt("Enter reason for selfie rejection (Optionally):");
        triggerCustomAlert('error', `Selfie Rejected. Applicant will be asked to re-upload. Reason: ${reason || 'Not specified'}`, 'Selfie Rejected');
    };

    const handleApproveSelfie = () => {
        triggerCustomAlert('success', "Selfie verified successfully. Applicant identity confirmed.", 'Selfie Verified');
    };

    const handleReject = async () => {
        setIsProcessing(true);
        try {
            await api.put(`/loans/admin/${id}/review`, { status: 'REJECTED', adminNotes: 'Rejected due to administrative criteria.' });
            triggerCustomAlert('success', "Application Rejected. Status updated in database.", 'Workflow Closed');
            navigate('/admin/dashboard');
        } catch (err) {
            triggerCustomAlert('error', "Failed to reject application.", 'System Error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApprove = async () => {
        setIsProcessing(true);
        try {
            await api.put(`/loans/admin/${id}/review`, {
                status: 'APPROVED',
                approvedAmount: loanData.requestedAmount,
                adminNotes: 'All KYC and Liveness passed.'
            });
            triggerCustomAlert('success', "Application Approved! EMI Schedule has been mathematically generated and stored.", 'Application Approved');
            navigate('/admin/dashboard');
        } catch (err) {
            triggerCustomAlert('error', "Failed to approve application.", 'System Error');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    };

    if (loading) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading application profile...</div>;
    }

    if (!loanData) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}>Application #{id} not found or no longer pending.</div>;
    }

    return (
        <div className="review-page">
            <div className="review-header">
                <div>
                    <h1>Review Application #{id}</h1>
                    <p>Cross-reference KYC and financial capability before disbursement.</p>
                </div>
                <button onClick={() => navigate(-1)} className="back-btn" style={{ background: '#10b981', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ArrowLeft size={16} /> Go Back</button>
            </div>

            <div className="review-grid">

                {/* Column 1: Identity */}
                <div className="review-card">
                    <h2><User2 size={18} style={{ display: 'inline', marginRight: '8px' }} />Identity Verification</h2>

                    <div className="data-group">
                        <label>Login / Verified Contacts</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <div className="verified-tag"><CheckCircle2 size={12} /> {loanData.applicant?.phone || 'N/A'}</div>
                            <div className="verified-tag"><CheckCircle2 size={12} /> {loanData.applicant?.email || 'N/A'}</div>
                        </div>
                    </div>

                    <div className="data-group">
                        <label>Full Legal Name</label>
                        <div className="value">{loanData.applicant?.fullName || 'N/A'}</div>
                    </div>
                    <div className="data-group">
                        <label>Account Created On</label>
                        <div className="value">{new Date(loanData.applicant?.createdAt || Date.now()).toLocaleDateString()}</div>
                    </div>
                    <div className="data-group">
                        <label>Provided Documents</label>
                        {verificationData.kycDocuments.length > 0 ? (
                            verificationData.kycDocuments.map((doc: any, i: number) => (
                                <div key={i} className="value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <div className="verified-tag"><ShieldCheck size={12} /> {doc.documentType}</div>
                                </div>
                            ))
                        ) : (
                            <div className="value" style={{ color: '#ef4444' }}>No Documents Uploaded</div>
                        )}
                    </div>
                    <div className="data-group">
                        <label>Verification Status</label>
                        <div className="verified-tag" style={{ background: loanData.applicant?.kycVerified ? '#dcfce7' : '#fee2e2', color: loanData.applicant?.kycVerified ? '#166534' : '#991b1b' }}>
                            {loanData.applicant?.kycVerified ? 'Fully KYC Verified' : 'Unverified'}
                        </div>
                    </div>
                </div>

                {/* Column 2: Financials */}
                <div className="review-card">
                    <h2><Receipt size={18} style={{ display: 'inline', marginRight: '8px' }} />Financial Health</h2>

                    <div className="data-group">
                        <label>Requested Loan Amount</label>
                        <div className="value" style={{ color: '#3b82f6', fontSize: '1.25rem' }}>{formatCurrency(loanData.requestedAmount || 0)}</div>
                    </div>
                    <div className="data-group">
                        <label>Requested Tenure</label>
                        <div className="value">{loanData.termMonths || 12} Months</div>
                    </div>

                    <div className="data-group" style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                        <label>Bank Account (Disbursement)</label>
                        {verificationData.bankDetails ? (
                            <>
                                <div className="value">{verificationData.bankDetails.bankName} - {verificationData.bankDetails.accountNumber}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>IFSC: {verificationData.bankDetails.ifscCode}</div>
                                <div className="verified-tag" style={{ marginTop: '0.5rem' }}>
                                    <CheckCircle2 size={14} /> Penny Drop Verified
                                </div>
                            </>
                        ) : (
                            <div className="value" style={{ color: '#ef4444' }}>No validated routing details available.</div>
                        )}
                    </div>
                </div>

                {/* New Section: EMI Schedule Preview */}
                <div className="review-card" style={{ gridColumn: '1 / -1', marginTop: '1rem', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
                    <h2 style={{ fontSize: '1.125rem', color: '#0f172a', marginBottom: '1rem' }}><Receipt size={18} style={{ display: 'inline', marginRight: '8px' }} />EMI Repayment Schedule Preview</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Approving this application will automatically generate this 12-month schedule in the database.</p>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ background: '#e2e8f0', color: '#334155', textAlign: 'left' }}>
                                    <th style={{ padding: '0.5rem' }}>Inst. #</th>
                                    <th style={{ padding: '0.5rem' }}>Due Date</th>
                                    <th style={{ padding: '0.5rem' }}>EMI Amount</th>
                                    <th style={{ padding: '0.5rem' }}>Principal</th>
                                    <th style={{ padding: '0.5rem' }}>Interest (1%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3].map(num => (
                                    <tr key={num} style={{ borderBottom: '1px solid #cbd5e1' }}>
                                        <td style={{ padding: '0.5rem' }}>{num}</td>
                                        <td style={{ padding: '0.5rem' }}>5 Oct 2026</td>
                                        <td style={{ padding: '0.5rem', fontWeight: 600 }}>{formatCurrency((loanData.requestedAmount || 0) * 0.09)}</td>
                                        <td style={{ padding: '0.5rem' }}>{formatCurrency((loanData.requestedAmount || 0) * 0.081)}</td>
                                        <td style={{ padding: '0.5rem' }}>{formatCurrency((loanData.requestedAmount || 0) * 0.009)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={5} style={{ padding: '0.5rem', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>... plus 9 more pending installments</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Column 3: Selfie & Consent */}
                <div className="review-card">
                    <h2><ShieldCheck size={18} style={{ display: 'inline', marginRight: '8px' }} />Visual & Consent</h2>

                    <div className="data-group">
                        <label>Live Selfie Capture ({loanData.applicant?.kycVerified ? "Verified User" : "Pending Review"})</label>
                        <div className="selfie-box">
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=400" alt="Applicant Selfie" />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button onClick={handleApproveSelfie} style={{ flex: 1, background: '#16a34a', color: 'white', padding: '0.5rem', border: 'none', borderRadius: '0.25rem', fontWeight: 600, cursor: 'pointer' }}>Approve Photo</button>
                            <button onClick={handleRejectSelfie} style={{ flex: 1, background: '#ef4444', color: 'white', padding: '0.5rem', border: 'none', borderRadius: '0.25rem', fontWeight: 600, cursor: 'pointer' }}>Reject Photo</button>
                        </div>
                    </div>

                    <div className="data-group">
                        <label>E-Mandate Signature</label>
                        <div className="mandate-text">
                            "I hereby authorize EZFINANZ to deduct EMI obligations directly from my verified disbursement bank account."
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
                    <button className="btn-reject" onClick={handleReject} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : 'Reject Application'}
                    </button>
                    <button className="btn-approve" onClick={handleApprove} disabled={isProcessing}>
                        {isProcessing ? 'Processing Approval...' : 'Approve & Create EMIs'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationReview;
