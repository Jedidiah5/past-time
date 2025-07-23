import React, { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'

const AppContent: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false)
  const [savedEmail, setSavedEmail] = useState<string | null>(null)

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (email) {
      setSavedEmail(email)
      setShowDashboard(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userEmail')
    setSavedEmail(null)
    setShowDashboard(false)
  }

  if (showDashboard) {
    return <Dashboard initialEmail={savedEmail || ''} initialEmailSet={!!savedEmail} onLogout={handleLogout} />
  }
  return (
    <LandingPage
      onGetStarted={() => setShowDashboard(true)}
      onLearnMore={() => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
      }}
    />
  )
}

const App: React.FC = () => {
  return (
    <AppContent />
  )
}

export default App