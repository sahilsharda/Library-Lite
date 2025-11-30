import { useState } from "react";
import { Routes, Route, Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import BackgroundVideo from "./components/BackgroundVideo";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import UserProfile from "./components/UserProfile";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import Cart from "./components/Cart";
import Shop from "./components/Shop";
import { CartProvider } from "./context/CartContext";

function AuthWrapper({ onLoginSuccess }) {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode === 'signup' ? false : true);

  const handleSwitch = () => setIsLogin(!isLogin);

  return (
    <>
      <BackgroundVideo />
      {isLogin ? (
        <LoginPage onSwitchToSignup={handleSwitch} onLoginSuccess={onLoginSuccess} />
      ) : (
        <SignupPage onSwitchToLogin={handleSwitch} onSignupSuccess={onLoginSuccess} />
      )}
    </>
  );
}

function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.1)',
            borderTop: '4px solid #818cf8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#ffffff', fontSize: '16px' }}>Loading Library Lite...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <CartProvider>
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Shop & Cart Routes */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />

          {/* Auth Routes with Background Video */}
          <Route path="/auth" element={<AuthWrapper onLoginSuccess={handleLoginSuccess} />} />

          {/* Dashboard - Protected Route */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          {/* User Profile Route - Protected */}
          <Route
            path="/userprofile"
            element={
              user ? (
                <UserProfile user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
