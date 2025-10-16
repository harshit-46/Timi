/*

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
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">

                <div className="absolute -top-16 -left-16 w-40 h-40 bg-indigo-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>

                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">Timi AI</h1>
                    <p className="text-gray-500 mt-2">Smarter planning for a productive day</p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl transition transform disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-4">
                    New here?{' '}
                    <button
                        onClick={onSwitchToRegister}
                        className="text-indigo-500 font-semibold hover:underline"
                    >
                        Create an account
                    </button>
                </p>

                <div className="mt-6 p-4 bg-gray-100 rounded-xl text-sm text-gray-600">
                    <p className="font-semibold mb-1">Demo Credentials:</p>
                    <p>Email: demo@example.com</p>
                    <p>Password: password123</p>
                </div>
            </div>
        </div>
    );
}

*/



import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }
        
        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Simulate API call (replace with actual authMethods.login)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockResponse = { 
                access_token: 'mock_token_' + Math.random(),
                user: { email } 
            };
            
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            }
            
            onLogin?.(mockResponse.access_token, { email });
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Logo/Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                            Timi AI
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Smarter planning for your day</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex gap-3 items-start animate-in">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-50"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                                    Forgot?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={loading}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-xs text-gray-500">New to Timi?</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Register Link */}
                    <button
                        onClick={onSwitchToRegister}
                        disabled={loading}
                        className="w-full py-2.5 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition disabled:opacity-50"
                    >
                        Create an account
                    </button>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-gray-600">
                        <p className="font-semibold text-amber-900 mb-1">Demo Login:</p>
                        <p><span className="text-gray-700">Email:</span> demo@example.com</p>
                        <p><span className="text-gray-700">Password:</span> password123</p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-white text-xs mt-6 opacity-90">
                    © 2024 Timi AI. All rights reserved.
                </p>
            </div>
        </div>
    );
}