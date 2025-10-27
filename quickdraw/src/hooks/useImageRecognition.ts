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

        // Create variations of the target for better matching
        const targetVariations = [
            targetLower,
            targetLower + 's', // plural
            targetLower.slice(0, -1), // remove potential 's'
            targetLower.replace(/s$/, ''), // remove trailing s
        ];

        // Check if any prediction matches the target prompt (more lenient)
        const matched = predictions.some(pred => {
            const className = pred.className.toLowerCase();
            
            // Direct matches
            if (className.includes(targetLower) || targetLower.includes(className)) {
                return true;
            }
            
            // Check variations
            if (targetVariations.some(variation => 
                className.includes(variation) || variation.includes(className)
            )) {
                return true;
            }
            
            // Split multi-word predictions and check each word
            const classWords = className.split(/[\s,]+/);
            if (classWords.some(word => 
                word === targetLower || 
                targetVariations.includes(word) ||
                word.startsWith(targetLower) ||
                targetLower.startsWith(word)
            )) {
                return true;
            }
            
            // Check if target appears in any word of the prediction
            if (classWords.some(word => word.includes(targetLower))) {
                return true;
            }
            
            return false;
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
