import React, { useRef, useEffect, useState, useCallback } from 'react';

interface GameCanvasProps {
    onDrawingComplete?: (imageData: string) => void;
    isActive: boolean;
    onClear?: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onDrawingComplete, isActive, onClear }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                setContext(ctx);
                // Set white background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Set drawing properties
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            }
        }
    }, []);

    const clearCanvas = useCallback(() => {
        if (context && canvasRef.current) {
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            if (onClear) {
                onClear();
            }
        }
    }, [context, onClear]);

    const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        
        if ('touches' in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        } else {
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isActive || !context) return;
        
        const { x, y } = getCoordinates(e);
        setIsDrawing(true);
        context.beginPath();
        context.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !context || !isActive) return;
        
        const { x, y } = getCoordinates(e);
        context.lineTo(x, y);
        context.stroke();
        
        // Notify parent about drawing updates
        if (onDrawingComplete && canvasRef.current) {
            const imageData = canvasRef.current.toDataURL('image/png');
            onDrawingComplete(imageData);
        }
    };

    const stopDrawing = () => {
        if (!context) return;
        setIsDrawing(false);
        context.closePath();
    };

    return (
        <div className="game-canvas-container">
            <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="game-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
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
