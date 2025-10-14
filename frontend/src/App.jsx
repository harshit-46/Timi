import React, { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Container } from '@mui/material'

import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
})

export default function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
      setCurrentPage('dashboard')
    }
  }, [])

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
  }

  const handleRegister = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
    setCurrentPage('login')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {isLoggedIn && (
          <Header user={user} onLogout={handleLogout} />
        )}
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {!isLoggedIn ? (
            <>
              {currentPage === 'login' && (
                <LoginPage
                  onLogin={handleLogin}
                  onSwitchToRegister={() => setCurrentPage('register')}
                />
              )}
              {currentPage === 'register' && (
                <RegisterPage
                  onRegister={handleRegister}
                  onSwitchToLogin={() => setCurrentPage('login')}
                />
              )}
            </>
          ) : (
            <DashboardPage />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  )
}