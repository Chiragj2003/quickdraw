import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Prompt, GameScore, RoundResult, Prediction } from '../types';

// Predefined prompts for the game
const PROMPTS: Prompt[] = [
    { id: 1, text: 'dog', category: 'animal' },
    { id: 2, text: 'cat', category: 'animal' },
    { id: 3, text: 'bicycle', category: 'vehicle' },
    { id: 4, text: 'car', category: 'vehicle' },
    { id: 5, text: 'airplane', category: 'vehicle' },
    { id: 6, text: 'house', category: 'building' },
    { id: 7, text: 'tree', category: 'nature' },
    { id: 8, text: 'flower', category: 'nature' },
    { id: 9, text: 'sun', category: 'nature' },
    { id: 10, text: 'banana', category: 'food' },
    { id: 11, text: 'apple', category: 'food' },
    { id: 12, text: 'pizza', category: 'food' },
    { id: 13, text: 'book', category: 'object' },
    { id: 14, text: 'clock', category: 'object' },
    { id: 15, text: 'umbrella', category: 'object' },
    { id: 16, text: 'shoe', category: 'object' },
    { id: 17, text: 'guitar', category: 'instrument' },
    { id: 18, text: 'computer', category: 'technology' },
    { id: 19, text: 'telephone', category: 'technology' },
    { id: 20, text: 'bird', category: 'animal' }
];

const TIME_LIMIT = 20; // seconds per round
const POINTS_PER_CORRECT = 100;
const TIME_BONUS_MULTIPLIER = 10;

export const useGameLogic = () => {
    const [gameState, setGameState] = useState<GameState>('start');
    const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT);
    const [score, setScore] = useState(0);
    const [roundNumber, setRoundNumber] = useState(0);
    const [totalRounds] = useState(5);
    const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
    const [playerName, setPlayerName] = useState('Player');
    const [highScores, setHighScores] = useState<GameScore[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Load high scores from localStorage
    useEffect(() => {
        const savedScores = localStorage.getItem('quickdraw-highscores');
        if (savedScores) {
            setHighScores(JSON.parse(savedScores));
        }
    }, []);

    // Timer logic
    useEffect(() => {
        if (gameState === 'playing' && timeRemaining > 0) {
            timerRef.current = setTimeout(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0 && gameState === 'playing') {
            // Time's up for this round
            handleRoundEnd(false, [], '');
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [gameState, timeRemaining]);

    const getRandomPrompt = useCallback((): Prompt => {
        const availablePrompts = PROMPTS.filter(
            p => !roundResults.some(r => r.prompt === p.text)
        );
        const prompts = availablePrompts.length > 0 ? availablePrompts : PROMPTS;
        return prompts[Math.floor(Math.random() * prompts.length)];
    }, [roundResults]);

    const startGame = useCallback((name?: string) => {
        if (name) {
            setPlayerName(name);
        }
        setGameState('playing');
        setScore(0);
        setRoundNumber(1);
        setRoundResults([]);
        setTimeRemaining(TIME_LIMIT);
        setCurrentPrompt(getRandomPrompt());
    }, [getRandomPrompt]);

    const handleRoundEnd = useCallback((
        correct: boolean,
        predictions: Prediction[],
        imageData: string
    ) => {
        if (!currentPrompt) return;

        const timeUsed = TIME_LIMIT - timeRemaining;
        let roundScore = 0;

        if (correct) {
            // Base score + time bonus
            roundScore = POINTS_PER_CORRECT + (timeRemaining * TIME_BONUS_MULTIPLIER);
            setScore(prev => prev + roundScore);
        }

        const result: RoundResult = {
            prompt: currentPrompt.text,
            userDrawing: imageData,
            predictions,
            correct,
            timeUsed,
            score: roundScore
        };

        setRoundResults(prev => [...prev, result]);

        // Check if game is over
        if (roundNumber >= totalRounds) {
            // Game over
            setTimeout(() => {
                setGameState('result');
                saveHighScore();
            }, 1500);
        } else {
            // Next round
            setTimeout(() => {
                setRoundNumber(prev => prev + 1);
                setTimeRemaining(TIME_LIMIT);
                setCurrentPrompt(getRandomPrompt());
            }, 1500);
        }
    }, [currentPrompt, timeRemaining, roundNumber, totalRounds, getRandomPrompt]);

    const saveHighScore = useCallback(() => {
        const newScore: GameScore = {
            playerName,
            score,
            accuracy: (roundResults.filter(r => r.correct).length / totalRounds) * 100,
            timeRemaining,
            prompt: currentPrompt?.text || '',
            timestamp: new Date()
        };

        const updatedScores = [...highScores, newScore]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Keep top 10

        setHighScores(updatedScores);
        localStorage.setItem('quickdraw-highscores', JSON.stringify(updatedScores));
    }, [playerName, score, roundResults, totalRounds, timeRemaining, currentPrompt, highScores]);

    const resetGame = useCallback(() => {
        setGameState('start');
        setCurrentPrompt(null);
        setTimeRemaining(TIME_LIMIT);
        setScore(0);
        setRoundNumber(0);
        setRoundResults([]);
    }, []);

    const skipRound = useCallback(() => {
        handleRoundEnd(false, [], '');
    }, [handleRoundEnd]);

    return {
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
        skipRound,
        setGameState
    };
};
