import React from 'react'
import { Calendar, Clock, Lock, Unlock } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'

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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(99,102,241,0.25)' }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <Tilt glareEnable={true} glareMaxOpacity={0.25} scale={1.03} tiltMaxAngleX={10} tiltMaxAngleY={10} className="rounded-2xl">
        <div className={`bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-indigo-200 ${!isUnlocked ? 'relative' : ''}`}>
          {/* Locked Overlay */}
          {!isUnlocked && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-indigo-700/60 backdrop-blur-md z-10 flex items-center justify-center rounded-2xl">
              <div className="text-center text-white drop-shadow-lg">
                <Lock className="h-12 w-12 mx-auto mb-4 animate-bounce" />
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
                  <Unlock className="h-5 w-5 text-green-600 drop-shadow-md" />
                ) : (
                  <Lock className="h-5 w-5 text-orange-600 drop-shadow-md animate-pulse" />
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

            <h3 className="text-xl font-semibold text-gray-900 mb-3 drop-shadow-lg">
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
                <span className="text-green-600 font-medium animate-pulse">
                  Available now
                </span>
              )}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  )
}

export default CapsuleCard