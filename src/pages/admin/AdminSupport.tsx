
import ChatBot from '../../components/shared/ChatBot';
import { Sparkles } from 'lucide-react';
import '../../components/layout/AdminLayout.css';

const AdminSupport = () => {
    return (
        <div style={{ padding: '2rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem', flexShrink: 0 }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <Sparkles size={28} color="#3b82f6" /> EZFinanz Admin Copilot
                </h1>
                <p style={{ color: '#64748b' }}>
                    The advanced AI assistant analyzing risk workflows, auditing system architecture, and answering operational queries.
                </p>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <ChatBot mode="ADMIN" />
            </div>
        </div>
    );
};

export default AdminSupport;
