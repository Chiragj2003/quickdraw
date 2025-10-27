/**
 * useDrawing Hook
 * 
 * Manages the state and logic for freehand drawing on a canvas.
 * 
 * Drawing Model:
 * - A drawing consists of multiple "lines" (strokes)
 * - Each line is an array of {x, y} points
 * - New points are added while the mouse/touch is down
 * - Releasing creates a new line for the next stroke
 * 
 * This hook provides the state and handlers needed by GameCanvas
 * to implement drawing functionality.
 * 
 * @returns Drawing state and control functions
 */

import { useState, useCallback } from 'react';

const useDrawing = () => {
    // Whether user is currently drawing (mouse/touch down)
    const [isDrawing, setIsDrawing] = useState(false);
    
    /**
     * All lines in the drawing
     * Structure: [ [{x:10,y:20}, {x:11,y:21}], [{x:50,y:60}] ]
     * - Outer array: Each element is one continuous stroke
     * - Inner array: Points in that stroke
     */
    const [lines, setLines] = useState<Array<{ x: number; y: number }[]>>([]);

    /**
     * Start a new stroke at the given position
     * Called on mousedown/touchstart
     * 
     * @param x - X coordinate relative to canvas
     * @param y - Y coordinate relative to canvas
     */
    const startDrawing = useCallback((x: number, y: number) => {
        setIsDrawing(true);
        // Create a new line with the starting point
        setLines((prevLines) => [...prevLines, [{ x, y }]]);
    }, []);

    /**
     * Add a point to the current stroke
     * Called on mousemove/touchmove while drawing
     * 
     * @param x - X coordinate relative to canvas
     * @param y - Y coordinate relative to canvas
     */
    const draw = useCallback((x: number, y: number) => {
        if (!isDrawing) return;
        
        setLines((prevLines) => {
            const newLines = [...prevLines];
            // Add point to the last (current) line
            newLines[newLines.length - 1].push({ x, y });
            return newLines;
        });
    }, [isDrawing]);

    /**
     * End the current stroke
     * Called on mouseup/touchend
     * 
     * The next startDrawing() call will begin a new separate stroke
     */
    const stopDrawing = useCallback(() => {
        setIsDrawing(false);
    }, []);

    return { 
        isDrawing,      // Current drawing state (for UI feedback)
        lines,          // All strokes in the drawing
        startDrawing,   // Begin new stroke
        draw,           // Add point to stroke
        stopDrawing     // End stroke
    };
};

export default useDrawing;