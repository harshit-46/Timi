import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { LogOut, Menu, X } from "lucide-react";

const Header = ({ user, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Get user email from props or token
    let userEmail = user?.email || "";
    if (!userEmail) {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                userEmail = decoded.sub || decoded.email || "";
            } catch (err) {
                console.error("Invalid token:", err);
            }
        }
    }

    // Extract initials from email
    const getInitials = (email) => {
        if (!email) return "?";
        const namePart = email.split("@")[0];
        return namePart.charAt(0).toUpperCase();
    };

    const initials = getInitials(userEmail);

    const handleLogout = () => {
        setMobileMenuOpen(false);
        onLogout?.();
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                            Timi
                        </h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {userEmail && (
                            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full text-white font-semibold text-sm">
                                    {initials}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Welcome</span>
                                    <span className="text-sm font-medium text-gray-900">{userEmail}</span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-900" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-900" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
                        {userEmail && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full text-white font-semibold text-sm">
                                    {initials}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Welcome</span>
                                    <span className="text-sm font-medium text-gray-900">{userEmail}</span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;