/**
 * Quick Draw Challenge - Main Application Component
 * 
 * This is the root component that orchestrates the entire game flow.
 * 
 * Game Flow:
 * 1. StartScreen - Player enters name and sees instructions
 * 2. GameScreen - Player draws prompts while AI analyzes in real-time
 * 3. ResultScreen - Shows final score, accuracy, and round-by-round results
 * 4. Leaderboard - Displays top 10 scores from localStorage
 * 
 * The app uses two custom hooks:
 * - useGameLogic: Manages game state, scoring, and progression
 * - useImageRecognition: Handles TensorFlow.js AI model and predictions
 */

import React, { useState } from 'react';
import './styles/game.css';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import Leaderboard from './components/Leaderboard';
import { useGameLogic } from './hooks/useGameLogic';
import { useImageRecognition } from './hooks/useImageRecognition';
import { Prediction } from './types';

const App: React.FC = () => {
    // Track whether to show leaderboard (separate from main game state)
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    
    // Game state management hook
    const {
        gameState,          // Current screen: 'start' | 'playing' | 'result'
        currentPrompt,      // Current drawing prompt (e.g., "dog", "car")
        timeRemaining,      // Seconds left in current round
        score,              // Total points accumulated
        roundNumber,        // Current round number (1-5)
        totalRounds,        // Total rounds per game (5)
        roundResults,       // Results from completed rounds
        playerName,         // Player's display name
        highScores,         // Top 10 scores from localStorage
        startGame,          // Start a new game
        handleRoundEnd,     // Complete the current round
        resetGame,          // Return to start screen
        skipRound           // Skip current round
    } = useGameLogic();

    // AI recognition hook (TensorFlow.js + MobileNet)
    const {
        isLoading: isModelLoading,  // true while downloading AI model
        error: modelError,           // Error message if model fails to load
        classifyDrawing,             // Function to classify a drawing
        checkMatch                   // Function to check if prediction matches prompt
    } = useImageRecognition();

    /**
     * Handle when player completes a drawing
     * Called by GameScreen when AI detects a match or time runs out
     * 
     * @param imageData - Base64 PNG of the drawing
     * @param predictions - AI predictions for the drawing
     */
    const handleDrawingComplete = async (imageData: string, predictions: Prediction[]) => {
        if (!currentPrompt) return;

        // Check if any prediction matches the target prompt
        const { matched, confidence } = checkMatch(predictions, currentPrompt.text);
        
        if (matched) {
            // Success! End round with correct result
            handleRoundEnd(true, predictions, imageData);
        }
    };

    /**
     * Navigate from ResultScreen to Leaderboard
     */
    const handleViewLeaderboard = () => {
        setShowLeaderboard(true);
    };

    /**
     * Return from Leaderboard to StartScreen
     */
    const handleBackFromLeaderboard = () => {
        setShowLeaderboard(false);
        resetGame();
    };

    // Error screen if AI model fails to load
    if (modelError) {
        return (
            <div className="app error-screen">
                <div className="error-content">
                    <h1>⚠️ Error</h1>
                    <p>{modelError}</p>
                    <button onClick={() => window.location.reload()}>
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    // Leaderboard view (separate from main game flow)
    if (showLeaderboard) {
        return (
            <div className="app">
                <Leaderboard 
                    highScores={highScores}
                    onBack={handleBackFromLeaderboard}
                />
            </div>
        );
    }

    // Main game flow
    return (
        <div className="app">
            {/* Start Screen - Initial welcome and name entry */}
            {gameState === 'start' && (
                <StartScreen onStart={startGame} />
            )}

            {/* Game Screen - Active gameplay with drawing canvas */}
            {gameState === 'playing' && currentPrompt && (
                <GameScreen
                    prompt={currentPrompt.text}
                    timeRemaining={timeRemaining}
                    score={score}
                    roundNumber={roundNumber}
                    totalRounds={totalRounds}
                    onDrawingComplete={handleDrawingComplete}
                    onSkip={skipRound}
                    classifyDrawing={classifyDrawing}
                    isModelLoading={isModelLoading}
                />
            )}

            {/* Result Screen - Final score and round summary */}
            {gameState === 'result' && (
                <ResultScreen
                    playerName={playerName}
                    totalScore={score}
                    roundResults={roundResults}
                    highScores={highScores}
                    onPlayAgain={resetGame}
                    onViewLeaderboard={handleViewLeaderboard}
                />
            )}
        </div>
    );
};

export default App;