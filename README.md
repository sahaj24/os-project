# 🎮 You Are the CPU

A futuristic CPU scheduling simulation game built with Next.js, React, and Tailwind CSS.

## 🎯 Game Concept

Take control as the CPU scheduler and manage processes to achieve the lowest average waiting time. Each process has:
- **Process ID** (P1, P2, P3...)
- **Arrival Time** (when the process enters the system)
- **Burst Time** (how long it needs to execute)
- **Priority** (lower number = higher priority)

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🕹️ How to Play

1. **Choose a difficulty level** (Easy or Medium)
2. **Watch the clock** - Processes arrive at different times
3. **Select processes to execute** - Click on available processes to run them
4. **Optimize your scheduling** - Try to minimize waiting time
5. **View your results** - See your performance metrics and score

## 🏆 Scoring System

- **Average Waiting Time ≤ 3:** +5 points
- **All processes completed:** +3 points  
- **Average Waiting Time ≤ 2:** +2 points (Optimal!)

## 🎨 Features

- ✨ Futuristic, light-toned UI with neon accents
- 🌊 Smooth animations using Framer Motion
- 📊 Real-time process visualization
- 📈 Performance metrics and scoring
- 🎯 Multiple difficulty levels
- 📱 Responsive design

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 📝 Game Modes

### Easy Mode
- 3 processes with varying arrival times
- Perfect for learning the basics

### Medium Mode
- 4 processes with more complex scheduling
- Tests your optimization skills

## 🎓 Learn CPU Scheduling

This game teaches fundamental CPU scheduling concepts:
- **FCFS** (First Come First Serve)
- **SJF** (Shortest Job First)
- **Priority Scheduling**
- **Round Robin concepts**

Experiment with different strategies to find the optimal scheduling algorithm!

## 📦 Build for Production

```bash
npm run build
npm start
```

## 📄 License

MIT License - Feel free to use this for educational purposes!

---

Made with 💙 for learning CPU scheduling algorithms
