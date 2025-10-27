/**
 * Type Definitions for Quick Draw Challenge Game
 * 
 * This file contains all TypeScript interfaces and types used throughout the application.
 * It defines the structure for game state, drawing data, AI predictions, and scoring.
 */

// ============================================================================
// Drawing Tool Types (for future canvas enhancements)
// ============================================================================

/** Available drawing tools - currently only brush is implemented */
export type Tool = 'brush' | 'eraser' | 'rectangle' | 'circle';

/** State information for the drawing canvas */
export interface DrawingState {
    isDrawing: boolean;  // Whether user is currently drawing
    tool: Tool;          // Selected drawing tool
    color: string;       // Current brush color
    lineWidth: number;   // Thickness of the brush stroke
}

/** Represents a point on the canvas with x,y coordinates */
export interface Point {
    x: number;
    y: number;
}

/** A complete shape drawn on the canvas */
export interface Shape {
    type: Tool;           // Type of tool used to draw this shape
    points: Point[];      // Array of points that make up the shape
    color: string;        // Color of the shape
    lineWidth: number;    // Stroke width used
}

// ============================================================================
// Game State Types
// ============================================================================

/** 
 * Possible states of the game flow:
 * - 'start': Welcome screen where player enters name
 * - 'playing': Active game round with drawing canvas
 * - 'result': Shows score and round summary after completing all rounds
 * - 'leaderboard': Displays high scores from localStorage
 */
export type GameState = 'start' | 'playing' | 'result' | 'leaderboard';

/** 
 * A drawing prompt shown to the player
 * Example: { id: 1, text: 'cat', category: 'animal' }
 */
export interface Prompt {
    id: number;          // Unique identifier
    text: string;        // What the player needs to draw (e.g., "dog", "car")
    category: string;    // Group/type of prompt (e.g., "animal", "vehicle")
}

/** 
 * Player's final score saved to leaderboard
 * Stored in localStorage as JSON array
 */
export interface GameScore {
    playerName: string;      // Player's display name
    score: number;           // Total points earned
    accuracy: number;        // Percentage of correct drawings (0-100)
    timeRemaining: number;   // Seconds left when game ended (bonus)
    prompt: string;          // Last prompt played
    timestamp: Date;         // When this score was achieved
}

// ============================================================================
// AI/TensorFlow Types
// ============================================================================

/** 
 * Single prediction result from TensorFlow MobileNet model
 * Example: { className: "golden retriever", probability: 0.87 }
 */
export interface Prediction {
    className: string;    // Human-readable label (e.g., "Labrador retriever")
    probability: number;  // Confidence score 0-1 (e.g., 0.87 = 87% confident)
}

// ============================================================================
// Game Configuration
// ============================================================================

/** Game settings (currently not exposed in UI, but defined for future) */
export interface GameSettings {
    timeLimit: number;                          // Seconds per round (currently 20)
    difficulty: 'easy' | 'medium' | 'hard';    // Difficulty level
    numRounds: number;                          // Total rounds per game (currently 5)
}

// ============================================================================
// Round Results
// ============================================================================

/** 
 * Complete data for a single game round
 * Used to display round summary at end of game
 */
export interface RoundResult {
    prompt: string;           // What player was asked to draw
    userDrawing: string;      // Base64-encoded PNG of the drawing
    predictions: Prediction[]; // Top AI predictions for this drawing
    correct: boolean;         // Whether AI successfully recognized it
    timeUsed: number;         // Seconds taken to complete (or 20 if timed out)
    score: number;            // Points earned this round (0 if incorrect)
}