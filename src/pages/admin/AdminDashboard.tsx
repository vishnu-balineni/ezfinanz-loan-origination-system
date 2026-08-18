import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

// Mock applications mirroring our flow (Phase 1-9)
const mockApplications = [
    {
        id: "EZ-1042",
        name: "Rahul Sharma",
        amount: 100000,
        tenure: 12,
        stage: "Selfie Pending",
        date: "2026-08-18 14:30",
        cibil: 752,
        status: "Pending" // Yellow
    },
    {
        id: "EZ-1041",
        name: "Priya Patel",
        amount: 450000,
        tenure: 36,
        stage: "Disbursed",
        date: "2026-08-17 09:15",
        cibil: 810,
        status: "Approved" // Green
    },
    {
        id: "EZ-1040",
        name: "Amit Kumar",
        amount: 50000,
        tenure: 6,
        stage: "Eligibility Failed",
        date: "2026-08-16 11:20",
        cibil: 590,
        status: "Rejected" // Red
    }
];

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-dashboard">
            <div className="admin-header-row">
                <div className="admin-title-group">
                    <h1>Loan Applications</h1>
                    <p>Review and process incoming loan requests from applicants.</p>
                </div>
            </div>

            <div className="table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>App ID</th>
                            <th>Date / Time</th>
                            <th>Applicant Name</th>
                            <th>Stage</th>
                            <th>Requested Amount</th>
                            <th>Tenure</th>
                            <th>CIBIL Score</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockApplications.map((app) => (
                            <tr key={app.id}>
                                <td className="app-id">#{app.id}</td>
                                <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.date}</td>
                                <td className="app-name">{app.name}</td>
                                <td style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>{app.stage}</td>
                                <td>{formatCurrency(app.amount)}</td>
                                <td>{app.tenure} mo</td>
                                <td style={{ fontWeight: 600 }}>{app.cibil}</td>
                                <td>
                                    <span className={`status-badge ${app.status.toLowerCase()}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td>
                                    {app.status === 'Pending' ? (
                                        <button
                                            className="review-btn"
                                            onClick={() => navigate(`/admin/review/${app.id}`)}
                                        >
                                            Review App
                                        </button>
                                    ) : (
                                        <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>PROCESSED</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
