import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Core Flow Imports
import AuthPage from './pages/AuthPage';

// Portal Phase 10.5 Imports
import CustomerLayout from './components/layout/CustomerLayout';
import DashboardHome from './pages/portal/DashboardHome';
import ApplyLoan from './pages/portal/ApplyLoan';
import VerificationFlow from './pages/portal/VerificationFlow';
import MyProfile from './pages/portal/MyProfile';
import Documents from './pages/portal/Documents';

// Admin Portal Imports
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationReview from './pages/admin/ApplicationReview';
import AdminPending from './pages/admin/AdminPending';
import AdminDisbursements from './pages/admin/AdminDisbursements';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
    return (
        <Router>
            <Routes>
                {/* Core Onboarding Routes */}
                <Route path="/" element={<AuthPage />} />

                {/* User Dashboard Application Routes */}
                <Route path="/dashboard" element={<CustomerLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="apply" element={<ApplyLoan />} />
                    <Route path="verify" element={<VerificationFlow />} />
                    <Route path="profile" element={<MyProfile />} />
                    <Route path="documents" element={<Documents />} />
                </Route>

                {/* Admin Portal Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="pending" element={<AdminPending />} />
                    <Route path="disbursements" element={<AdminDisbursements />} />
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
