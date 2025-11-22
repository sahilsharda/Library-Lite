// components/DashboardPage.jsx
import React from 'react';
import './DashboardPage.css';

function DashboardPage({ onLogout }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <div className="dashboard-card">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="logo-small">
                <svg className="book-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="dashboard-title">Library Dashboard</h1>
                <p className="dashboard-subtitle">Welcome to your reading sanctuary</p>
              </div>
            </div>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-title">Books Read</h3>
              <p className="stat-number">24</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Currently Reading</h3>
              <p className="stat-number">3</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Reading Goal</h3>
              <p className="stat-number">50/100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;