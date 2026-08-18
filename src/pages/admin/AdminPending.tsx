import { FileSearch } from 'lucide-react';

const AdminPending = () => {
    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
            <FileSearch size={64} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Pending KYC Reviews</h1>
            <p style={{ color: '#64748b', maxWidth: '400px' }}>
                This module will contain a filtered queue specifically for users who need manual intervention for Aadhaar or PAN discrepancies.
            </p>
        </div>
    );
};

export default AdminPending;
