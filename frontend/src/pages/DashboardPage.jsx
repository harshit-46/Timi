import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Complete project proposal', completed: true, dueDate: '2024-10-20' },
        { id: 2, title: 'Review team feedback', completed: false, dueDate: '2024-10-18' },
        { id: 3, title: 'Update documentation', completed: false, dueDate: '2024-10-22' },
    ]);

    useEffect(() => {
        const initializeDashboard = () => {
            try {
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('user');

                if (token) {
                    const decoded = jwtDecode(token);
                    setUserEmail(decoded.sub || decoded.email || 'User');
                }

                if (userData) {
                    const user = JSON.parse(userData);
                    setUserName(user.name || user.email?.split('@')[0] || 'User');
                    setUserEmail(user.email || userEmail);
                }
            } catch (err) {
                console.error('Dashboard initialization error:', err);
                setError('Failed to load user information');
            } finally {
                setLoading(false);
            }
        };

        initializeDashboard();
    }, []);

    const toggleTaskCompletion = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const completedCount = tasks.filter(task => task.completed).length;
    const totalCount = tasks.length;

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, {userName}! 👋
                    </h1>
                    <p className="text-gray-600">{userEmail}</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-indigo-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{totalCount}</p>
                            </div>
                            <Calendar className="w-12 h-12 text-indigo-100" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Completed</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {completedCount}/{totalCount}
                                </p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-100" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-orange-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {totalCount - completedCount}
                                </p>
                            </div>
                            <Clock className="w-12 h-12 text-orange-100" />
                        </div>
                    </div>
                </div>

                {/* Tasks Section */}
                <div className="bg-white rounded-xl shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 text-lg">No tasks yet. Create one to get started!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {tasks.map(task => (
                                <div
                                    key={task.id}
                                    className="p-4 flex items-center gap-4 hover:bg-gray-50 transition group"
                                >
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTaskCompletion(task.id)}
                                        className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
                                    />
                                    <div className="flex-1">
                                        <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                            {task.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-500">{task.dueDate}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                        <h3 className="text-lg font-semibold text-indigo-900 mb-2">Productivity Tip</h3>
                        <p className="text-indigo-800 text-sm">
                            Break down large tasks into smaller, manageable steps. This helps you stay focused and motivated.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                        <h3 className="text-lg font-semibold text-purple-900 mb-2">Getting Started</h3>
                        <p className="text-purple-800 text-sm">
                            Start by creating your first task and organize your day. Timi AI will help you prioritize efficiently.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}