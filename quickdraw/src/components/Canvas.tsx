import React, { useRef, useEffect } from 'react';
import { useDrawing } from '../hooks/useDrawing';

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { startDrawing, draw, stopDrawing } = useDrawing();

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (context) {
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            style={{ border: '1px solid black' }}
        />
    );
};

export default Canvas;