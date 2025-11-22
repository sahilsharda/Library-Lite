import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext.jsx';
import './LoginPage.css';

function LoginPage({ onSwitchToSignup, onLogin, onLoginSuccess }) {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields!');
            return;
        }

        setLoading(true);

        try {
            const result = await authAPI.login(formData.email, formData.password);
            try {
                await refreshUser({ silent: true });
            } catch (refreshError) {
                console.error('Unable to refresh user session:', refreshError);
            }

            // Call the new callback if provided (from App.jsx)
            if (onLoginSuccess) {
                onLoginSuccess(result.user);
            } else if (onLogin) {
                // Fallback to old callback
                onLogin(result);
            }

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                {/* Logo Section */}
                <div className="logo-section">
                    <div className="logo-box">
                        <svg className="book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                    </div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to continue your reading journey</p>
                </div>

                {/* Login Form */}
                <div className="login-card">
                    <div className="form-container">
                        {/* Email Input */}
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                    <path d="m2 7 10 6 10-6"></path>
                                </svg>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="form-input"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div className="input-wrapper">
                                <svg  className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="form-input with-toggle"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="error-message" style={{
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                marginBottom: '16px',
                                textAlign: 'center'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="btn btn-primary"
                            disabled={loading}
                            style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">New to our library?</span>
                        <div className="divider-line"></div>
                    </div>

                    {/* Switch to Signup */}
                    <button type="button" onClick={onSwitchToSignup} className="btn btn-secondary">
                        Create Account
                    </button>
                </div>

                {/* Footer */}
                <p className="footer-text">
                    By continuing, you agree to our Terms & Privacy Policy
                </p>

                {/* Back to Home Link */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

