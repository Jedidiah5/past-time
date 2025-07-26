import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Calendar, FileText, Send, X, AlertCircle, Clock } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import TimePicker from 'react-time-picker'
import 'react-time-picker/dist/TimePicker.css'
import Select from 'react-select'
import { DateTime } from 'luxon'

interface CreateCapsuleFormProps {
  userEmail: string
  onSuccess: () => void
  onCancel: () => void
}

const timezoneOptions = (Intl.supportedValuesOf
  ? Intl.supportedValuesOf('timeZone')
  : [Intl.DateTimeFormat().resolvedOptions().timeZone]
).map(tz => ({ value: tz, label: tz }))

const CreateCapsuleForm: React.FC<CreateCapsuleFormProps> = ({ userEmail, onSuccess, onCancel }) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [unlockDate, setUnlockDate] = useState<Date | null>(null)
  const [unlockTime, setUnlockTime] = useState('')
  const [timezone, setTimezone] = useState({ value: Intl.DateTimeFormat().resolvedOptions().timeZone, label: Intl.DateTimeFormat().resolvedOptions().timeZone })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!unlockDate || !unlockTime) {
        setError('Please select both date and time')
        setLoading(false)
        return
      }
      // Use Luxon to combine date, time, and timezone, then convert to UTC
      const [hours, minutes] = unlockTime.split(':')
      const local = DateTime.fromObject(
        {
          year: unlockDate.getFullYear(),
          month: unlockDate.getMonth() + 1,
          day: unlockDate.getDate(),
          hour: Number(hours),
          minute: Number(minutes),
        },
        { zone: timezone.value }
      )
      const unlockDateTimeUTC = local.toUTC().toISO()
      const now = DateTime.utc()
      if (local <= now) {
        setError('Unlock date and time must be in the future')
        setLoading(false)
        return
      }
      const { data: insertData, error: insertError } = await supabase
        .from('capsules')
        .insert({
          user_id: userEmail,
          title,
          body,
          unlock_date: unlockDateTimeUTC,
          timezone: timezone.value,
        })
        .select()
      
      if (insertError) {
        console.error('Supabase insert error:', insertError)
        throw new Error(`Failed to create capsule: ${insertError.message}`)
      }
      
      if (!insertData || insertData.length === 0) {
        throw new Error('No data returned from capsule creation')
      }
      setSuccess(`Time capsule scheduled! You'll receive "${title}" on ${local.toLocaleString(DateTime.DATETIME_MED)} (${timezone.value}) at ${userEmail}`)
      setTitle('')
      setBody('')
      setUnlockDate(null)
      setUnlockTime('')
      setTimezone({ value: Intl.DateTimeFormat().resolvedOptions().timeZone, label: Intl.DateTimeFormat().resolvedOptions().timeZone })
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date()

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6 rounded-2xl">
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
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-100 text-blue-700 placeholder-blue-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-none"
              placeholder="Title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Your Future Self
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full bg-gray-100 text-blue-700 placeholder-blue-400 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-none"
              placeholder="Write your message here..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unlock Date & Time
            </label>
            <div className="flex flex-col md:flex-row md:space-x-2 mb-2 gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                <DatePicker
                  selected={unlockDate}
                  onChange={date => setUnlockDate(date)}
                  minDate={today}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholderText="Select date"
                  dateFormat="MM/dd/yyyy"
                  required
                />
              </div>
              <div className="relative flex-1">
                <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                <TimePicker
                  onChange={setUnlockTime}
                  value={unlockTime}
                  disableClock={true}
                  clearIcon={null}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  format="HH:mm"
                  required
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <Select
                options={timezoneOptions}
                value={timezone}
                onChange={tz => setTimezone(tz!)}
                classNamePrefix="react-select"
                className="w-full"
                isSearchable
                required
              />
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
    </div>
  )
}

export default CreateCapsuleForm