/**
 * useImageRecognition Hook
 * 
 * Integrates TensorFlow.js with MobileNet model for real-time drawing recognition.
 * 
 * How it works:
 * 1. Loads the pre-trained MobileNet model (trained on ImageNet dataset)
 * 2. Takes canvas image data (base64 PNG)
 * 3. Classifies the image and returns top predictions
 * 4. Uses fuzzy matching to check if predictions match the target prompt
 * 
 * MobileNet was trained on real photos, not drawings, so results are heuristic.
 * We use lenient matching to account for this (e.g., "dog" matches "golden retriever").
 * 
 * @returns {Object} Model loading state, classification function, and match checker
 */

import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Prediction } from '../types';

export const useImageRecognition = () => {
    // Store the loaded MobileNet model instance
    const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
    
    // Track whether model is still loading
    const [isLoading, setIsLoading] = useState(true);
    
    // Store any errors that occur during model loading
    const [error, setError] = useState<string | null>(null);

    /**
     * Load TensorFlow.js and MobileNet model on component mount
     * This happens once when the app starts
     */
    useEffect(() => {
        const loadModel = async () => {
            try {
                setIsLoading(true);
                
                // Initialize TensorFlow.js backend (WebGL for GPU acceleration)
                await tf.ready();
                
                // Load the pre-trained MobileNet model (~13MB download)
                // This model can recognize 1000+ object categories
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

    /**
     * Classify a drawing and return AI predictions
     * 
     * @param imageData - Base64 encoded PNG image from canvas
     * @returns Array of predictions with className and probability (0-1)
     * 
     * Example output:
     * [
     *   { className: "golden retriever", probability: 0.87 },
     *   { className: "Labrador retriever", probability: 0.06 },
     *   { className: "cocker spaniel", probability: 0.03 }
     * ]
     */
    const classifyDrawing = useCallback(async (imageData: string): Promise<Prediction[]> => {
        if (!model) {
            return [];
        }

        try {
            // Create an HTML image element from base64 data
            const img = new Image();
            img.src = imageData;

            // Wait for image to load before classification
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            // Run MobileNet classification
            // Returns top 3 predictions by default
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

    /**
     * Check if any AI prediction matches the target prompt
     * Uses fuzzy matching to be lenient (AI trained on photos, not drawings)
     * 
     * Matching strategies:
     * 1. Direct substring match: "dog" in "golden retriever"
     * 2. Plural handling: "dog" matches "dogs"
     * 3. Word-by-word checking: "phone" matches "cell phone"
     * 4. Partial word matching: "cat" matches "wildcat"
     * 
     * @param predictions - Array of AI predictions
     * @param targetPrompt - What the player was supposed to draw
     * @returns Object with match result, confidence, and best match
     */
    const checkMatch = useCallback((predictions: Prediction[], targetPrompt: string): { matched: boolean; confidence: number; bestMatch: string } => {
        if (predictions.length === 0) {
            return { matched: false, confidence: 0, bestMatch: '' };
        }

        const targetLower = targetPrompt.toLowerCase();
        const bestMatch = predictions[0].className.toLowerCase();
        const confidence = predictions[0].probability;

        // Create variations of the target word for better matching
        // Example: "dog" becomes ["dog", "dogs", "do"]
        const targetVariations = [
            targetLower,
            targetLower + 's', // Add plural
            targetLower.slice(0, -1), // Remove last char (handles some plurals)
            targetLower.replace(/s$/, ''), // Remove trailing 's'
        ];

        // Check if any prediction matches the target (lenient matching)
        const matched = predictions.some(pred => {
            const className = pred.className.toLowerCase();
            
            // Strategy 1: Direct substring match
            // "dog" matches "golden retriever dog"
            if (className.includes(targetLower) || targetLower.includes(className)) {
                return true;
            }
            
            // Strategy 2: Check all variations (plurals, etc.)
            // "cat" matches "cats", "dog" matches "dogs"
            if (targetVariations.some(variation => 
                className.includes(variation) || variation.includes(className)
            )) {
                return true;
            }
            
            // Strategy 3: Split multi-word predictions and check each word
            // "phone" matches in "cell phone", "rotary dial telephone"
            const classWords = className.split(/[\s,]+/);
            if (classWords.some(word => 
                word === targetLower || 
                targetVariations.includes(word) ||
                word.startsWith(targetLower) ||
                targetLower.startsWith(word)
            )) {
                return true;
            }
            
            // Strategy 4: Check if target appears anywhere in any word
            // "car" matches "racecar", "cargo"
            if (classWords.some(word => word.includes(targetLower))) {
                return true;
            }
            
            return false;
        });

        return { matched, confidence, bestMatch };
    }, []);

    // Return hook interface
    return {
        model,              // The loaded MobileNet model (null if not loaded)
        isLoading,          // true while model is downloading/initializing
        error,              // Error message if loading failed
        classifyDrawing,    // Function to classify an image
        checkMatch          // Function to check if predictions match target
    };
};
