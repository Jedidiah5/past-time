import React, { useState } from 'react'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'

const AppContent: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false)

  if (showDashboard) {
    return <Dashboard />
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