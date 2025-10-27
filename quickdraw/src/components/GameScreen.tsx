/**
 * GameScreen Component
 * 
 * The main gameplay interface where players draw in response to prompts.
 * 
 * Features:
 * - Real-time AI analysis (checks every 1 second)
 * - Live predictions display (top 3 matches)
 * - Visual timer with color-coded urgency
 * - Round progression tracking
 * - Drawing canvas with clear functionality
 * 
 * The AI continuously analyzes the drawing and automatically completes
 * the round when it detects a match with the target prompt.
 */

import React, { useState, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import { Prediction } from '../types';

interface GameScreenProps {
    prompt: string;                      // Target item to draw (e.g., "dog")
    timeRemaining: number;               // Seconds left in round
    score: number;                       // Current total score
    roundNumber: number;                 // Current round (1-5)
    totalRounds: number;                 // Total rounds (5)
    onDrawingComplete: (imageData: string, predictions: Prediction[]) => void;
    onSkip: () => void;                  // Skip current round
    classifyDrawing: (imageData: string) => Promise<Prediction[]>;  // AI function
    isModelLoading: boolean;             // true while loading TensorFlow model
}

const GameScreen: React.FC<GameScreenProps> = ({
    prompt,
    timeRemaining,
    score,
    roundNumber,
    totalRounds,
    onDrawingComplete,
    onSkip,
    classifyDrawing,
    isModelLoading
}) => {
    // Current drawing as base64 PNG
    const [currentDrawing, setCurrentDrawing] = useState<string>('');
    
    // AI predictions for current drawing
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    
    // Prevent multiple simultaneous AI analyses
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // Track last analysis to enforce 1-second interval
    const [lastAnalysisTime, setLastAnalysisTime] = useState(0);

    /**
     * Continuous AI Analysis Loop
     * 
     * Runs every time the drawing updates, but throttled to max 1 check per second.
     * When the AI detects a match, it automatically completes the round.
     * 
     * Throttling prevents excessive API calls and improves performance.
     */
    useEffect(() => {
        const analyze = async () => {
            const now = Date.now();
            
            // Only analyze if:
            // 1. There's a drawing
            // 2. Not currently analyzing
            // 3. At least 1 second has passed since last analysis
            if (currentDrawing && !isAnalyzing && now - lastAnalysisTime > 1000) {
                setIsAnalyzing(true);
                setLastAnalysisTime(now);
                
                // Get AI predictions
                const preds = await classifyDrawing(currentDrawing);
                setPredictions(preds);
                setIsAnalyzing(false);

                // Check if any prediction matches the target prompt
                // Uses simple substring matching (more lenient for drawings)
                const matched = preds.some(p => 
                    p.className.toLowerCase().includes(prompt.toLowerCase()) ||
                    prompt.toLowerCase().includes(p.className.toLowerCase())
                );

                if (matched) {
                    // Success! Complete the round
                    onDrawingComplete(currentDrawing, preds);
                }
            }
        };

        analyze();
    }, [currentDrawing, isAnalyzing, lastAnalysisTime, classifyDrawing, prompt, onDrawingComplete]);

    /**
     * Called by GameCanvas whenever the drawing changes
     * Updates the currentDrawing state which triggers AI analysis
     */
    const handleDrawingUpdate = (imageData: string) => {
        setCurrentDrawing(imageData);
    };

    /**
     * Clear the canvas and reset predictions
     */
    const handleClear = () => {
        setCurrentDrawing('');
        setPredictions([]);
    };

    /**
     * Dynamic timer color based on remaining time
     * 
     * - Green (>15s): Plenty of time
     * - Orange (6-15s): Getting urgent
     * - Red (<=5s): Critical!
     */
    const getTimerColor = () => {
        if (timeRemaining > 15) return '#4caf50';  // Green
        if (timeRemaining > 5) return '#ff9800';   // Orange
        return '#f44336';                           // Red
    };

    return (
        <div className="game-screen">
            {/* Header: Score, Round, Timer */}
            <div className="game-header">
                <div className="score-display">
                    <span className="score-label">Score:</span>
                    <span className="score-value">{score}</span>
                </div>
                <div className="round-display">
                    Round {roundNumber} / {totalRounds}
                </div>
                <div className="timer" style={{ color: getTimerColor() }}>
                    ⏱️ {timeRemaining}s
                </div>
            </div>

            {/* Prompt Display */}
            <div className="prompt-display">
                <h2 className="prompt-label">Draw this:</h2>
                <h1 className="prompt-text">{prompt.toUpperCase()}</h1>
            </div>

            {/* Show loading spinner while TensorFlow model downloads */}
            {isModelLoading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading AI model...</p>
                </div>
            ) : (
                <>
                    {/* Drawing Canvas */}
                    <GameCanvas 
                        onDrawingComplete={handleDrawingUpdate}
                        isActive={true}
                        onClear={handleClear}
                    />

                    {/* AI Predictions Panel */}
                    <div className="predictions-panel">
                        <h3>AI Thinks It's:</h3>
                        {isAnalyzing ? (
                            <p className="analyzing">Analyzing... 🤔</p>
                        ) : predictions.length > 0 ? (
                            <>
                                {/* Show top 3 predictions */}
                                <ul className="predictions-list">
                                    {predictions.slice(0, 3).map((pred, idx) => (
                                        <li key={idx} className="prediction-item">
                                            <span className="prediction-name">{pred.className}</span>
                                            <span className="prediction-confidence">
                                                {(pred.probability * 100).toFixed(1)}%
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="hint-text">
                                    💡 Tip: Draw more details to help the AI recognize "{prompt}"
                                </p>
                            </>
                        ) : (
                            <p className="no-predictions">Start drawing! The AI checks every second.</p>
                        )}
                    </div>

                    {/* Skip Button */}
                    <button className="skip-btn" onClick={onSkip}>
                        Skip Round
                    </button>
                </>
            )}
        </div>
    );
};

export default GameScreen;
