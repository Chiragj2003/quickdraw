# quickdraw

Quick Draw Challenge — a small React + TypeScript drawing game inspired by Google's Quick, Draw!.

This repository contains a Vite + React project in the `quickdraw/` folder that implements a timed drawing game where users have 20 seconds to draw prompts while a small AI (TensorFlow.js + MobileNet) attempts to recognise their sketch in real time.

What I added in this branch:

- A game canvas component with touch + mouse drawing support
- Game flow (start screen, timed rounds, scoring, result screen, leaderboard saved to localStorage)
- A simple TensorFlow.js integration using MobileNet for quick image classification
- Styles and basic responsiveness

Quick start (within the project folder):

1. cd quickdraw
2. npm install
3. npm run dev

Open http://localhost:5173 in your browser (Vite port may vary).

Notes:

- The AI uses MobileNet (image classifier) and will try to guess what it sees in the canvas snapshot; results are heuristic and depend on how recognizable the sketch is to MobileNet.
- This is a single-player demo. If you want multiplayer, we can add WebSocket / Firebase realtime later.

If you want me to merge this into the remote `main` branch I will pull remote changes, resolve any simple conflicts, and push the merged result.
