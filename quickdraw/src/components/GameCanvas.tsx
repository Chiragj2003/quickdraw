/**
 * GameCanvas Component
 * 
 * Interactive HTML5 canvas for freehand drawing with mouse and touch support.
 * 
 * Features:
 * - White background with black pen
 * - Smooth lines with rounded caps/joins
 * - Touch and mouse event handling
 * - Real-time image data export (base64 PNG)
 * - Clear canvas functionality
 * 
 * The canvas continuously exports drawing data to the parent component
 * (GameScreen) which feeds it to the AI for analysis.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface GameCanvasProps {
    onDrawingComplete?: (imageData: string) => void;  // Called on every stroke update
    isActive: boolean;                                 // Disable when round ends
    onClear?: () => void;                             // Called after clearing canvas
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onDrawingComplete, isActive, onClear }) => {
    // Reference to the <canvas> DOM element
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    // Whether user is currently drawing (mouse/touch down)
    const [isDrawing, setIsDrawing] = useState(false);
    
    // Canvas 2D rendering context (used for all drawing operations)
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    /**
     * Initialize canvas on mount
     * Sets up the rendering context and drawing properties
     */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                setContext(ctx);
                
                // White background (AI expects photos with backgrounds)
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Drawing pen properties
                ctx.strokeStyle = 'black';      // Pen color
                ctx.lineWidth = 3;              // Pen thickness (pixels)
                ctx.lineCap = 'round';          // Rounded line ends
                ctx.lineJoin = 'round';         // Smooth corners
            }
        }
    }, []);

    /**
     * Clear the canvas and reset to white background
     */
    const clearCanvas = useCallback(() => {
        if (context && canvasRef.current) {
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            if (onClear) {
                onClear();  // Notify parent to reset predictions
            }
        }
    }, [context, onClear]);

    /**
     * Get mouse/touch coordinates relative to canvas
     * Handles both mouse and touch events uniformly
     * 
     * @param e - Mouse or Touch event
     * @returns Coordinates relative to canvas top-left corner
     */
    const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        
        // Touch event (mobile)
        if ('touches' in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        } 
        // Mouse event (desktop)
        else {
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    };

    /**
     * Start a new stroke
     * Called on mousedown/touchstart
     */
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isActive || !context) return;
        
        const { x, y } = getCoordinates(e);
        setIsDrawing(true);
        context.beginPath();
        context.moveTo(x, y);
    };

    /**
     * Continue drawing the current stroke
     * Called on mousemove/touchmove while mouse/touch is down
     * 
     * Exports the canvas as base64 PNG after each update
     * for continuous AI analysis
     */
    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !context || !isActive) return;
        
        const { x, y } = getCoordinates(e);
        context.lineTo(x, y);
        context.stroke();
        
        // Export drawing to parent for AI analysis
        if (onDrawingComplete && canvasRef.current) {
            // Convert canvas to base64 PNG data URL
            const imageData = canvasRef.current.toDataURL('image/png');
            onDrawingComplete(imageData);
        }
    };

    /**
     * End the current stroke
     * Called on mouseup/touchend/mouseleave
     */
    const stopDrawing = () => {
        if (!context) return;
        setIsDrawing(false);
        context.closePath();
    };

    return (
        <div className="game-canvas-container">
            {/* Drawing Canvas - 600x600 pixels */}
            <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="game-canvas"
                // Mouse events (desktop)
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}  // Stop drawing if mouse leaves canvas
                // Touch events (mobile)
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            
            {/* Clear Button */}
            <button 
                className="clear-btn" 
                onClick={clearCanvas}
                disabled={!isActive}
            >
                Clear Canvas
            </button>
        </div>
    );
};

export default GameCanvas;
