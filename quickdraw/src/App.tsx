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
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    
    const {
        gameState,
        currentPrompt,
        timeRemaining,
        score,
        roundNumber,
        totalRounds,
        roundResults,
        playerName,
        highScores,
        startGame,
        handleRoundEnd,
        resetGame,
        skipRound
    } = useGameLogic();

    const {
        isLoading: isModelLoading,
        error: modelError,
        classifyDrawing,
        checkMatch
    } = useImageRecognition();

    const handleDrawingComplete = async (imageData: string, predictions: Prediction[]) => {
        if (!currentPrompt) return;

        const { matched, confidence } = checkMatch(predictions, currentPrompt.text);
        
        if (matched) {
            handleRoundEnd(true, predictions, imageData);
        }
    };

    const handleViewLeaderboard = () => {
        setShowLeaderboard(true);
    };

    const handleBackFromLeaderboard = () => {
        setShowLeaderboard(false);
        resetGame();
    };

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

    return (
        <div className="app">
            {gameState === 'start' && (
                <StartScreen onStart={startGame} />
            )}

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