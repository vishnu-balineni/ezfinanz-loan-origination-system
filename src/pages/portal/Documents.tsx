import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, ShieldCheck, PlusCircle, UploadCloud } from 'lucide-react';
import { triggerCustomAlert } from '../../components/shared/CustomAlertModal';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './DashboardHome.css';
import './ProfileStyles.css';

const Documents = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [kycDocs, setKycDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!storedUser.id) return;

        const fetchDocs = async () => {
            try {
                const res = await api.get(`/verification/${storedUser.id}/status`);
                if (res.data && res.data.kycDocuments) {
                    setKycDocs(res.data.kycDocuments);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchDocs();
    }, [storedUser.id]);

    // Configurable row mapping to exact prompt specs
    const DocumentRow = ({ name, size, docUrl }: { name: string, size: string, docUrl?: string }) => {
        const getRealUrl = (url?: string) => {
            if (!url) return null;
            if (url.startsWith('local:')) return localStorage.getItem(url.split(':')[1]) || null;
            return url;
        };

        const handleDownload = () => {
            const dataUrl = getRealUrl(docUrl || name);
            if (dataUrl && dataUrl.startsWith('data:')) {
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = name;
                a.click();
            } else {
                triggerCustomAlert('success', `Document ${name} download started.`, 'Download');
            }
        };

        const handleView = () => {
            const dataUrl = getRealUrl(docUrl || name);
            if (dataUrl && (dataUrl.startsWith('data:') || dataUrl.startsWith('http'))) {
                const win = window.open();
                if (win) {
                    if (dataUrl.startsWith('data:')) {
                        win.document.write(`<iframe src="${dataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                    } else {
                        win.location.href = dataUrl;
                    }
                }
            } else {
                triggerCustomAlert('success', `Preview not available for ${name}.`, 'View Document');
            }
        };

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', background: '#ecfdf5', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                        <FileText size={20} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>PDF Document • {size}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={handleView}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: 'transparent', border: '1px solid #3b82f6',
                            padding: '0.5rem 1rem', borderRadius: '0.5rem',
                            color: '#3b82f6', cursor: 'pointer', fontWeight: 600
                        }}>
                        <FileText size={16} />
                        <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                        onClick={handleDownload}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: 'transparent', border: '1px solid #10b981',
                            padding: '0.5rem 1rem', borderRadius: '0.5rem',
                            color: '#10b981', cursor: 'pointer', fontWeight: 600
                        }}>
                        <Download size={16} />
                        <span className="hidden sm:inline">Download</span>
                    </button>
                </div>
            </div>
        );
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !storedUser.id) return;

        setIsUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64data = reader.result as string;

            try {
                // Infer type from filename or prompt user
                const docId = 'doc_' + Date.now();
                localStorage.setItem(docId, base64data);

                const payload = {
                    documentType: file.name.toUpperCase().includes('PAN') ? 'PAN' : file.name.toUpperCase().includes('AADHAAR') ? 'AADHAAR' : 'USER_UPLOAD',
                    documentUrl: 'local:' + docId
                };

                await api.post(`/verification/${storedUser.id}/kyc`, payload);
                triggerCustomAlert('success', `${file.name} uploaded successfully! Admin will verify.`, 'Upload Complete');

                // Refetch
                const res = await api.get(`/verification/${storedUser.id}/status`);
                if (res.data && res.data.kycDocuments) {
                    setKycDocs(res.data.kycDocuments);
                }
            } catch (err) {
                console.error(err);
                triggerCustomAlert('error', 'Failed to upload document.', 'Upload Error');
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="documents-page">
            <div className="profile-header-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="header-user-info">
                    <h2 className="header-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={28} color="#10b981" /> Digital Documents
                    </h2>
                    <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                        Access your loan agreements, upload KYC proofs, and manage repayment schedules securely.
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: '#3b82f6', color: 'white', border: 'none',
                            padding: '0.75rem 1.25rem', borderRadius: '0.5rem',
                            fontWeight: 600, cursor: isUploading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 4px rgba(59,130,246,0.2)'
                        }}
                    >
                        <UploadCloud size={18} />
                        {isUploading ? 'Uploading...' : 'Upload Document'}
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/apply')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: '#10b981', color: 'white', border: 'none',
                            padding: '0.75rem 1.25rem', borderRadius: '0.5rem',
                            fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)'
                        }}
                    >
                        <PlusCircle size={18} />
                        Apply for New Loan
                    </button>
                </div>
            </div>

            <div className="dash-card">
                <h3 className="card-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={20} className="text-emerald-600" />
                        Platform Documents & KYC Records
                    </div>
                </h3>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading records...</div>
                    ) : kycDocs.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No documents uploaded. Complete verification to see your records here.</div>
                    ) : kycDocs.map((doc, idx) => (
                        <DocumentRow key={idx}
                            name={doc.documentUrl && doc.documentUrl.startsWith('data:') ? 'Uploaded_Document.pdf' : `${doc.documentType}.pdf`}
                            size="1.2 MB"
                            docUrl={doc.documentUrl}
                        />
                    ))}

                    {/* Only show these if they actually have documents and are likely an active applicant */}
                    {kycDocs.length > 0 && (
                        <>
                            <DocumentRow name="Terms_Of_Service.pdf" size="0.4 MB" />
                            <DocumentRow name="E-Mandate_Consent.pdf" size="0.8 MB" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Documents;
