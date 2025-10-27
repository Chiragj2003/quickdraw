import { useState, useCallback } from 'react';

const useDrawing = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [lines, setLines] = useState<Array<{ x: number; y: number }[]>>([]);

    const startDrawing = useCallback((x: number, y: number) => {
        setIsDrawing(true);
        setLines((prevLines) => [...prevLines, [{ x, y }]]);
    }, []);

    const draw = useCallback((x: number, y: number) => {
        if (!isDrawing) return;
        setLines((prevLines) => {
            const newLines = [...prevLines];
            newLines[newLines.length - 1].push({ x, y });
            return newLines;
        });
    }, [isDrawing]);

    const stopDrawing = useCallback(() => {
        setIsDrawing(false);
    }, []);

    return { isDrawing, lines, startDrawing, draw, stopDrawing };
};

export default useDrawing;