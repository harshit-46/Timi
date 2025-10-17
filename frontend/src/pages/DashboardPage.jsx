import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState('');
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const initializeDashboard = () => {
            try {
                setError('');
                let email = '';

                try {
                    const userData = localStorage.getItem('user');
                    if (userData) {
                        const user = JSON.parse(userData);
                        email = user.email || '';
                        setName(user.name);
                        setUserName(user.name || user.email?.split('@')[0] || 'User');
                        setUserEmail(email);
                    }
                } catch (parseErr) {
                    console.error('Failed to parse user data:', parseErr);
                    localStorage.removeItem('user');
                }

                if (!email) {
                    try {
                        const token = localStorage.getItem('token');
                        if (token && typeof token === 'string' && token.trim()) {
                            // Validate token format before decoding
                            if (token.split('.').length === 3) {
                                const decoded = jwtDecode(token);
                                email = decoded.sub || decoded.email || 'User';
                                setUserEmail(email);
                                setUserName(email.split('@')[0] || 'User');
                            } else {
                                throw new Error('Invalid token format');
                            }
                        }
                    } catch (tokenErr) {
                        console.error('Invalid token in localStorage:', tokenErr);
                        localStorage.removeItem('token');
                        throw new Error('Authentication failed. Please login again.');
                    }
                }

                if (!email) {
                    throw new Error('No user information found. Please login again.');
                }

            } catch (err) {
                console.error('Dashboard initialization error:', err);
                setError(err.message || 'Failed to load user information');
            } finally {
                setLoading(false);
            }
        };

        initializeDashboard();
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-md mx-auto mt-20">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Authentication Error</h2>
                        <p className="text-gray-600 text-center mb-6">{error}</p>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            }}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, {name}! 👋
                    </h1>
                </div>
            </div>
        </div>
    );
}
