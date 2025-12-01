import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useSearchParams, useNavigate } from "react-router-dom";
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
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in (from localStorage or session)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        Loading...
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
