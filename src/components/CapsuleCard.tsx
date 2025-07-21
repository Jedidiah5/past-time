import React from 'react'
import { Calendar, Clock, Lock, Unlock } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

interface Capsule {
  id: string
  user_id: string
  title: string
  body: string
  unlock_date: string
  created_at: string
  media_url?: string
}

interface CapsuleCardProps {
  capsule: Capsule
  isUnlocked: boolean
}

const CapsuleCard: React.FC<CapsuleCardProps> = ({ capsule, isUnlocked }) => {
  const unlockDate = new Date(capsule.unlock_date)
  const createdDate = new Date(capsule.created_at)

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${!isUnlocked ? 'relative' : ''}`}>
      {/* Locked Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center text-white">
            <Lock className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Locked</p>
            <p className="text-sm">
              Unlocks {formatDistanceToNow(unlockDate, { addSuffix: true })}
            </p>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {isUnlocked ? (
              <Unlock className="h-5 w-5 text-green-600" />
            ) : (
              <Lock className="h-5 w-5 text-orange-600" />
            )}
            <span className={`text-sm font-medium ${isUnlocked ? 'text-green-600' : 'text-orange-600'}`}>
              {isUnlocked ? 'Unlocked' : 'Locked'}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{format(createdDate, 'MMM dd, yyyy')}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {capsule.title}
        </h3>

        <div className="text-gray-600 mb-4">
          <p className={`whitespace-pre-wrap ${!isUnlocked ? 'blur-sm' : ''}`}>
            {capsule.body}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>
              {isUnlocked ? 'Unlocked' : 'Unlocks'} {format(unlockDate, 'MMM dd, yyyy')}
            </span>
          </div>
          {isUnlocked && (
            <span className="text-green-600 font-medium">
              Available now
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CapsuleCard