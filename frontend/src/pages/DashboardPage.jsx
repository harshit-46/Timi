import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {jwtDecode} from 'jwt-decode';

export default function Dashboard({ onLogout }) {
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserEmail(decoded.sub); // assuming your JWT 'sub' contains email
            } catch (err) {
                console.error('Invalid token');
            }
        }
    }, []);

    return (
        <>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Paper sx={{ p: 4, width: '60%' }}>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        Welcome, {userEmail}!
                    </Typography>
                    <Typography variant="body1">
                        This is your dashboard. You can now access protected routes and features.
                    </Typography>
                </Paper>
            </Box>
        </>
    );
}