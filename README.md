# 🎨 Quick Draw Challenge

An AI-powered drawing game built with React + TypeScript, where you race against time to draw prompts while artificial intelligence tries to recognize your artwork in real-time!

This project showcases modern web development with Vite, React 18, TensorFlow.js, and real-time AI image classification.

## 🚀 Features

- **AI-Powered Recognition**: Uses TensorFlow.js + MobileNet for real-time drawing classification
- **Interactive Canvas**: Smooth drawing with mouse and touch support
- **Timed Gameplay**: 5 rounds, 20 seconds each - can you beat the clock?
- **Smart Scoring**: Base points + time bonus rewards (max 300 points per round)
- **Leaderboard**: Top 10 scores saved to localStorage
- **Fast AI Analysis**: Checks your drawing every second with fuzzy matching
- **Responsive Design**: Works on desktop and mobile devices
- **Well-Documented**: Comprehensive code comments for easy learning

## 🎮 How to Play

1. Enter your name and start the game
2. Draw the prompted object (e.g., "dog", "car", "tree")
3. The AI analyzes your drawing every second
4. Match the prompt before time runs out to score points!
5. Complete 5 rounds and check the leaderboard

**Pro Tip**: Draw recognizable features - the AI is trained on real photos, so adding details helps!

## 💻 Quick Start (Local Development)

```bash
# Navigate to the project folder
cd quickdraw

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite 4** - Lightning-fast build tool
- **TensorFlow.js 4.22** - Machine learning in the browser
- **MobileNet 2.1** - Pre-trained image classification model
- **HTML5 Canvas** - Drawing interface
- **CSS3** - Styling and animations

## 🌐 Deploy to Vercel

This project is optimized for one-click deployment on Vercel.

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"New Project"** and import your `quickdraw` repository
4. Vercel auto-detects settings from `vercel.json` ✨
5. Click **"Deploy"** and you're live!

Your game will be deployed at: `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from repository root
vercel
```

Follow the interactive prompts to complete deployment.

### ⚙️ Build Configuration

The project uses these settings (configured in `vercel.json`):
- **Build Command**: `cd quickdraw && npm install && npm run build`
- **Output Directory**: `quickdraw/dist`
- **Framework**: Vite
- **Node Version**: 18.x

## 📁 Project Structure

```
quickdraw/
├── src/
│   ├── components/      # React components (Canvas, Game screens)
│   ├── hooks/           # Custom hooks (game logic, AI, drawing)
│   ├── styles/          # CSS files
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main application component
├── public/              # Static assets
├── vercel.json          # Vercel deployment config
└── package.json         # Dependencies and scripts
```

## 🧠 How It Works

1. **Drawing**: HTML5 Canvas captures mouse/touch input as base64 PNG
2. **AI Analysis**: TensorFlow.js loads MobileNet (~13MB) to classify images
3. **Real-time Recognition**: Analyzes drawing every 1 second
4. **Fuzzy Matching**: Uses 4 matching strategies (exact, plural, substring, word-by-word)
5. **Scoring**: `baseScore (100) + (timeRemaining × 10)` = up to 300 points per round

## 📝 Code Documentation

All code is thoroughly documented with:
- File-level overviews explaining purpose
- JSDoc comments for functions and parameters
- Inline explanations for complex logic
- Architecture notes on component interactions

Perfect for learning React, TypeScript, and TensorFlow.js!

## 🎯 Game Features

- **5 Rounds**: Draw different prompts each round
- **20 Second Timer**: Visual countdown with color-coded urgency
- **Live Predictions**: See AI's top 3 guesses in real-time
- **Skip Option**: Can't draw it? Skip and move on
- **Time Bonus**: Faster correct answers = more points
- **Persistent Leaderboard**: Your high scores are saved locally

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or suggest features via GitHub Issues
- Submit pull requests with improvements
- Fork the project for your own experiments

## 📄 License

This project is open source and available under the MIT License.

## 🎨 Future Ideas

- Multiplayer mode with WebSocket/Firebase
- Custom prompt lists
- Difficulty levels (easy/medium/hard)
- Drawing replay animation
- Social sharing of drawings
- More AI models (specialized for sketches)

---

**Built with ❤️ using React, TypeScript, and TensorFlow.js**

*Play, draw, and let the AI guess your creativity!* 🎨🤖
