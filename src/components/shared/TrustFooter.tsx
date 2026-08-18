import { Lock, ShieldCheck, Building2 } from 'lucide-react';

const TrustFooter = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            padding: '1.5rem 0',
            marginTop: '2rem',
            color: '#64748b',
            borderTop: '1px solid #e2e8f0',
            flexWrap: 'wrap'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                <Lock size={16} color="#94a3b8" />
                <span>256-BIT SSL ENCRYPTION</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                <ShieldCheck size={16} color="#16a34a" />
                <span style={{ color: '#475569' }}>BANK GRADE SECURITY</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                <Building2 size={16} color="#94a3b8" />
                <span>RBI REGISTERED NBFC PARTNER</span>
            </div>
        </div>
    );
};

export default TrustFooter;
