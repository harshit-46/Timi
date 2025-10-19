import { LogOut, Settings } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <header className="bg-white shadow-md border border-red-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

                {/* Logo Section */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    A
                </div>

                {/* User Profile Section */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow"
                    >
                        JD
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <p className="font-medium text-gray-800">John Doe</p>
                                <p className="text-sm text-gray-500">john@example.com</p>
                            </div>

                            <button className="w-full px-4 py-2 text-left flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors">
                                <Settings size={18} />
                                <span>Settings</span>
                            </button>

                            <button className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200" onClick={handleLogout}>
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}