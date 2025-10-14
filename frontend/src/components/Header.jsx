import React from "react";
import {jwtDecode} from "jwt-decode";

const Header = () => {
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <header className="bg-gray-900 text-white flex justify-between items-center px-6 py-4 shadow-md">
            <h1 className="text-xl font-bold">Timi Dashboard</h1>

            <div className="flex items-center gap-4">
                {userEmail && (
                    <span className="text-sm text-gray-300">
                        Welcome, <span className="font-semibold">{userEmail}</span>
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;