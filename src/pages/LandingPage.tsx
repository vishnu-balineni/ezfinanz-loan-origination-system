import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, Zap, Lock, Globe } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
    const navigate = useNavigate();

    const handleNavigation = (defaultIsLogin: boolean) => {
        navigate('/auth', { state: { defaultIsLogin } });
    };

    return (
        <div className="landing-page-container">
            {/* Ambient Backgrounds */}
            <div className="landing-ambient-1" />
            <div className="landing-ambient-2" />

            <div className="landing-content">
                <div className="landing-badge">
                    <Target size={16} />
                    <span>Next Generation System</span>
                </div>

                <h1 className="landing-title">
                    Empowering Modern <br />
                    <span>Loan Origination.</span>
                </h1>

                <p className="landing-subtitle">
                    Experience a completely frictionless, AI-driven digital lending platform. Securely apply, verify your identity, and get approved in seconds.
                </p>

                <div className="landing-actions">
                    <button
                        onClick={() => handleNavigation(false)}
                        className="landing-btn landing-btn-primary"
                    >
                        Create Account <ArrowRight size={20} />
                    </button>

                    <button
                        onClick={() => handleNavigation(true)}
                        className="landing-btn landing-btn-secondary"
                    >
                        Sign In
                    </button>
                </div>

                <div className="landing-features">
                    <div className="feature-item">
                        <div className="feature-icon-wrapper">
                            <Zap size={24} />
                        </div>
                        <span className="feature-text">Instant Decisions</span>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon-wrapper">
                            <Lock size={24} />
                        </div>
                        <span className="feature-text">Bank-Grade Security</span>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon-wrapper">
                            <Globe size={24} />
                        </div>
                        <span className="feature-text">100% Digital Flow</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
