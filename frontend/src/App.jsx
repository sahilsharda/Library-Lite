import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import BackgroundVideo from "./components/BackgroundVideo";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import UserProfile from "./components/UserProfile";
import Dashboard from "./components/Dashboard";


function App() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Route with Background Video */}
        <Route path="/login" element={
          <>
            <BackgroundVideo />
            <LoginPage onSwitchToSignup={() => window.location.href = '/signup'} />
          </>
        } />

        {/* Signup Route with Background Video */}
        <Route path="/signup" element={
          <>
            <BackgroundVideo />
            <SignupPage onSwitchToLogin={() => window.location.href = '/login'} />
          </>
        } />

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
