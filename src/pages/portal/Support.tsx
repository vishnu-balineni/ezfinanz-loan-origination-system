
import ChatBot from '../../components/shared/ChatBot';
import { LifeBuoy } from 'lucide-react';
import './ProfileStyles.css';

const Support = () => {
    return (
        <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
            <div className="profile-header-card" style={{ marginBottom: '1.5rem', flexShrink: 0 }}>
                <div className="header-user-info">
                    <h2 className="header-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <LifeBuoy size={28} color="#10b981" /> AI Support Center
                    </h2>
                    <span className="header-user-role" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>
                        Get instant resolution for your loan queries, document requirements, and portal assistance.
                    </span>
                </div>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <ChatBot mode="USER" />
            </div>
        </div>
    );
};

export default Support;
