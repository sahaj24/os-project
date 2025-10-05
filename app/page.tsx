'use client'

import { useState } from 'react'
import { Cpu, Play, Zap, Award, BookOpen, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type SchedulingType = 'FCFS' | 'SJF' | 'Priority' | 'RoundRobin'

interface Process {
  id: string
  burst: number
  priority: number
  color: string
}

const scenarios = [
  {
    question: "3 processes arrive at the same time. Which one runs FIRST in FCFS (First Come First Serve)?",
    processes: [
      { id: 'P1', burst: 5, priority: 2, color: 'bg-blue-400' },
      { id: 'P2', burst: 3, priority: 1, color: 'bg-green-400' },
      { id: 'P3', burst: 8, priority: 3, color: 'bg-purple-400' },
    ],
    correctAnswer: 'P1',
    algorithm: 'FCFS' as SchedulingType,
    hint: 'FCFS = First Come First Serve. The first process in line goes first!'
  },
  {
    question: "Which process runs FIRST in SJF (Shortest Job First)?",
    processes: [
      { id: 'P1', burst: 5, priority: 2, color: 'bg-blue-400' },
      { id: 'P2', burst: 2, priority: 1, color: 'bg-green-400' },
      { id: 'P3', burst: 8, priority: 3, color: 'bg-purple-400' },
    ],
    correctAnswer: 'P2',
    algorithm: 'SJF' as SchedulingType,
    hint: 'SJF picks the process with the SHORTEST burst time!'
  },
  {
    question: "Which process runs FIRST in Priority Scheduling? (Lower number = Higher priority)",
    processes: [
      { id: 'P1', burst: 5, priority: 3, color: 'bg-blue-400' },
      { id: 'P2', burst: 3, priority: 1, color: 'bg-green-400' },
      { id: 'P3', burst: 8, priority: 2, color: 'bg-purple-400' },
    ],
    correctAnswer: 'P2',
    algorithm: 'Priority' as SchedulingType,
    hint: 'Priority Scheduling picks the process with the LOWEST priority number (highest priority)!'
  },
  {
    question: "In Round Robin, each process gets 2 time units. After P1 runs, which process is NEXT?",
    processes: [
      { id: 'P1', burst: 5, priority: 2, color: 'bg-blue-400' },
      { id: 'P2', burst: 3, priority: 1, color: 'bg-green-400' },
      { id: 'P3', burst: 8, priority: 3, color: 'bg-purple-400' },
    ],
    correctAnswer: 'P2',
    algorithm: 'RoundRobin' as SchedulingType,
    hint: 'Round Robin takes turns! After P1, the next process in line is P2!'
  },
]

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const currentScenario = scenarios[currentLevel]

  const handleAnswer = (processId: string) => {
    if (feedback) return // Already answered

    if (processId === currentScenario.correctAnswer) {
      setFeedback('correct')
      setScore(score + 10)
      setTimeout(() => {
        if (currentLevel < scenarios.length - 1) {
          setCurrentLevel(currentLevel + 1)
          setFeedback(null)
          setShowHint(false)
        } else {
          setGameComplete(true)
        }
      }, 1500)
    } else {
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 1000)
    }
  }

  const resetGame = () => {
    setCurrentLevel(0)
    setScore(0)
    setShowHint(false)
    setFeedback(null)
    setGameComplete(false)
    setGameStarted(true)
  }


  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 overflow-hidden relative">
        {/* Floating background elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-20"
          animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center relative z-10"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Cpu className="w-20 h-20 text-primary mx-auto mb-6" />
          </motion.div>
          
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            You Are the CPU!
          </motion.h1>
          
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 mb-8"
          >
            Learn 4 CPU Scheduling Algorithms by playing a simple quiz game! 🎮
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 text-left"
          >
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              What you'll learn:
            </h3>
            <ul className="space-y-3 text-gray-700">
              {['FCFS - First Come First Serve', 'SJF - Shortest Job First', 'Priority - Priority Scheduling', 'Round Robin - Time Sharing'].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <strong>{item}</strong>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0"
              whileHover={{ opacity: 0.2 }}
            />
            <Play className="w-6 h-6 inline mr-2" />
            Start Learning!
          </motion.button>
        </motion.div>
      </div>
    )
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden relative">
        {/* Confetti-like elements */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${
              i % 3 === 0 ? 'bg-yellow-400' : i % 3 === 1 ? 'bg-green-400' : 'bg-blue-400'
            }`}
            initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1 }}
            animate={{ 
              y: window.innerHeight + 100, 
              rotate: 360,
              opacity: 0 
            }}
            transition={{ 
              duration: 2 + Math.random() * 2, 
              repeat: Infinity,
              delay: Math.random() * 2 
            }}
          />
        ))}

        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center relative z-10"
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Award className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4"
          >
            Congratulations! 🎉
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl text-gray-600 mb-4"
          >
            You've mastered CPU Scheduling!
          </motion.p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.6, duration: 0.5 }}
            className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8"
          >
            {score} Points
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8"
          >
            <p className="text-lg text-gray-700 font-semibold">
              You now understand the 4 main CPU scheduling algorithms! 🚀
            </p>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {['FCFS', 'SJF', 'Priority', 'Round Robin'].map((algo, i) => (
                <motion.span
                  key={algo}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                  className="bg-white px-4 py-2 rounded-full text-sm font-bold text-primary shadow-md"
                >
                  ✓ {algo}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg"
          >
            Play Again!
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Score */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Cpu className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold text-dark">CPU Scheduler Quiz</h2>
          </div>
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white px-6 py-3 rounded-full shadow-md"
            >
              <span className="text-sm text-gray-500">Score: </span>
              <motion.span
                key={score}
                initial={{ scale: 1.5, color: '#3b82f6' }}
                animate={{ scale: 1, color: '#1f2937' }}
                className="text-2xl font-bold"
              >
                {score}
              </motion.span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white px-6 py-3 rounded-full shadow-md"
            >
              <span className="text-sm text-gray-500">Level: </span>
              <span className="text-2xl font-bold text-purple-500">{currentLevel + 1}/4</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Game Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLevel}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            {/* Algorithm Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-bold mb-6 shadow-lg"
            >
              {currentScenario.algorithm}
            </motion.div>

            {/* Question */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-dark mb-8"
            >
              {currentScenario.question}
            </motion.h2>

            {/* Process Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {currentScenario.processes.map((process, index) => (
                <motion.button
                  key={process.id}
                  initial={{ y: 50, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: feedback ? 1 : 1.05, y: feedback ? 0 : -5 }}
                  whileTap={{ scale: feedback ? 1 : 0.95 }}
                  onClick={() => handleAnswer(process.id)}
                  disabled={feedback !== null}
                  className={`p-6 rounded-2xl border-4 transition-all ${
                    feedback === 'correct' && process.id === currentScenario.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : feedback === 'wrong' && process.id === currentScenario.correctAnswer
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-blue-300 hover:border-blue-500 bg-white hover:shadow-xl'
                  }`}
                >
                  <motion.div
                    animate={feedback === 'correct' && process.id === currentScenario.correctAnswer ? {
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.2, 1]
                    } : {}}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 ${process.color} rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                  >
                    {process.id}
                  </motion.div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">Burst Time</div>
                    <div className="text-3xl font-bold text-dark">{process.burst}</div>
                    <div className="text-sm text-gray-500 mt-3">Priority</div>
                    <div className="text-2xl font-bold text-purple-500">{process.priority}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {feedback === 'correct' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="bg-green-100 border-2 border-green-500 rounded-2xl p-6 mb-6"
                >
                  <motion.p
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.3, repeat: 2 }}
                    className="text-2xl font-bold text-green-700 text-center"
                  >
                    ✅ Correct! +10 points
                  </motion.p>
                </motion.div>
              )}

              {feedback === 'wrong' && (
                <motion.div
                  initial={{ x: -10 }}
                  animate={{ x: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                  className="bg-red-100 border-2 border-red-500 rounded-2xl p-6 mb-6"
                >
                  <p className="text-2xl font-bold text-red-700 text-center">
                    ❌ Try again!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint Button */}
            <div className="text-center">
              <AnimatePresence mode="wait">
                {!showHint ? (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowHint(true)}
                    className="text-primary hover:text-blue-700 font-semibold flex items-center gap-2 mx-auto"
                  >
                    <Zap className="w-5 h-5" />
                    Need a hint?
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6"
                  >
                    <p className="text-lg text-gray-700">
                      💡 <strong>Hint:</strong> {currentScenario.hint}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
