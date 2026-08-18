import { FileText, Download, ShieldCheck, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DashboardHome.css';
import './ProfileStyles.css';

const Documents = () => {
    const navigate = useNavigate();

    // Configurable row mapping to exact prompt specs
    const DocumentRow = ({ name, size }: { name: string, size: string }) => (
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
            <button style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'transparent', border: '1px solid #cbd5e1',
                padding: '0.5rem 1rem', borderRadius: '0.5rem',
                color: '#475569', cursor: 'pointer', fontWeight: 600
            }}>
                <Download size={16} />
                <span className="hidden sm:inline">Download</span>
            </button>
        </div>
    );

    return (
        <div className="documents-page">
            <div className="profile-header-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="header-user-info">
                    <h2 className="header-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={28} color="#10b981" /> Digital Documents
                    </h2>
                    <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                        Access your loan agreements, e-mandates, and repayment schedules securely.
                    </span>
                </div>
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

            <div className="dash-card">
                <h3 className="card-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={20} className="text-emerald-600" />
                        Loan Records
                    </div>
                </h3>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden' }}>
                    <DocumentRow name="Loan Agreement.pdf" size="1.2 MB" />
                    <DocumentRow name="E-Mandate Form.pdf" size="0.8 MB" />
                    <DocumentRow name="Repayment Schedule.pdf" size="2.1 MB" />
                </div>
            </div>
        </div>
    );
};

export default Documents;
