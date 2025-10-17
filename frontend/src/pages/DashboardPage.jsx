/*


import React, { useEffect, useState } from 'react';
import { CheckCircle, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token'); 

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://127.0.0.1:8000/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to fetch tasks');
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return toast.error('Task title required');
        try {
            const res = await fetch('http://127.0.0.1:8000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title: newTask }),
            });
            if (!res.ok) throw new Error('Failed to add task');
            const data = await res.json();
            setTasks((prev) => [...prev, data]);
            setNewTask('');
            toast.success('Task added!');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

            <form onSubmit={addTask} className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <PlusCircle className="w-5 h-5" /> Add
                </button>
            </form>

            {loading ? (
                <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <p className="text-gray-400">No tasks yet. Add one!</p>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle
                                    className={`w-5 h-5 ${task.completed ? 'text-green-500' : 'text-gray-500'
                                        }`}
                                />
                                <span
                                    className={`${task.completed ? 'line-through text-gray-400' : ''
                                        }`}
                                >
                                    {task.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

*/

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState('');
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
                        Welcome back, {userName}! 👋
                    </h1>
                </div>
            </div>
        </div>
    );
}
