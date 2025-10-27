import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Prediction } from '../types';

export const useImageRecognition = () => {
    const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
                setIsLoading(true);
                // Load TensorFlow backend
                await tf.ready();
                // Load MobileNet model
                const loadedModel = await mobilenet.load();
                setModel(loadedModel);
                setIsLoading(false);
            } catch (err) {
                console.error('Error loading model:', err);
                setError('Failed to load AI model. Please refresh the page.');
                setIsLoading(false);
            }
        };

        loadModel();
    }, []);

    const classifyDrawing = useCallback(async (imageData: string): Promise<Prediction[]> => {
        if (!model) {
            return [];
        }

        try {
            // Create an image element from the base64 data
            const img = new Image();
            img.src = imageData;

            await new Promise((resolve) => {
                img.onload = resolve;
            });

            // Classify the image
            const predictions = await model.classify(img);
            
            // Convert to our Prediction type
            return predictions.map(pred => ({
                className: pred.className,
                probability: pred.probability
            }));
        } catch (err) {
            console.error('Error classifying image:', err);
            return [];
        }
    }, [model]);

    const checkMatch = useCallback((predictions: Prediction[], targetPrompt: string): { matched: boolean; confidence: number; bestMatch: string } => {
        if (predictions.length === 0) {
            return { matched: false, confidence: 0, bestMatch: '' };
        }

        const targetLower = targetPrompt.toLowerCase();
        const bestMatch = predictions[0].className.toLowerCase();
        const confidence = predictions[0].probability;

        // Check if any prediction matches the target prompt
        const matched = predictions.some(pred => {
            const className = pred.className.toLowerCase();
            // Check for exact match or if the target is contained in the prediction
            return className.includes(targetLower) || targetLower.includes(className);
        });

        return { matched, confidence, bestMatch };
    }, []);

    return {
        model,
        isLoading,
        error,
        classifyDrawing,
        checkMatch
    };
};
