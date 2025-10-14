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
import { authMethods } from '../services/authApi';

export default function RegisterPage({ onRegister, onSwitchToLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const response = await authMethods.register(email, password)
            onRegister(response.access_token, { email })
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Grid spacing={4} sx={{ mt: 10 }}>
            <Grid>
                <Box>
                    <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#667eea' }}>
                        Timi
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, color: '#666' }}>
                        Your AI-Powered Task Planner
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: '#999', lineHeight: 1.8 }}>
                        Get started with Timi today and:
                        <br />
                        ✨ Create and manage tasks
                        <br />
                        📊 Track your progress
                        <br />
                        🎯 Optimize your workflow
                        <br />
                        ⚡ Achieve your goals
                    </Typography>
                </Box>
            </Grid>

            <Grid>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Create Account
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

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {loading ? 'Creating account...' : 'Register'}
                        </Button>

                        <Typography align="center" variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Button
                                color="primary"
                                onClick={onSwitchToLogin}
                                sx={{ textTransform: 'none', fontSize: '1rem' }}
                            >
                                Login
                            </Button>
                        </Typography>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}