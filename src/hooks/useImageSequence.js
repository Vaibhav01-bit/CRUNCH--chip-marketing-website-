import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to preload images and manage canvas drawing for scroll sequence.
 * @param {Array<string>} urls - List of image URLs
 * @returns {Object} { progress, currentImage, error, loaded }
 */
export const useImageSequence = (urls) => {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const imagesRef = useRef([]);

    useEffect(() => {
        let loadedCount = 0;
        const total = urls.length;

        // Reset if urls change
        imagesRef.current = new Array(total).fill(null);
        setLoaded(false);
        setProgress(0);

        urls.forEach((url, index) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                imagesRef.current[index] = img;
                loadedCount++;
                setProgress(Math.round((loadedCount / total) * 100));
                if (loadedCount === total) {
                    setLoaded(true);
                }
            };
        });
    }, [urls]);

    const drawFrame = (ctx, frameIndex, width, height) => {
        const img = imagesRef.current[frameIndex];
        if (!img || !ctx) return;

        // "Cover" fit logic
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = width;
            drawHeight = width / imgRatio;
            offsetX = 0;
            offsetY = -(drawHeight - height) / 2;
        } else {
            drawWidth = height * imgRatio;
            drawHeight = height;
            offsetX = -(drawWidth - width) / 2;
            offsetY = 0;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    return { loaded, progress, drawFrame };
};
