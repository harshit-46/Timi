import React, { useState } from 'react'
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    Grid
} from '@mui/material';
import authApi, { authMethods } from '../services/authApi';

export default function LoginPage({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await authMethods.login(email, password)
            onLogin(response.access_token, { email })
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Grid container spacing={4} sx={{ mt: 10 }}>
            <Grid item xs={12} md={6}>
                <Box>
                    <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#667eea' }}>
                        Timi
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, color: '#666' }}>
                        Your AI-Powered Task Planner
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: '#999', lineHeight: 1.8 }}>
                        ✨ Smart task scheduling
                        <br />
                        📊 Track your productivity
                        <br />
                        🎯 Optimize your day
                        <br />
                        ⚡ Get things done faster
                    </Typography>
                </Box>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            placeholder="your@email.com"
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            placeholder="••••••••"
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            size="large"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <Typography align="center" variant="body2" color="text.secondary">
                            Don't have an account?{' '}
                            <Button
                                color="primary"
                                onClick={onSwitchToRegister}
                                sx={{ textTransform: 'none', fontSize: '1rem' }}
                            >
                                Register here
                            </Button>
                        </Typography>
                    </form>

                    {/* Demo credentials */}
                    <Box sx={{ mt: 3, p: 2, backgroundColor: '#f0f4ff', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                            Demo Credentials:
                        </Typography>
                        <Typography variant="caption">
                            Email: demo@example.com
                        </Typography>
                        <br />
                        <Typography variant="caption">
                            Password: password123
                        </Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    )
}