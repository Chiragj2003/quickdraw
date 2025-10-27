import React from 'react';
import { RoundResult, GameScore } from '../types';

interface ResultScreenProps {
    playerName: string;
    totalScore: number;
    roundResults: RoundResult[];
    highScores: GameScore[];
    onPlayAgain: () => void;
    onViewLeaderboard: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
    playerName,
    totalScore,
    roundResults,
    highScores,
    onPlayAgain,
    onViewLeaderboard
}) => {
    const correctRounds = roundResults.filter(r => r.correct).length;
    const totalRounds = roundResults.length;
    const accuracy = ((correctRounds / totalRounds) * 100).toFixed(1);
    const averageTime = (roundResults.reduce((sum, r) => sum + r.timeUsed, 0) / totalRounds).toFixed(1);

    const isHighScore = highScores.length === 0 || totalScore > highScores[highScores.length - 1].score;

    return (
        <div className="result-screen">
            <div className="result-content">
                {isHighScore && <div className="confetti">🎉</div>}
                
                <h1 className="result-title">
                    {correctRounds === totalRounds ? '🏆 Perfect Score! 🏆' : 
                     correctRounds >= totalRounds * 0.6 ? '⭐ Great Job! ⭐' : 
                     '👍 Good Try! 👍'}
                </h1>

                <div className="player-result">
                    <h2>{playerName}</h2>
                    <div className="final-score">
                        <span className="score-label">Final Score</span>
                        <span className="score-value">{totalScore}</span>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-icon">✅</span>
                        <span className="stat-value">{correctRounds}/{totalRounds}</span>
                        <span className="stat-label">Correct</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🎯</span>
                        <span className="stat-value">{accuracy}%</span>
                        <span className="stat-label">Accuracy</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">⚡</span>
                        <span className="stat-value">{averageTime}s</span>
                        <span className="stat-label">Avg Time</span>
                    </div>
                </div>

                <div className="round-review">
                    <h3>Round Summary</h3>
                    <div className="rounds-list">
                        {roundResults.map((result, idx) => (
                            <div key={idx} className={`round-item ${result.correct ? 'correct' : 'incorrect'}`}>
                                <div className="round-info">
                                    <span className="round-number">Round {idx + 1}</span>
                                    <span className="round-prompt">{result.prompt}</span>
                                </div>
                                <div className="round-result-info">
                                    {result.correct ? (
                                        <>
                                            <span className="result-icon">✅</span>
                                            <span className="result-score">+{result.score}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="result-icon">❌</span>
                                            <span className="result-text">
                                                AI saw: {result.predictions[0]?.className || 'nothing'}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {isHighScore && (
                    <div className="high-score-banner">
                        🌟 New High Score! 🌟
                    </div>
                )}

                <div className="result-actions">
                    <button className="play-again-btn" onClick={onPlayAgain}>
                        Play Again
                    </button>
                    <button className="leaderboard-btn" onClick={onViewLeaderboard}>
                        View Leaderboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultScreen;
