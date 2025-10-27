import React from 'react';
import { GameScore } from '../types';

interface LeaderboardProps {
    highScores: GameScore[];
    onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ highScores, onBack }) => {
    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    };

    return (
        <div className="leaderboard-screen">
            <div className="leaderboard-content">
                <h1 className="leaderboard-title">🏆 Leaderboard 🏆</h1>
                
                {highScores.length === 0 ? (
                    <div className="empty-leaderboard">
                        <p>No scores yet. Be the first to play!</p>
                    </div>
                ) : (
                    <div className="scores-table">
                        <div className="table-header">
                            <span className="col-rank">Rank</span>
                            <span className="col-player">Player</span>
                            <span className="col-score">Score</span>
                            <span className="col-accuracy">Accuracy</span>
                        </div>
                        {highScores.map((score, idx) => (
                            <div key={idx} className={`score-row ${idx < 3 ? 'top-three' : ''}`}>
                                <span className="col-rank">
                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                                </span>
                                <span className="col-player">{score.playerName}</span>
                                <span className="col-score">{score.score}</span>
                                <span className="col-accuracy">{score.accuracy.toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                )}

                <button className="back-btn" onClick={onBack}>
                    Back to Menu
                </button>
            </div>
        </div>
    );
};

export default Leaderboard;
