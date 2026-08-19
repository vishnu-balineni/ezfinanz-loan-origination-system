import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export const triggerCustomAlert = (type: 'success' | 'error', message: string, title?: string) => {
    window.dispatchEvent(new CustomEvent('showCustomAlert', { detail: { type, message, title } }));
};

const CustomAlertModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [alertData, setAlertData] = useState<{ type: 'success' | 'error', message: string, title?: string }>({ type: 'success', message: '' });

    useEffect(() => {
        const handleAlert = (e: any) => {
            setAlertData(e.detail);
            setIsOpen(true);
        };
        window.addEventListener('showCustomAlert', handleAlert);
        return () => window.removeEventListener('showCustomAlert', handleAlert);
    }, []);

    if (!isOpen) return null;

    const isSuccess = alertData.type === 'success';

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                    <X size={20} />
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    {isSuccess ? (
                        <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', color: '#10b981' }}>
                            <CheckCircle2 size={40} />
                        </div>
                    ) : (
                        <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', color: '#ef4444' }}>
                            <XCircle size={40} />
                        </div>
                    )}
                    <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.5rem', fontWeight: 700 }}>
                        {alertData.title || (isSuccess ? 'Success' : 'Error')}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                        {alertData.message}
                    </p>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{
                            width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none',
                            background: isSuccess ? '#10b981' : '#ef4444',
                            color: 'white', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                            boxShadow: isSuccess ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(239, 68, 68, 0.3)'
                        }}
                    >
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomAlertModal;
