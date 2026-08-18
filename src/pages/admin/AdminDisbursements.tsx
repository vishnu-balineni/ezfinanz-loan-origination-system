import { Banknote } from 'lucide-react';

const AdminDisbursements = () => {
    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
            <Banknote size={64} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Finance & Disbursements</h1>
            <p style={{ color: '#64748b', maxWidth: '400px' }}>
                This dashboard will handle the API connections bridging approved applications into the RazorPay/banking disbursement lifecycle.
            </p>
        </div>
    );
};

export default AdminDisbursements;
