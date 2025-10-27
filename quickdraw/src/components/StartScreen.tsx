import React, { useState } from 'react';

interface StartScreenProps {
    onStart: (playerName: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    const [name, setName] = useState('');

    const handleStart = () => {
        const playerName = name.trim() || 'Player';
        onStart(playerName);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleStart();
        }
    };

    return (
        <div className="start-screen">
            <div className="start-content">
                <h1 className="game-title">⚡ Quick Draw Challenge ⚡</h1>
                <p className="game-subtitle">Can you draw faster than AI can recognize?</p>
                
                <div className="game-info">
                    <div className="info-card">
                        <span className="info-icon">⏱️</span>
                        <h3>20 Seconds</h3>
                        <p>Per drawing</p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon">🎨</span>
                        <h3>5 Rounds</h3>
                        <p>Different prompts</p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon">🤖</span>
                        <h3>AI Recognition</h3>
                        <p>Real-time analysis</p>
                    </div>
                </div>

                <div className="how-to-play">
                    <h2>How to Play:</h2>
                    <ol>
                        <li>You'll get a prompt (e.g., "cat", "bicycle")</li>
                        <li>Draw it as fast as you can!</li>
                        <li>AI will try to recognize your drawing</li>
                        <li>Faster = More points!</li>
                        <li>Complete 5 rounds and check your score</li>
                    </ol>
                </div>

                <div className="name-input-container">
                    <input
                        type="text"
                        placeholder="Enter your name (optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        maxLength={20}
                        className="name-input"
                    />
                </div>

                <button className="start-btn" onClick={handleStart}>
                    Start Game
                </button>
            </div>
        </div>
    );
};

export default StartScreen;
