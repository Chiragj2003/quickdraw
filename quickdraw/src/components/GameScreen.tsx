import React, { useState, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import { Prediction } from '../types';

interface GameScreenProps {
    prompt: string;
    timeRemaining: number;
    score: number;
    roundNumber: number;
    totalRounds: number;
    onDrawingComplete: (imageData: string, predictions: Prediction[]) => void;
    onSkip: () => void;
    classifyDrawing: (imageData: string) => Promise<Prediction[]>;
    isModelLoading: boolean;
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
    const [currentDrawing, setCurrentDrawing] = useState<string>('');
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [lastAnalysisTime, setLastAnalysisTime] = useState(0);

    // Analyze drawing periodically (every 1 second for faster recognition)
    useEffect(() => {
        const analyze = async () => {
            const now = Date.now();
            if (currentDrawing && !isAnalyzing && now - lastAnalysisTime > 1000) {
                setIsAnalyzing(true);
                setLastAnalysisTime(now);
                const preds = await classifyDrawing(currentDrawing);
                setPredictions(preds);
                setIsAnalyzing(false);

                // Check if any prediction matches the prompt
                const matched = preds.some(p => 
                    p.className.toLowerCase().includes(prompt.toLowerCase()) ||
                    prompt.toLowerCase().includes(p.className.toLowerCase())
                );

                if (matched) {
                    onDrawingComplete(currentDrawing, preds);
                }
            }
        };

        analyze();
    }, [currentDrawing, isAnalyzing, lastAnalysisTime, classifyDrawing, prompt, onDrawingComplete]);

    const handleDrawingUpdate = (imageData: string) => {
        setCurrentDrawing(imageData);
    };

    const handleClear = () => {
        setCurrentDrawing('');
        setPredictions([]);
    };

    const getTimerColor = () => {
        if (timeRemaining > 15) return '#4caf50';
        if (timeRemaining > 5) return '#ff9800';
        return '#f44336';
    };

    return (
        <div className="game-screen">
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

            <div className="prompt-display">
                <h2 className="prompt-label">Draw this:</h2>
                <h1 className="prompt-text">{prompt.toUpperCase()}</h1>
            </div>

            {isModelLoading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading AI model...</p>
                </div>
            ) : (
                <>
                    <GameCanvas 
                        onDrawingComplete={handleDrawingUpdate}
                        isActive={true}
                        onClear={handleClear}
                    />

                    <div className="predictions-panel">
                        <h3>AI Thinks It's:</h3>
                        {isAnalyzing ? (
                            <p className="analyzing">Analyzing... 🤔</p>
                        ) : predictions.length > 0 ? (
                            <>
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

                    <button className="skip-btn" onClick={onSkip}>
                        Skip Round
                    </button>
                </>
            )}
        </div>
    );
};

export default GameScreen;
