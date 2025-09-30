import { useState, useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import { useAuth } from './contexts/AuthContext'

function AppContent() {
  const { token } = useAuth()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      {token ? <Dashboard /> : <Auth />}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
