import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import VerificationPage from './pages/VerificationPage';
import KycPage from './pages/KycPage';
import EligibilityPage from './pages/EligibilityPage';
import BankDetailsPage from './pages/BankDetailsPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/verify" element={<VerificationPage />} />
                <Route path="/kyc" element={<KycPage />} />
                <Route path="/eligibility" element={<EligibilityPage />} />
                <Route path="/bank" element={<BankDetailsPage />} />
                <Route path="/home" element={<HomePage />} />
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
