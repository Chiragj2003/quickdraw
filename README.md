# quickdraw

Quick Draw Challenge — a small React + TypeScript drawing game inspired by Google's Quick, Draw!.

This repository contains a Vite + React project in the `quickdraw/` folder that implements a timed drawing game where users have 20 seconds to draw prompts while a small AI (TensorFlow.js + MobileNet) attempts to recognise their sketch in real time.

## Features

- A game canvas component with touch + mouse drawing support
- Game flow (start screen, timed rounds, scoring, result screen, leaderboard saved to localStorage)
- A simple TensorFlow.js integration using MobileNet for quick image classification
- Styles and basic responsiveness

## Quick start (local development)

From inside the project folder:

```bash
cd quickdraw
npm install
npm run dev
```

Open http://localhost:5173 in your browser (Vite port may vary).

## Deploy to Vercel

This project is configured for easy deployment to Vercel.

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy.

### Build Configuration

The project uses:
- Build command: `cd quickdraw && npm install && npm run build`
- Output directory: `quickdraw/dist`
- Framework: Vite

All configuration is in `vercel.json` at the repository root.

## Notes

- The AI uses MobileNet (image classifier) and will try to guess what it sees in the canvas snapshot; results are heuristic and depend on how recognizable the sketch is to MobileNet.
- This is a single-player demo. If you want multiplayer, we can add WebSocket / Firebase realtime later.

If you want me to merge this into the remote `main` branch I will pull remote changes, resolve any simple conflicts, and push the merged result.
