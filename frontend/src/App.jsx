import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

// Protected Route Component
const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (token && userData) {
          setIsLoggedIn(true);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear corrupted data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = (token, userData) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to save login information");
    }
  };

  const handleRegister = (token, userData) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Register error:", error);
      alert("Failed to save registration information");
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {isLoggedIn && <Header user={user} onLogout={handleLogout} />}

      <main className="flex-1">
        <Routes>
          {/* Redirect root to dashboard if logged in, otherwise to login */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <LoginPage
                  onLogin={handleLogin}
                  onSwitchToRegister={() => navigate("/register")}
                />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <RegisterPage
                  onRegister={handleRegister}
                  onSwitchToLogin={() => navigate("/login")}
                />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for undefined paths */}
          <Route
            path="*"
            element={
              <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}