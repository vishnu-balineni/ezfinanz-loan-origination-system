import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Core Flow Imports
import AuthPage from './pages/AuthPage';
import VerificationPage from './pages/VerificationPage';
import KycPage from './pages/KycPage';
import EligibilityPage from './pages/EligibilityPage';
import BankDetailsPage from './pages/BankDetailsPage';
import SelfiePage from './pages/SelfiePage';

// Portal Phase 10.5 Imports
import CustomerLayout from './components/layout/CustomerLayout';
import DashboardHome from './pages/portal/DashboardHome';
import MyProfile from './pages/portal/MyProfile';
import Documents from './pages/portal/Documents';

// Admin Portal Imports
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationReview from './pages/admin/ApplicationReview';

function App() {
    return (
        <Router>
            <Routes>
                {/* Core Onboarding Routes */}
                <Route path="/" element={<AuthPage />} />
                <Route path="/verify" element={<VerificationPage />} />
                <Route path="/kyc" element={<KycPage />} />
                <Route path="/eligibility" element={<EligibilityPage />} />
                <Route path="/bank" element={<BankDetailsPage />} />
                <Route path="/selfie" element={<SelfiePage />} />

                {/* User Dashboard Application Routes */}
                <Route path="/dashboard" element={<CustomerLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="profile" element={<MyProfile />} />
                    <Route path="documents" element={<Documents />} />
                </Route>

                {/* Admin Portal Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="review/:id" element={<ApplicationReview />} />
                </Route>

                {/* Legacy redirect bridges handling UX flows seamlessly */}
                <Route path="/home" element={<Navigate to="/dashboard" replace />} />
                <Route path="/portal" element={<Navigate to="/dashboard" replace />} />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
