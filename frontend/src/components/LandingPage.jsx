import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { useAuth } from '../context/AuthContext.jsx';

function LandingPage() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = useMemo(() => {
    if (!user) return '';
    return (
      user?.dbUser?.fullName ||
      user?.dbUser?.name ||
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      ''
    );
  }, [user]);

  const membershipLabel = useMemo(() => {
    if (!user) return 'Guest';
    return (
      user?.dashboard?.subscription?.membershipType ||
      user?.dbUser?.member?.membershipType ||
      'Member'
    );
  }, [user]);

  const initials = useMemo(() => {
    if (!displayName) return 'U';
    const nameParts = displayName.trim().split(' ').filter(Boolean);
    if (!nameParts.length) return displayName[0]?.toUpperCase() || 'U';
    const chars = nameParts.slice(0, 2).map((part) => part[0]?.toUpperCase() || '');
    return chars.join('');
  }, [displayName]);

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.dbUser?.avatarUrl ||
    null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span className="brand-name">Library Lite</span>
          </div>

          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>

          <div className="nav-actions">
            {loading ? (
              <div className="nav-loading-state">
                <span className="loading-dot" />
                <span className="loading-dot" />
                <span className="loading-dot" />
              </div>
            ) : user ? (
              <div className="nav-profile-menu" ref={menuRef}>
                <button
                  className="profile-chip"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <div className="profile-avatar">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <div className="profile-copy">
                    <span className="profile-name">{displayName}</span>
                    <span className="profile-role">{membershipLabel}</span>
                  </div>
                  <svg
                    className={`profile-chevron ${menuOpen ? 'open' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="profile-dropdown" role="menu">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/dashboard');
                      }}
                    >
                      View Dashboard
                    </button>
                    <button type="button" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>

                <button className="nav-btn login-btn" onClick={() => navigate('/auth?mode=login')}>
                  Login
                </button>
                <button className="nav-btn signup-btn" onClick={() => navigate('/auth?mode=signup')}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>Your Digital Library Companion</span>
            </div>
            <h1 className="hero-title">
              Discover, Borrow, and
              <span className="hero-title-gradient"> Manage Books</span>
              <br />With Ease
            </h1>
            <p className="hero-description">
              Experience a seamless library management system. Browse thousands of books,
              track your reading journey, and never miss a return date.
            </p>
            <div className="hero-buttons">
              <button className="hero-btn primary-btn" onClick={() => navigate('/auth?mode=signup')}>
                <span>Get Started Free</span>
                <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="hero-btn secondary-btn" onClick={() => navigate('/auth?mode=login')}>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card card-1">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <div className="card-title">Easy Browsing</div>
              <div className="card-subtitle">Find any book instantly</div>
            </div>
            <div className="visual-card card-2">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="card-title">Smart Reminders</div>
              <div className="card-subtitle">Never miss a due date</div>
            </div>
            <div className="visual-card card-3">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <div className="card-title">Track Progress</div>
              <div className="card-subtitle">Monitor your reading</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything You Need in One Place</h2>
            <p className="section-description">
              Powerful features designed to make library management effortless
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3 className="feature-title">Smart Cataloging</h3>
              <p className="feature-description">
                Organize your entire collection with intelligent categorization and search capabilities.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="feature-title">Due Date Tracking</h3>
              <p className="feature-description">
                Automated reminders ensure you never pay a late fee again with smart notifications.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="feature-title">User Management</h3>
              <p className="feature-description">
                Manage multiple users, track borrowing history, and maintain member profiles seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Library Experience?</h2>
            <p className="cta-description">
              Join thousands of readers who are already managing their reading journey efficiently.
            </p>
            <div className="cta-buttons">
              <button className="cta-btn primary" onClick={() => navigate('/auth?mode=signup')}>
                Start Your Journey
              </button>
              <button className="cta-btn secondary" onClick={() => navigate('/auth?mode=login')}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>Library Lite</span>
            </div>
            <p className="footer-text">© 2025 Library Lite. All rights reserved.</p>
            <p className="footer-credit">
              Made with{' '}
              <svg className="heart-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {' '}by Team Ungrateful Potatoes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;