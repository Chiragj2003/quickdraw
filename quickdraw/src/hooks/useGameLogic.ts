/**
 * useGameLogic Hook
 * 
 * Main game state management hook for Quick Draw Challenge.
 * Handles:
 * - Game flow (start -> playing -> result)
 * - Round progression and timing
 * - Score calculation and high score persistence
 * - Prompt selection and round management
 * 
 * @returns {Object} Game state and control functions
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Prompt, GameScore, RoundResult, Prediction } from '../types';

// ============================================================================
// Game Configuration Constants
// ============================================================================

/**
 * List of drawing prompts for the game
 * These are carefully selected items that MobileNet can recognize well:
 * - Common everyday objects (phone, cup, ball)
 * - Simple animals (dog, cat, bird, fish)
 * - Basic shapes (house, car, tree)
 */
const PROMPTS: Prompt[] = [
    { id: 1, text: 'dog', category: 'animal' },
    { id: 2, text: 'cat', category: 'animal' },
    { id: 3, text: 'car', category: 'vehicle' },
    { id: 4, text: 'airplane', category: 'vehicle' },
    { id: 5, text: 'house', category: 'building' },
    { id: 6, text: 'tree', category: 'nature' },
    { id: 7, text: 'sun', category: 'nature' },
    { id: 8, text: 'banana', category: 'food' },
    { id: 9, text: 'apple', category: 'food' },
    { id: 10, text: 'pizza', category: 'food' },
    { id: 11, text: 'shoe', category: 'object' },
    { id: 12, text: 'cup', category: 'object' },
    { id: 13, text: 'ball', category: 'object' },
    { id: 14, text: 'chair', category: 'furniture' },
    { id: 15, text: 'table', category: 'furniture' },
    { id: 16, text: 'phone', category: 'technology' },
    { id: 17, text: 'laptop', category: 'technology' },
    { id: 18, text: 'bird', category: 'animal' },
    { id: 19, text: 'fish', category: 'animal' },
    { id: 20, text: 'flower', category: 'nature' }
];

/** How many seconds each round lasts */
const TIME_LIMIT = 20;

/** Base points awarded for a correct drawing */
const POINTS_PER_CORRECT = 100;

/** Multiplier for time bonus (faster drawings get more points) */
const TIME_BONUS_MULTIPLIER = 10;

// ============================================================================
// Main Hook
// ============================================================================

