import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Clock, Plus, Calendar, Lock, Unlock, Mail, LogOut, Menu, X } from 'lucide-react'
import { format, isAfter, formatDistanceToNow } from 'date-fns'
import CreateCapsuleForm from './CreateCapsuleForm'
import CapsuleCard from './CapsuleCard'

interface Capsule {
  id: string
  user_id: string
  title: string
  body: string
  unlock_date: string
  created_at: string
  media_url?: string
}

interface DashboardProps {
  initialEmail?: string
  initialEmailSet?: boolean
  onLogout?: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ initialEmail = '', initialEmailSet = false, onLogout }) => {
  const [capsules, setCapsules] = useState<Capsule[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [userEmail, setUserEmail] = useState(initialEmail)
  const [emailSet, setEmailSet] = useState(initialEmailSet)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!userEmail) {
      const savedEmail = localStorage.getItem('userEmail')
      if (savedEmail) {
        setUserEmail(savedEmail)
        setEmailSet(true)
      }
    }
    fetchCapsules()
  }, [])

  const fetchCapsules = async () => {
    try {
      const { data, error } = await supabase
        .from('capsules')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCapsules(data || [])
    } catch (error) {
      console.error('Error fetching capsules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userEmail.trim()) {
      setEmailSet(true)
      localStorage.setItem('userEmail', userEmail.trim())
    }
  }

  const unlockedCapsules = capsules.filter(capsule => 
    isAfter(new Date(), new Date(capsule.unlock_date))
  )

  const lockedCapsules = capsules.filter(capsule => 
    !isAfter(new Date(), new Date(capsule.unlock_date))
  )

  // Add delete handler for locked capsules
  const handleDeleteCapsule = async (id: string) => {
    try {
      // Only delete if sent_at is null (not sent)
      const { error } = await supabase
        .from('capsules')
        .delete()
        .eq('id', id)
        .is('sent_at', null)
      if (error) throw error
      fetchCapsules()
    } catch (err) {
      alert('Failed to delete capsule. It may have already been sent or there was an error.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your time capsules...</p>
        </div>
      </div>
    )
  }

  // Show email input form if email not set
  if (!emailSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Clock className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-900">PastTime</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Enter Your Email
              </h2>
              <p className="text-gray-600 mt-2">
                We'll use this to schedule your time capsule deliveries
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Header - styled to match Landing Page */}
      <header className="fixed top-0 left-0 w-full z-30 bg-white/30 backdrop-blur-lg transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 md:py-6 w-full">
            {/* Left: Logo */}
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <Clock className="h-8 w-8 text-indigo-600" />
                <span className="text-xs font-bold text-gray-900 tracking-widest mt-1">PASTTIME</span>
              </div>
            </div>

            {/* Center: Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How it works</a>
            </nav>

            {/* Right: User Email & Logout */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:block text-gray-600 font-medium bg-white/60 px-4 py-2 rounded-full shadow-sm text-sm">{userEmail}</span>
              <button
                onClick={onLogout}
                title="Log out"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-6 w-6 text-gray-500 hover:text-red-500" />
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 rounded-lg mt-2 shadow-lg">
                <div className="px-3 py-2 text-gray-600 font-medium bg-gray-50 rounded-md">
                  {userEmail}
                </div>
                <a
                  href="#features"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How it works
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Capsule Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Capsule</span>
          </button>
        </div>

        {/* Create Capsule Form */}
        {showCreateForm && (
          <div className="mb-8">
            <CreateCapsuleForm
              userEmail={userEmail}
              onSuccess={() => {
                setShowCreateForm(false)
                fetchCapsules()
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* Unlocked Capsules */}
        {unlockedCapsules.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <Unlock className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Unlocked Capsules ({unlockedCapsules.length})
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {unlockedCapsules.map((capsule) => (
                <CapsuleCard key={capsule.id} capsule={capsule} isUnlocked={true} />
              ))}
            </div>
          </div>
        )}

        {/* Locked Capsules */}
        {lockedCapsules.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <Lock className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Locked Capsules ({lockedCapsules.length})
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lockedCapsules.map((capsule) => (
                <CapsuleCard key={capsule.id} capsule={capsule} isUnlocked={false} onDelete={handleDeleteCapsule} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {capsules.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No capsules yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first time capsule to get started!
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Create Your First Capsule
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard