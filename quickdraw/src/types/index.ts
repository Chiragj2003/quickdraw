// This file exports TypeScript types and interfaces used throughout the application.

export type Tool = 'brush' | 'eraser' | 'rectangle' | 'circle';

export interface DrawingState {
    isDrawing: boolean;
    tool: Tool;
    color: string;
    lineWidth: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface Shape {
    type: Tool;
    points: Point[];
    color: string;
    lineWidth: number;
}

// Game-related types
export type GameState = 'start' | 'playing' | 'result' | 'leaderboard';

export interface Prompt {
    id: number;
    text: string;
    category: string;
}

export interface GameScore {
    playerName: string;
    score: number;
    accuracy: number;
    timeRemaining: number;
    prompt: string;
    timestamp: Date;
}

export interface Prediction {
    className: string;
    probability: number;
}

export interface GameSettings {
    timeLimit: number; // in seconds
    difficulty: 'easy' | 'medium' | 'hard';
    numRounds: number;
}

export interface RoundResult {
    prompt: string;
    userDrawing: string; // base64 image
    predictions: Prediction[];
    correct: boolean;
    timeUsed: number;
    score: number;
}