import {
    Edit2,
    Lock,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import './ProfileStyles.css';

const MyProfile = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userFullName = storedUser.fullName || "Guest User";
    const userRole = storedUser.isKycVerified ? "Verified Borrower" : "Unverified Identity";

    const [bankDetails, setBankDetails] = useState<any>(null);

    useEffect(() => {
        if (!storedUser.id) return;

        const fetchDetails = async () => {
            try {
                const res = await api.get(`/verification/${storedUser.id}/status`);
                if (res.data && res.data.bankDetails) {
                    setBankDetails(res.data.bankDetails);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchDetails();
    }, [storedUser.id]);

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className="profile-page-container">

            {/* Header Dark Block */}
            <div className="profile-header-card">
                <div className="profile-header-left">
                    <div className="header-avatar-box" style={{ background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', fontSize: '2rem', fontWeight: 700 }}>
                        {getInitials(userFullName)}
                    </div>
                    <div className="header-user-info">
                        <h2 className="header-user-name">
                            {userFullName}
                            <span className="edit-icon-chip" title="Edit Avatar">
                                <Edit2 size={14} />
                            </span>
                        </h2>
                        <span className="header-user-role" style={{ color: storedUser.isKycVerified ? '#10b981' : '#f59e0b' }}>
                            {userRole}
                        </span>
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
                            <span>{storedUser.phone || 'N/A'}</span>
                        </div>
                        <div className="detail-block light">
                            <label>Personal Email</label>
                            <span>{storedUser.email || 'N/A'}</span>
                        </div>
                        <div className="detail-block light" style={{ gridColumn: '1 / -1' }}>
                            <label>Associated Auth Method</label>
                            <span style={{ textTransform: 'capitalize' }}>{storedUser.authMethod || 'Unknown'} - Secure Identity</span>
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
                            <span>{bankDetails?.bankName || 'Not Provided'}</span>
                        </div>
                        <div className="detail-block dark" style={{ gridColumn: '1 / -1' }}>
                            <label>Account Number</label>
                            <span>{bankDetails?.accountNumber || 'XXXX-XXXX-XXXX'}</span>
                        </div>
                        <div className="detail-block dark">
                            <label>IFSC Code</label>
                            <span>{bankDetails?.ifscCode || 'N/A'}</span>
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
