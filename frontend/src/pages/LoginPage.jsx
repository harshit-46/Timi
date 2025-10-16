import React, { useState } from 'react';
import { authMethods } from '../services/authApi';

export default function LoginPage({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authMethods.login(email, password);
            onLogin(response.access_token, { email });
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left side */}
                <div className="flex flex-col justify-center space-y-4">
                    <h1 className="text-4xl font-bold text-indigo-500">Timi</h1>
                    <h2 className="text-2xl text-gray-700">Your AI-Powered Task Planner</h2>
                    <p className="text-gray-500 leading-relaxed">
                        ✨ Smart task scheduling<br />
                        📊 Track your productivity<br />
                        🎯 Optimize your day<br />
                        ⚡ Get things done faster
                    </p>
                </div>

                {/* Right side - Form */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-4">Login</h3>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-4">
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="text-indigo-500 hover:underline"
                        >
                            Register here
                        </button>
                    </p>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 bg-indigo-50 rounded">
                        <p className="text-gray-600 text-sm mb-1 font-semibold">Demo Credentials:</p>
                        <p className="text-gray-600 text-sm">Email: demo@example.com</p>
                        <p className="text-gray-600 text-sm">Password: password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}