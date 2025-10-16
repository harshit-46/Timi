import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  const handleRegister = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {isLoggedIn && <Header user={user} onLogout={handleLogout} />}

      <main className="flex-grow flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <LoginPage
                    onLogin={handleLogin}
                    onSwitchToRegister={() => navigate("/register")}
                  />
                )
              }
            />
            <Route
              path="/register"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <RegisterPage
                    onRegister={handleRegister}
                    onSwitchToLogin={() => navigate("/login")}
                  />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? <DashboardPage /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}