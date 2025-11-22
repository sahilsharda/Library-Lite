import React, { useState } from "react";
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import BackgroundVideo from "./components/BackgroundVideo";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import UserProfile from "./components/UserProfile";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";

function AuthWrapper() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode === 'signup' ? false : true);

  const handleSwitch = () => setIsLogin(!isLogin);

  return (
    <>
      <BackgroundVideo />
      {isLogin ? (
        <LoginPage onSwitchToSignup={handleSwitch} />
      ) : (
        <SignupPage onSwitchToLogin={handleSwitch} />
      )}
    </>
  );
}

function App() {

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes with Background Video */}
        <Route path="/auth" element={<AuthWrapper />} />

        {/* User Profile Route */}
        <Route path="/userprofile" element={<UserProfile />} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
