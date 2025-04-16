import React, { useState } from 'react';
import { User2, Mail, Lock, CreditCard, FileText, AlertTriangle, LogOut, Trash2 } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import ParticleBackground from '../../components/ParticleBackground';
import './AccountSettingsPage.css';

const AccountSettingsPage = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonMessage, setComingSoonMessage] = useState('');

  // Get user info from localStorage
  const userFirstName = localStorage.getItem('user_first_name') || '';
  const userLastName = localStorage.getItem('user_last_name') || '';
  const userEmail = localStorage.getItem('user_email') || '';

  // Placeholder data
  const userData = {
    subscription: 'basic',
    joinDate: '2023-10-15',
    totalNotes: 24,
    totalConversations: 156
  };

  const getInitials = () => {
    return `${userFirstName.charAt(0)}${userLastName.charAt(0)}`.toUpperCase();
  };

  const handleActionClick = (message: string) => {
    setComingSoonMessage(message);
    setShowComingSoon(true);
    setTimeout(() => {
      setShowComingSoon(false);
      setComingSoonMessage('');
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="account-settings-container">
        <div className="account-settings-header">
          <h1 className="page-title">Account Settings</h1>
        </div>

        <div className="account-settings-content">
          <ParticleBackground />
          
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar-container">
                <div className="avatar">
                  <span className="avatar-text">{getInitials()}</span>
                </div>
              </div>
              
              <div className="profile-info">
                <h2 className="profile-name">{`${userFirstName} ${userLastName}`}</h2>
                <p className="profile-email">{userEmail}</p>
                <span className="subscription-badge basic">
                  Basic Plan
                </span>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{userData.totalNotes}</div>
                <div className="stat-label">Total Notes</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{userData.totalConversations}</div>
                <div className="stat-label">Total Conversations</div>
              </div>
            </div>

            <div className="account-actions">
              <button 
                className="action-button"
                onClick={() => handleActionClick('Email change coming soon!')}
              >
                <Mail size={18} />
                <span>Change Email</span>
              </button>

              <button 
                className="action-button"
                onClick={() => handleActionClick('Password change coming soon!')}
              >
                <Lock size={18} />
                <span>Change Password</span>
              </button>

              <button 
                className="action-button"
                onClick={() => handleActionClick('Subscription management coming soon!')}
              >
                <CreditCard size={18} />
                <span>Manage Subscription</span>
              </button>

              <button 
                className="action-button"
                onClick={() => handleActionClick('User policy coming soon!')}
              >
                <FileText size={18} />
                <span>User Policy</span>
              </button>

              <button 
                className="action-button warning"
                onClick={() => handleActionClick('Sign out feature coming soon!')}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>

              <button 
                className="action-button danger"
                onClick={() => handleActionClick('Account deletion coming soon!')}
              >
                <Trash2 size={18} />
                <span>Delete Account</span>
              </button>
            </div>

            {showComingSoon && (
              <div className="coming-soon-alert">
                <AlertTriangle size={16} />
                <span>{comingSoonMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountSettingsPage;