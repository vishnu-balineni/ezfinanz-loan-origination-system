import { useState } from 'react';
import { Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { triggerCustomAlert } from '../components/shared/CustomAlertModal';

export default function PhoneVerificationPage({ onComplete }: { onComplete: () => void }) {
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (phone.length < 10) {
            triggerCustomAlert('error', 'Please enter a valid 10-digit phone number.', 'Invalid Input');
            return;
        }

        setIsLoading(true);
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

        try {
            // Update backend
            const response = await fetch(`https://exfinanz-backend.onrender.com/api/users/${storedUser.id}/phone`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            if (!response.ok) throw new Error("Failed to update phone number.");

            // Update local storage
            storedUser.phone = phone;
            localStorage.setItem('user', JSON.stringify(storedUser));

            triggerCustomAlert('success', 'Your phone number has been updated and securely verified!', 'Phone Linked');

            // Advance to KYC step
            onComplete();
        } catch (err: any) {
            triggerCustomAlert('error', err.message, 'Update Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ background: '#ecfdf5', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <Phone size={32} color="#10b981" />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Link Mobile Number</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
                Since you registered via Google OAuth, we need to securely pair a formal mobile number with your identity before proceeding to full KYC verification.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ position: 'relative', textAlign: 'left' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                        Mobile Number
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #cbd5e1', borderRadius: '0.5rem', overflow: 'hidden', padding: '0.5rem' }}>
                        <span style={{ color: '#94a3b8', padding: '0 0.5rem', fontWeight: 600 }}>+91</span>
                        <input
                            type="tel"
                            required
                            placeholder="Enter 10-digit number"
                            value={phone}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 10) setPhone(val);
                            }}
                            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, padding: '0.5rem', fontSize: '1rem', color: '#0f172a' }}
                        />
                        {phone.length === 10 && <CheckCircle2 size={20} color="#10b981" style={{ marginRight: '0.5rem' }} />}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || phone.length < 10}
                    style={{
                        background: isLoading || phone.length < 10 ? '#94a3b8' : '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: isLoading || phone.length < 10 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'background 0.2s',
                        marginTop: '1rem'
                    }}
                >
                    {isLoading ? 'Processing...' : 'Link & Continue'}
                    {!isLoading && <ArrowRight size={18} />}
                </button>
            </form>
        </div>
    );
}
