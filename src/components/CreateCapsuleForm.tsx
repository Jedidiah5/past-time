import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Calendar, FileText, Send, X, AlertCircle, Clock } from 'lucide-react'

interface CreateCapsuleFormProps {
  userEmail: string
  onSuccess: () => void
  onCancel: () => void
}

const CreateCapsuleForm: React.FC<CreateCapsuleFormProps> = ({ userEmail, onSuccess, onCancel }) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [unlockDate, setUnlockDate] = useState('')
  const [unlockTime, setUnlockTime] = useState('')
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Combine date and time as entered by the user (local time in selected timezone)
      const localDateTimeString = `${unlockDate}T${unlockTime}:00`;
      const unlockDateTime = new Date(localDateTimeString);
      const now = new Date();
      // Validation: must be at least 5 minutes in the future if today (in local time)
      if (unlockDate === minDate) {
        const nowInTzString = now.toLocaleString('en-US', { timeZone: timezone });
        const nowInTz = new Date(nowInTzString);
        const minAllowedInTz = new Date(nowInTz.getTime() + 5 * 60000);
        const unlockInTz = new Date(localDateTimeString);
        if (unlockInTz < minAllowedInTz) {
          setError('Time must be at least 5 minutes from now if today is selected')
          setLoading(false)
          return
        }
      } else if (unlockDateTime <= now) {
        setError('Unlock date and time must be in the future')
        setLoading(false)
        return
      }
      const { error: insertError } = await supabase
        .from('capsules')
        .insert({
          user_id: userEmail,
          title,
          body,
          unlock_date: unlockDateTime.toISOString(),
          timezone,
        })
      if (insertError) throw insertError
      setSuccess(`Time capsule scheduled! You'll receive "${title}" on ${unlockDate} ${unlockTime} (${timezone}) at ${userEmail}`)
      setTitle('')
      setBody('')
      setUnlockDate('')
      setUnlockTime('')
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date()
  const minDate = today.toISOString().split('T')[0]

  // Helper: get min time if today is selected
  let minTime = ''
  if (unlockDate === minDate) {
    // 5 minutes from now, formatted as HH:MM
    const now = new Date()
    now.setMinutes(now.getMinutes() + 5)
    minTime = now.toTimeString().slice(0,5)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Create New Time Capsule</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
          <Clock className="h-5 w-5 text-green-600" />
          <span className="text-green-600 text-sm">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capsule Title
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Give your capsule a meaningful title"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message to Your Future Self
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Write your message here... What do you want to tell your future self?"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unlock Date & Time
          </label>
          <div className="flex space-x-2 mb-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                min={minDate}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="time"
                value={unlockTime}
                onChange={(e) => setUnlockTime(e.target.value)}
                min={minTime || undefined}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {Intl.supportedValuesOf ?
                Intl.supportedValuesOf('timeZone').map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                )) :
                [<option key={timezone} value={timezone}>{timezone}</option>]
              }
            </select>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Choose when you want to receive this message at {userEmail}.<br />
            The unlock time will be converted to UTC based on your selected timezone.
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Send className="h-5 w-5" />
            <span>{loading ? 'Scheduling...' : 'Schedule Capsule'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateCapsuleForm