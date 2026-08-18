import { Download, History, CheckCircle2, FileText } from 'lucide-react';
import './DashboardHome.css';

const LoanHistory = () => {
    return (
        <div className="history-page" style={{ paddingBottom: '2rem' }}>
            <header className="page-header" style={{ marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                    <History size={28} color="#10b981" /> Full History & Logs
                </h1>
                <p className="page-subtitle" style={{ color: '#64748b' }}>Complete record of your loan applications, disbursements, and payment receipts.</p>
            </header>

            {/* Payment Schedule & Receipts */}
            <div className="dash-card" style={{ marginBottom: '2rem' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                    <FileText size={20} color="#10b981" />
                    Payment Schedule & Receipts
                </h3>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.875rem' }}>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Transaction ID</th>
                                <th style={{ padding: '1rem' }}>Description</th>
                                <th style={{ padding: '1rem' }}>Amount</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '1rem', color: '#1e293b' }}>05 Nov 2026</td>
                                <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Upcoming</td>
                                <td style={{ padding: '1rem', color: '#1e293b' }}>EMI Payment (Month 3)</td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>₹8,885</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>Pending</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>Pay Now</button>
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#fdfdfd' }}>
                                <td style={{ padding: '1rem', color: '#1e293b' }}>05 Oct 2026</td>
                                <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>TXN-9844321A</td>
                                <td style={{ padding: '1rem', color: '#1e293b' }}>EMI Payment (Month 2)</td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>₹8,885</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ background: '#ecfdf5', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>Paid</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button style={{ background: 'transparent', border: 'none', color: '#10b981', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Download size={14} /> Receipt
                                    </button>
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '1rem', color: '#1e293b' }}>05 Sep 2026</td>
                                <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>TXN-3211559C</td>
                                <td style={{ padding: '1rem', color: '#1e293b' }}>EMI Payment (Month 1)</td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>₹8,885</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ background: '#ecfdf5', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>Paid</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button style={{ background: 'transparent', border: 'none', color: '#10b981', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Download size={14} /> Receipt
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Logs */}
            <div className="dash-card">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                    <CheckCircle2 size={20} color="#10b981" />
                    Application Milestone Logs
                </h3>

                <div style={{ padding: '1rem 0' }}>

                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ minWidth: '120px', color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>Oct 24, 2026<br />14:02 PM</div>
                        <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1.5rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-7px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>Bank Mandate Registered</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Successful NACH registration with HDFC Bank ending in 1234.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ minWidth: '120px', color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>Oct 24, 2026<br />13:50 PM</div>
                        <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1.5rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-7px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>KYC Verified</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Aadhaar XML and PAN verification confirmed via automated systems.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ minWidth: '120px', color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>Oct 24, 2026<br />13:15 PM</div>
                        <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1.5rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-7px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>Credit Check Performed</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Credit Bureau fetched and returned a valid eligibility band.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ minWidth: '120px', color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>Oct 24, 2026<br />13:00 PM</div>
                        <div style={{ borderLeft: '2px solid transparent', paddingLeft: '1.5rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-7px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>Application Initialized</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>New Personal Loan application started via the Dashboard.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoanHistory;