export const useGameLogic = () => {
    // Game state tracking
    const [gameState, setGameState] = useState<GameState>('start');
    const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT);
    
    // Score tracking
    const [score, setScore] = useState(0);
    const [roundNumber, setRoundNumber] = useState(0);
    const [totalRounds] = useState(5); // Total rounds per game
    const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
    
    // Player data
    const [playerName, setPlayerName] = useState('Player');
    const [highScores, setHighScores] = useState<GameScore[]>([]);
    
    // Timer reference for cleanup
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // ========================================================================
    // Load high scores from browser localStorage on mount
    // ========================================================================
    useEffect(() => {
        const savedScores = localStorage.getItem('quickdraw-highscores');
        if (savedScores) {
            setHighScores(JSON.parse(savedScores));
        }
    }, []);

    // ========================================================================
    // Countdown timer - decrements every second during gameplay
    // ========================================================================
    useEffect(() => {
        if (gameState === 'playing' && timeRemaining > 0) {
            timerRef.current = setTimeout(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0 && gameState === 'playing') {
            // Time's up! End round as incorrect
            handleRoundEnd(false, [], '');
        }

        // Cleanup timer on unmount or state change
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [gameState, timeRemaining]);

    /**
     * Get a random prompt that hasn't been used yet this game
     * Falls back to all prompts if we've used them all
     */
    const getRandomPrompt = useCallback((): Prompt => {
        // Filter out prompts already used this game
        const availablePrompts = PROMPTS.filter(
            p => !roundResults.some(r => r.prompt === p.text)
        );
        // Use available prompts, or all if we've exhausted the list
        const prompts = availablePrompts.length > 0 ? availablePrompts : PROMPTS;
        return prompts[Math.floor(Math.random() * prompts.length)];
    }, [roundResults]);

    /**
     * Start a new game
     * @param name - Optional player name (defaults to 'Player')
     */
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

    /**
     * End the current round and calculate score
     * 
     * @param correct - Whether the AI correctly identified the drawing
     * @param predictions - AI predictions for this drawing
     * @param imageData - Base64 encoded image of the drawing
     */
    const handleRoundEnd = useCallback((
        correct: boolean,
        predictions: Prediction[],
        imageData: string
    ) => {
        if (!currentPrompt) return;

        // Calculate how long the player took
        const timeUsed = TIME_LIMIT - timeRemaining;
        let roundScore = 0;

        if (correct) {
            // Award base points + time bonus
            // Example: Finished in 5 seconds = 100 + (15 * 10) = 250 points
            roundScore = POINTS_PER_CORRECT + (timeRemaining * TIME_BONUS_MULTIPLIER);
            setScore(prev => prev + roundScore);
        }

        // Store this round's result
        const result: RoundResult = {
            prompt: currentPrompt.text,
            userDrawing: imageData,
            predictions,
            correct,
            timeUsed,
            score: roundScore
        };

        setRoundResults(prev => [...prev, result]);

        // Check if this was the last round
        if (roundNumber >= totalRounds) {
            // Game over - show results after a brief delay
            setTimeout(() => {
                setGameState('result');
                saveHighScore();
            }, 1500);
        } else {
            // Next round - reset timer and get new prompt
            setTimeout(() => {
                setRoundNumber(prev => prev + 1);
                setTimeRemaining(TIME_LIMIT);
                setCurrentPrompt(getRandomPrompt());
            }, 1500);
        }
    }, [currentPrompt, timeRemaining, roundNumber, totalRounds, getRandomPrompt]);

    /**
     * Save player's score to localStorage leaderboard
     * Keeps only top 10 scores
     */
    const saveHighScore = useCallback(() => {
        const newScore: GameScore = {
            playerName,
            score,
            accuracy: (roundResults.filter(r => r.correct).length / totalRounds) * 100,
            timeRemaining,
            prompt: currentPrompt?.text || '',
            timestamp: new Date()
        };

        // Add new score and sort by score descending
        const updatedScores = [...highScores, newScore]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Keep only top 10

        setHighScores(updatedScores);
        localStorage.setItem('quickdraw-highscores', JSON.stringify(updatedScores));
    }, [playerName, score, roundResults, totalRounds, timeRemaining, currentPrompt, highScores]);

    /**
     * Reset game to initial state (back to start screen)
     */
    const resetGame = useCallback(() => {
        setGameState('start');
        setCurrentPrompt(null);
        setTimeRemaining(TIME_LIMIT);
        setScore(0);
        setRoundNumber(0);
        setRoundResults([]);
    }, []);

    /**
     * Skip the current round (counts as incorrect)
     */
    const skipRound = useCallback(() => {
        handleRoundEnd(false, [], '');
    }, [handleRoundEnd]);

    // Return all game state and control functions
    return {
        gameState,           // Current screen: 'start' | 'playing' | 'result' | 'leaderboard'
        currentPrompt,       // What player should draw right now
        timeRemaining,       // Seconds left in current round
        score,              // Total points accumulated
        roundNumber,        // Current round (1-5)
        totalRounds,        // Total rounds in game (5)
        roundResults,       // Array of completed rounds with results
        playerName,         // Player's display name
        highScores,         // Top 10 scores from localStorage
        startGame,          // Function to begin a new game
        handleRoundEnd,     // Function to complete current round
        resetGame,          // Function to return to start screen
        skipRound,          // Function to skip current round
        setGameState        // Function to manually change game state
    };
};
