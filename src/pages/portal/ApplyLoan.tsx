import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Stethoscope, Home, GraduationCap, Banknote, ArrowRight, ShieldCheck } from 'lucide-react';
import './DashboardHome.css';

const ApplyLoan = () => {
    const navigate = useNavigate();
    const [loanAmount, setLoanAmount] = useState<number>(50000);
    const [purpose, setPurpose] = useState<string>('');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        if (purpose) {
            // Once application initialized, drop them into Verify flow
            navigate('/dashboard/verify');
        } else {
            alert('Please select a loan purpose before continuing.');
        }
    };

    const PurposeCard = ({ id, icon: Icon, title }: { id: string, icon: any, title: string }) => {
        const isSelected = purpose === id;
        return (
            <div
                onClick={() => setPurpose(id)}
                style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                    padding: '1.5rem', borderRadius: '1rem', cursor: 'pointer',
                    border: `2px solid ${isSelected ? '#10b981' : '#e2e8f0'}`,
                    background: isSelected ? '#ecfdf5' : 'white',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                }}
            >
                <div style={{ color: isSelected ? '#10b981' : '#64748b' }}>
                    <Icon size={32} />
                </div>
                <div style={{ fontWeight: 600, color: isSelected ? '#065f46' : '#1e293b' }}>
                    {title}
                </div>
            </div>
        );
    };

    return (
        <div className="onboarding-dashboard-view">
            <header className="welcome-header" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '0.5rem', color: '#10b981' }}>
                        <Rocket size={24} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#1e293b' }}>Start a New Application</h1>
                </div>
                <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>
                    Flexible personal loans customized exactly to your needs with guaranteed fast disbursals.
                </p>
            </header>

            <form onSubmit={handleApply} style={{ maxWidth: '800px' }}>
                <div className="dash-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '1.5rem' }}>
                        1. What is the primary purpose of this loan?
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <PurposeCard id="medical" icon={Stethoscope} title="Medical" />
                        <PurposeCard id="home" icon={Home} title="Home Renovation" />
                        <PurposeCard id="education" icon={GraduationCap} title="Education" />
                        <PurposeCard id="personal" icon={Banknote} title="Personal/Travel" />
                    </div>

                    <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '1.5rem' }}>
                        2. How much do you need?
                    </h3>

                    <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 700, color: '#10b981', fontSize: '1.5rem' }}>
                            <span>Amount</span>
                            <span>{formatCurrency(loanAmount)}</span>
                        </div>
                        <input
                            type="range"
                            min="10000"
                            max="1000000"
                            step="5000"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                            style={{
                                width: '100%', height: '8px', background: '#cbd5e1',
                                borderRadius: '4px', outline: 'none', appearance: 'none',
                                cursor: 'pointer', marginBottom: '1rem'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                            <span>₹10K</span>
                            <span>₹10L</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '1.5rem 2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b' }}>
                        <ShieldCheck size={20} color="#10b981" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Bank-grade secure application</span>
                    </div>

                    <button
                        type="submit"
                        disabled={!purpose}
                        style={{
                            background: purpose ? '#0f172a' : '#94a3b8',
                            color: 'white', border: 'none', padding: '0.875rem 2rem',
                            borderRadius: '0.5rem', fontWeight: 600, fontSize: '1rem',
                            cursor: purpose ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            transition: 'background 0.2s'
                        }}
                    >
                        Continue to Eligibility
                        <ArrowRight size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplyLoan;
