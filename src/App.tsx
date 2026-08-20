import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Core Flow Imports
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CustomAlertModal from './components/shared/CustomAlertModal';

// Portal Phase 10.5 Imports
import CustomerLayout from './components/layout/CustomerLayout';
import DashboardHome from './pages/portal/DashboardHome';
import ApplyLoan from './pages/portal/ApplyLoan';
import VerificationFlow from './pages/portal/VerificationFlow';
import MyProfile from './pages/portal/MyProfile';
import Documents from './pages/portal/Documents';
import LoanHistory from './pages/portal/LoanHistory';

// Admin Portal Imports
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationReview from './pages/admin/ApplicationReview';
import AdminPending from './pages/admin/AdminPending';
import AdminDisbursements from './pages/admin/AdminDisbursements';
import AdminActiveLoans from './pages/admin/AdminActiveLoans';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
    return (
        <Router>
            <CustomAlertModal />
            <Routes>
                {/* Core Onboarding Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* User Dashboard Application Routes */}
                <Route path="/dashboard" element={<CustomerLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="apply" element={<ApplyLoan />} />
                    <Route path="verify" element={<VerificationFlow />} />
                    <Route path="profile" element={<MyProfile />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="history" element={<LoanHistory />} />
                </Route>

                {/* Admin Portal Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="pending" element={<AdminPending />} />
                    <Route path="disbursements" element={<AdminDisbursements />} />
                    <Route path="active-loans" element={<AdminActiveLoans />} />
                    <Route path="profile" element={<AdminProfile />} />
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
