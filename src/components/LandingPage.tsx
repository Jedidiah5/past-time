import React from 'react'
import { Clock, Lock, Send, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import image2 from '../image0.webp';
import image3 from '../image1.webp';
import image0 from '../image2.webp';
import image1 from '../image3.webp';

interface LandingPageProps {
  onGetStarted: () => void
  onLearnMore: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLearnMore }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-30 bg-white/30 backdrop-blur-lg transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 md:py-6 w-full">
            {/* Left: Nav Links */}
            <nav className="flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How it works</a>
            </nav>
            {/* Center: Logo */}
            <div className="flex-1 flex justify-center items-center absolute left-1/2 transform -translate-x-1/2">
              <div className="flex flex-col items-center">
                <Clock className="h-8 w-8 text-indigo-600" />
                <span className="text-xs font-bold text-gray-900 tracking-widest mt-1">PASTTIME</span>
              </div>
            </div>
            {/* Right: CTA */}
            <div className="flex items-center justify-end">
              <button
                onClick={onGetStarted}
                className="bg-black text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-96 h-96 bg-indigo-300 opacity-30 rounded-full blur-3xl absolute -top-32 -left-32 animate-pulse" />
          <div className="w-96 h-96 bg-purple-300 opacity-30 rounded-full blur-3xl absolute -bottom-32 -right-32 animate-pulse" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="mb-4">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full px-4 py-1 tracking-widest mb-4 shadow">TIME CAPSULES</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              The Most Meaningful Way To <br className="hidden md:block" />
              <span className="text-indigo-600">Connect With Your Future</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              PastTime lets you send messages, memories, and goals to your future self. Lock your thoughts in a digital capsule and rediscover them when the time is right.<br />
              Celebrate milestones, reflect on your journey, and preserve your most important moments for tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Get Started — For Free!</span>
              </button>
              <button
                onClick={onLearnMore}
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold bg-white/70 shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>See How it works</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white aspect-square flex items-center justify-center">
              <img src={image0} alt="Capsule 1" className="object-cover w-full h-full" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white aspect-square flex items-center justify-center">
              <img src={image1} alt="Capsule 2" className="object-cover w-full h-full" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white aspect-square flex items-center justify-center">
              <img src={image2} alt="Capsule 3" className="object-cover w-full h-full" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white aspect-square flex items-center justify-center">
              <img src={image3} alt="Capsule 4" className="object-cover w-full h-full" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why use PastTime?
            </h2>
            <p className="text-xl text-gray-600">
              Create meaningful connections with your future self
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
              icon: <Lock className="h-8 w-8 text-indigo-600" />,
              title: 'Time-Locked Security',
              desc: 'Messages remain sealed until your chosen date, creating genuine surprise and anticipation.'
            }, {
              icon: <Clock className="h-8 w-8 text-indigo-600" />,
              title: 'Perfect Timing',
              desc: 'Set messages for birthdays, anniversaries, or personal milestones you want to remember.'
            }, {
              icon: <Send className="h-8 w-8 text-indigo-600" />,
              title: 'Meaningful Messages',
              desc: 'Capture thoughts, goals, and emotions to rediscover later with fresh perspective.'
            }].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <Tilt glareEnable={true} glareMaxOpacity={0.2} scale={1.05} tiltMaxAngleX={15} tiltMaxAngleY={15} className="rounded-2xl">
                  <div className="text-center bg-white/80 rounded-2xl shadow-2xl p-8 hover:shadow-indigo-200 transition-all backdrop-blur-md">
                    <div className="bg-indigo-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.desc}
                    </p>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to create your time capsule
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-600 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Write Your Message
              </h3>
              <p className="text-gray-600">
                Compose a heartfelt message to your future self with title and content.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-600 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Set Unlock Date
              </h3>
              <p className="text-gray-600">
                Choose when you want to receive your message - days, months, or years ahead.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-600 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rediscover
              </h3>
              <p className="text-gray-600">
                Your capsule unlocks automatically, delivering your past wisdom at the perfect moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 PastTime. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage