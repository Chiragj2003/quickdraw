# ⚡ Quick Draw Challenge ⚡

An interactive drawing game where you race against time and AI! Draw objects as fast as you can while our AI tries to recognize what you're drawing in real-time.

![Quick Draw Challenge](https://img.shields.io/badge/Game-Quick%20Draw-blueviolet)
![React](https://img.shields.io/badge/React-18.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.5-blue)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-AI%20Powered-orange)

## 🎮 Features

- **⏱️ Time-Based Challenge**: 20 seconds per drawing
- **🤖 AI Recognition**: Real-time drawing analysis using TensorFlow.js and MobileNet
- **🎯 5 Exciting Rounds**: Different prompts each round
- **🏆 Scoring System**: Points based on accuracy and speed
- **📊 Leaderboard**: Track high scores locally
- **🎨 Smooth Drawing**: Touch and mouse support
- **📱 Responsive Design**: Play on desktop, tablet, or mobile
- **✨ Beautiful UI**: Modern gradient design with smooth animations

## 🚀 How to Play

1. **Enter Your Name** (optional) on the start screen
2. **Click "Start Game"** to begin
3. **Read the Prompt** (e.g., "dog", "bicycle", "house")
4. **Draw Quickly!** You have 20 seconds per round
5. **Watch AI Predictions** appear in real-time as you draw
6. **Score Points** when AI recognizes your drawing correctly
7. **Complete 5 Rounds** and see your final score
8. **Beat High Scores** and climb the leaderboard!

## 🎯 Scoring

- **Base Score**: 100 points for correct recognition
- **Time Bonus**: 10 points per second remaining (faster = more points!)
- **Final Score**: Sum of all rounds

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd quickdraw
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📦 Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## 🧩 Project Structure

```
quickdraw/
├── src/
│   ├── components/
│   │   ├── GameCanvas.tsx      # Drawing canvas component
│   │   ├── GameScreen.tsx      # Main game screen
│   │   ├── StartScreen.tsx     # Welcome/start screen
│   │   ├── ResultScreen.tsx    # Results and score display
│   │   └── Leaderboard.tsx     # High scores display
│   ├── hooks/
│   │   ├── useDrawing.ts       # Drawing logic hook
│   │   ├── useGameLogic.ts     # Game state management
│   │   └── useImageRecognition.ts  # AI recognition hook
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── styles/
│   │   └── game.css            # Game styling
│   ├── App.tsx                 # Main app component
│   └── index.tsx               # Entry point
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🤖 AI Technology

This game uses:
- **TensorFlow.js**: Machine learning in the browser
- **MobileNet**: Pre-trained image classification model
- Real-time drawing analysis and object recognition

## 🎨 Drawing Prompts

The game includes 20+ diverse prompts across categories:
- 🐾 **Animals**: dog, cat, bird
- 🚗 **Vehicles**: car, bicycle, airplane
- 🏠 **Buildings**: house
- 🌳 **Nature**: tree, flower, sun
- 🍕 **Food**: pizza, banana, apple
- 📚 **Objects**: book, clock, umbrella, shoe
- 🎸 **Instruments**: guitar
- 💻 **Technology**: computer, telephone

## 🏆 Features Coming Soon

- [ ] Multiplayer mode
- [ ] Custom prompts
- [ ] Difficulty levels
- [ ] Save/share drawings
- [ ] Global leaderboard
- [ ] More AI models for better recognition
- [ ] Audio feedback
- [ ] Achievement system

## 🛠️ Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **TensorFlow.js**: Machine learning
- **MobileNet**: Image recognition model
- **HTML5 Canvas**: Drawing functionality
- **CSS3**: Modern styling and animations
- **LocalStorage**: Save high scores

## 🐛 Known Issues

- AI recognition may be less accurate for abstract drawings
- Model loading takes a few seconds on first launch
- Best experience on modern browsers (Chrome, Firefox, Safari)

## 📝 License

MIT License - feel free to use this project for learning or building your own games!

## 👨‍💻 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 🙏 Acknowledgments

- Inspired by Google's Quick, Draw! game
- TensorFlow.js and MobileNet for making browser-based ML accessible
- React and Vite communities for excellent tools

## 📧 Contact

Questions? Suggestions? Feel free to open an issue or reach out!

---

Made with ❤️ and ⚡ by [Your Name]

**Have fun drawing! 🎨**

## Project Overview
The Quickdraw project is a drawing application built with React and TypeScript. It allows users to create and manipulate drawings on a canvas, providing an interactive and user-friendly experience.

# Quick Draw Challenge

Quick Draw Challenge — a React + TypeScript drawing game inspired by Google's Quick, Draw!.

Project summary:

- Timed drawing rounds (20 seconds per prompt)
- Real-time AI recognition using TensorFlow.js + MobileNet
- Scoring based on speed and correctness, with time bonuses
- Local leaderboard (saved to localStorage)
- Responsive UI with touch + mouse drawing support

Quick start (from inside the `quickdraw/` folder):

1. npm install
2. npm run dev

Open http://localhost:5173 in your browser (Vite port may vary).

How to play:

1. Click Start and optionally enter your name.
2. You will get a text prompt (e.g., "cat", "bicycle").
3. Draw the prompt within 20 seconds. The AI will periodically try to recognise your sketch.
4. If AI recognises the target, you score points (faster = more points). Complete the configured number of rounds and view your final score.

Development notes:

- The game uses MobileNet for quick image classification via `@tensorflow-models/mobilenet` and `@tensorflow/tfjs`.
- Prompts and scoring logic are in `src/hooks/useGameLogic.ts`.
- The canvas and drawing UI are in `src/components/GameCanvas.tsx` and `src/hooks/useDrawing.ts`.

Want multiplayer? We can add a realtime backend (WebSocket or Firebase) to host rooms and sync canvases.

```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd quickdraw
   ```
2. Install dependencies:
   ```
   npm install
   ```

## Usage
To start the development server, run:
```
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.