'use client'

import { useState } from 'react'
import { Cpu, Play, Zap, Award, BookOpen, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type SchedulingType = 'FCFS' | 'SJF' | 'Priority' | 'RoundRobin'

type AnswerType = 'process' | 'option'

interface Process {
  id: string
  color: string
  burst?: number
  priority?: number
  arrivalOrder?: number
  remaining?: number
}

interface Option {
  id: string
  label: string
  description?: string
}

interface Scenario {
  id: string
  question: string
  algorithm: SchedulingType
  answerType: AnswerType
  correctAnswer: string
  processes?: Process[]
  options?: Option[]
  context?: string[]
  hint: string
  explanation: string
}

const formatProcessStats = (process: Process) => {
  const stats: { label: string; value: string }[] = []

  if (process.arrivalOrder !== undefined) {
    stats.push({ label: 'Arrival Order', value: `#${process.arrivalOrder}` })
  }

  if (process.burst !== undefined) {
    stats.push({ label: 'Burst Time', value: `${process.burst}` })
  }

  if (process.priority !== undefined) {
    stats.push({ label: 'Priority', value: `${process.priority}` })
  }

  if (process.remaining !== undefined) {
    stats.push({ label: 'Remaining Time', value: `${process.remaining}` })
  }

  return stats
}

const scenarios: Scenario[] = [
  {
    id: 'Q1',
    question: 'FCFS: 3 processes arrive in the order P1 → P2 → P3. Which process runs first?',
    algorithm: 'FCFS',
    answerType: 'process',
    correctAnswer: 'P1',
    processes: [
      { id: 'P1', burst: 4, arrivalOrder: 1, color: 'bg-blue-400' },
      { id: 'P2', burst: 6, arrivalOrder: 2, color: 'bg-green-400' },
      { id: 'P3', burst: 2, arrivalOrder: 3, color: 'bg-purple-400' },
    ],
    hint: 'FCFS = First Come First Serve. The earliest arrival always runs first.',
    explanation: 'FCFS serves processes strictly by arrival order. P1 arrived first, so it starts execution before P2 and P3.'
  },
  {
    id: 'Q2',
    question: 'SJF (Non-Preemptive): All three processes arrive together. Which process runs first?',
    algorithm: 'SJF',
    answerType: 'process',
    correctAnswer: 'P2',
    processes: [
      { id: 'P1', burst: 6, color: 'bg-blue-400' },
      { id: 'P2', burst: 2, color: 'bg-green-400' },
      { id: 'P3', burst: 4, color: 'bg-purple-400' },
    ],
    hint: 'Shortest Job First always picks the smallest burst time available.',
    explanation: 'All jobs arrive at once, so SJF compares burst times. P2 (burst 2) is the smallest, so it goes first.'
  },
  {
    id: 'Q3',
    question: 'Priority Scheduling (Non-Preemptive, lower number = higher priority). Who goes first?',
    algorithm: 'Priority',
    answerType: 'process',
    correctAnswer: 'P2',
    processes: [
      { id: 'P1', burst: 5, priority: 3, color: 'bg-blue-400' },
      { id: 'P2', burst: 4, priority: 1, color: 'bg-green-400' },
      { id: 'P3', burst: 2, priority: 2, color: 'bg-purple-400' },
    ],
    hint: 'Lower number = higher priority. Choose the smallest priority value.',
    explanation: 'Priority scheduling selects the highest priority first. P2 has priority 1, higher than P3 (2) and P1 (3).'
  },
  {
    id: 'Q4',
    question: 'Round Robin with quantum = 3. After the first cycle, which process has the largest remaining time?',
    algorithm: 'RoundRobin',
    answerType: 'process',
    correctAnswer: 'P3',
    processes: [
      { id: 'P1', burst: 5, remaining: 2, color: 'bg-blue-400' },
      { id: 'P2', burst: 4, remaining: 1, color: 'bg-green-400' },
      { id: 'P3', burst: 7, remaining: 4, color: 'bg-purple-400' },
    ],
    context: ['Each process receives up to 3 units in the first round.', 'Remaining time = burst − time used in that round.'],
    hint: 'Subtract 3 from any burst ≥ 3. The largest leftover wins.',
    explanation: 'After one quantum each: P1 has 2 left, P2 has 1, P3 has 4. P3 retains the most time, so it leads the next cycle.'
  },
  {
    id: 'Q5',
    question: 'FCFS Average Waiting Time: Processes arrive in order P1 → P2 → P3 with bursts 4, 3, and 1. What is the average waiting time (rounded to the nearest whole number)?',
    algorithm: 'FCFS',
    answerType: 'option',
    correctAnswer: 'C',
    processes: [
      { id: 'P1', burst: 4, arrivalOrder: 1, color: 'bg-blue-400' },
      { id: 'P2', burst: 3, arrivalOrder: 2, color: 'bg-green-400' },
      { id: 'P3', burst: 1, arrivalOrder: 3, color: 'bg-purple-400' },
    ],
    options: [
      { id: 'A', label: '2', description: 'Underestimates the waiting caused by P1 and P2.' },
      { id: 'B', label: '3', description: 'Ignores that P3 waits through both P1 and P2.' },
      { id: 'C', label: '4', description: 'Rounds 11/3 ≈ 3.67 to the nearest whole number.' },
    ],
    context: ['Exact average waiting time = 11/3 ≈ 3.67.'],
    hint: 'Waiting time accumulates the bursts of the processes ahead. Sum the waits and divide by 3, then round.',
    explanation: 'P1 waits 0, P2 waits 4, P3 waits 7. Average = (0 + 4 + 7) / 3 = 11/3 ≈ 3.67, which rounds to 4.'
  },
]

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const currentScenario = scenarios[currentLevel]

  const handleAnswer = (choiceId: string) => {
    if (feedback) return // Already answered

    if (choiceId === currentScenario.correctAnswer) {
      setFeedback('correct')
      setExplanation(currentScenario.explanation)
      setScore(prev => prev + 10)
      setTimeout(() => {
        if (currentLevel < scenarios.length - 1) {
          setCurrentLevel(prev => prev + 1)
          setFeedback(null)
          setShowHint(false)
          setExplanation(null)
        } else {
          setGameComplete(true)
          setExplanation(null)
        }
      }, 2000)
    } else {
      setFeedback('wrong')
      setExplanation(null)
      setTimeout(() => setFeedback(null), 1000)
    }
  }

  const resetGame = () => {
    setCurrentLevel(0)
    setScore(0)
    setShowHint(false)
    setFeedback(null)
    setExplanation(null)
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
            Congratulations! 🎉
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
              What you’ll learn:
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
            You’ve mastered CPU Scheduling!
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
              <span className="text-2xl font-bold text-purple-500">{currentLevel + 1}/{scenarios.length}</span>
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

            {/* Scenario Context */}
            {currentScenario.context && currentScenario.context.length > 0 && (
              <motion.ul
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 text-blue-800 space-y-2"
              >
                {currentScenario.context.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 text-blue-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>
            )}

            {/* Process Cards (interactive) */}
            {currentScenario.answerType === 'process' && currentScenario.processes && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {currentScenario.processes.map((process, index) => {
                  const stats = formatProcessStats(process)

                  return (
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
                          ? 'border-green-300 bg-green-50/70'
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
                      <div className="space-y-3">
                        {stats.map(stat => (
                          <div key={`${process.id}-${stat.label}`}>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                            <div className="text-2xl font-bold text-dark">{stat.value}</div>
                          </div>
                        ))}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}

            {/* Process Context Cards for Option Questions */}
            {currentScenario.answerType === 'option' && currentScenario.processes && (
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {currentScenario.processes.map((process, index) => {
                  const stats = formatProcessStats(process)

                  return (
                    <motion.div
                      key={process.id}
                      initial={{ y: 50, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                      className="p-6 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 shadow-inner"
                    >
                      <div className={`w-14 h-14 ${process.color} rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                        {process.id}
                      </div>
                      <div className="space-y-3 text-center">
                        {stats.map(stat => (
                          <div key={`${process.id}-context-${stat.label}`}>
                            <div className="text-xs uppercase tracking-wide text-gray-500">{stat.label}</div>
                            <div className="text-lg font-semibold text-gray-800">{stat.value}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Multiple Choice Options */}
            {currentScenario.answerType === 'option' && currentScenario.options && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {currentScenario.options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ y: 50, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: feedback ? 1 : 1.05, y: feedback ? 0 : -5 }}
                    whileTap={{ scale: feedback ? 1 : 0.95 }}
                    onClick={() => handleAnswer(option.id)}
                    disabled={feedback !== null}
                    className={`p-6 rounded-2xl border-4 text-left transition-all ${
                      feedback === 'correct' && option.id === currentScenario.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : feedback === 'wrong' && option.id === currentScenario.correctAnswer
                        ? 'border-green-300 bg-green-50/70'
                        : 'border-purple-300 hover:border-purple-500 bg-white hover:shadow-xl'
                    }`}
                  >
                    <div className="text-sm font-semibold text-purple-500 uppercase tracking-wide mb-2">
                      Option {option.id}
                    </div>
                    <div className="text-xl font-bold text-dark">
                      {option.label}
                    </div>
                    {option.description && (
                      <p className="text-sm text-gray-500 mt-3 leading-snug">
                        {option.description}
                      </p>
                    )}
                  </motion.button>
                ))}
              </div>
            )}

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
                  {explanation && (
                    <p className="mt-4 text-lg text-green-700 text-center leading-relaxed">
                      {explanation}
                    </p>
                  )}
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
