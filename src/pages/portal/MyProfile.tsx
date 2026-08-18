import {
    Edit2,
    Lock,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
import './ProfileStyles.css';

const MyProfile = () => {
    // Restored EZFinanz specific User Data Context
    const userProfile = {
        fullName: "Rahul Sharma",
        role: "Verified Borrower",
        phone: "+91 98765 43210",
        email: "rahul.sharma@example.com",
        dob: "15 Aug 1990",
        panData: "ABCDE1234F",
        bankName: "State Bank of India",
        accountNo: "XXXX-XXXX-1234",
        ifsc: "SBIN0001234"
    };

    return (
        <div className="profile-page-container">

            {/* Header Dark Block */}
            <div className="profile-header-card">
                <div className="profile-header-left">
                    <div className="header-avatar-box">
                        <img src="https://ui-avatars.com/api/?name=Rahul+Sharma&background=dcfce7&color=166534&size=150" alt="Avatar" />
                    </div>
                    <div className="header-user-info">
                        <h2 className="header-user-name">
                            {userProfile.fullName}
                            <span className="edit-icon-chip" title="Edit Avatar">
                                <Edit2 size={14} />
                            </span>
                        </h2>
                        <span className="header-user-role">{userProfile.role}</span>
                    </div>
                </div>
            </div>

            {/* Split Grid Section */}
            <div className="profile-grid">

                {/* Left Card: Personal Details (Light) */}
                <div className="info-card light">
                    <div className="card-title-row">
                        <h3>Personal & KYC Details</h3>
                        <div className="tooltip-container">
                            <button className="edit-btn">
                                <Edit2 size={14} />
                                Edit Request
                            </button>
                            <span className="tooltip-text">Contact support to update KYC details</span>
                        </div>
                    </div>

                    <div className="details-grid">
                        <div className="detail-block light">
                            <label>Personal Contact Number</label>
                            <span>{userProfile.phone}</span>
                        </div>
                        <div className="detail-block light">
                            <label>Personal Email</label>
                            <span>{userProfile.email}</span>
                        </div>
                        <div className="detail-block light">
                            <label>Date of Birth</label>
                            <span>{userProfile.dob}</span>
                        </div>
                        <div className="detail-block light">
                            <label>PAN Number</label>
                            <span>{userProfile.panData}</span>
                        </div>
                    </div>

                    <div className="password-box">
                        <div className="pwd-left">
                            <div className="pwd-icon">
                                <Lock size={20} />
                            </div>
                            <div className="pwd-text">
                                <h4>Change Password</h4>
                                <p>Update your security credentials regularly</p>
                            </div>
                        </div>
                        <ChevronRight size={18} color="#94a3b8" />
                    </div>
                </div>

                {/* Right Card: Official Details (Dark) */}
                <div className="info-card dark">
                    <div className="card-title-row">
                        <h3>Disbursement Account</h3>
                    </div>

                    <div className="details-grid">
                        <div className="detail-block dark">
                            <label>Bank Name</label>
                            <span>{userProfile.bankName}</span>
                        </div>
                        <div className="detail-block dark" style={{ gridColumn: '1 / -1' }}>
                            <label>Account Number</label>
                            <span>{userProfile.accountNo}</span>
                        </div>
                        <div className="detail-block dark">
                            <label>IFSC Code</label>
                            <span>{userProfile.ifsc}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Card: Identity & Travel */}
            <div className="bottom-card">
                <h3>Identity Verification</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShieldCheck size={20} color="#17a966" />
                        <span style={{ fontWeight: 800, color: '#0b1727' }}>Digital Records — KYC, Aadhaar & Authorizations</span>
                    </div>
                    <button className="edit-btn">
                        <Edit2 size={14} />
                        View
                    </button>
                </div>
            </div>

        </div>
    );
};

export default MyProfile;
