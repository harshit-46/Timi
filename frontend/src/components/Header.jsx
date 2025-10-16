import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    let userEmail = "";

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userEmail = decoded.sub || decoded.email || "";
        } catch (err) {
            console.error("Invalid token:", err);
        }
    }

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const initials = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

    return (
        <header className="border-2 border-red-800 bg-gray-900 text-white flex flex-col sm:flex-row justify-between items-center px-6 py-4 shadow-md gap-2 sm:gap-4">
            <h1 className="text-xl font-bold text-red bg-yellow-600">Timi Dashboard</h1>

            <div className="flex items-center gap-4">
                {userEmail && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white font-semibold">
                            {initials}
                        </div>
                        <span className="text-sm text-gray-300">
                            Welcome, <span className="font-semibold">{userEmail}</span>
                        </span>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                    Logout
                </button>
            </div>
            <div>
                <p className="text-red">This is a paragraph.</p>
            </div>
        </header>
    );
};

export default Header;