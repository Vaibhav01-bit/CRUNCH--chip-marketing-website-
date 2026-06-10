import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook to preload images in batches for canvas scroll sequence.
 * Uses createImageBitmap for highly optimized, off-main-thread decoding (Zero lag).
 * @param {Array<string>} urls - List of image URLs
 * @returns {Object} { progress, loaded, drawFrame }
 */
export const useImageSequence = (urls) => {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const imagesRef = useRef([]);
    const loadedCountRef = useRef(0);

    useEffect(() => {
        if (!urls || urls.length === 0) return;

        const total = urls.length;
        imagesRef.current = new Array(total).fill(null);
        loadedCountRef.current = 0;
        setLoaded(false);
        setProgress(0);

        const BATCH_SIZE = 8;
        let batchIndex = 0;

        const onImageLoad = () => {
            loadedCountRef.current++;
            const pct = Math.round((loadedCountRef.current / total) * 100);
            setProgress(pct);
            if (loadedCountRef.current === total) {
                setLoaded(true);
            }
        };

        const loadBatch = async () => {
            const start = batchIndex * BATCH_SIZE;
            const end = Math.min(start + BATCH_SIZE, total);

            if (start >= total) return;

            const promises = [];
            for (let i = start; i < end; i++) {
                // Fetch and decode off main thread using createImageBitmap
                const promise = fetch(urls[i])
                    .then(res => res.blob())
                    .then(blob => window.createImageBitmap(blob))
                    .then(bitmap => {
                        imagesRef.current[i] = bitmap;
                        onImageLoad();
                    })
                    .catch((err) => {
                        console.error("Failed to load frame", i, err);
                        onImageLoad(); // Count it anyway to avoid hanging
                    });
                promises.push(promise);
            }

            await Promise.allSettled(promises);
            
            batchIndex++;
            // Yield to main thread before starting next batch
            setTimeout(loadBatch, 5);
        };

        // Load first frame immediately
        fetch(urls[0])
            .then(res => res.blob())
            .then(blob => window.createImageBitmap(blob))
            .then(bitmap => {
                imagesRef.current[0] = bitmap;
                loadedCountRef.current = 1;
                setProgress(Math.round((1 / total) * 100));
                batchIndex = 1; 
                loadBatch();
            })
            .catch(() => {
                loadedCountRef.current = 1;
                batchIndex = 1;
                loadBatch();
            });

    }, [urls]);

    // Precalculate drawing dimensions to avoid math on every frame
    const dimensionsCache = useRef(new Map());

    const drawFrame = useCallback((ctx, frameIndex, width, height) => {
        let img = imagesRef.current[frameIndex];
        
        // Fallback to nearest loaded frame
        if (!img) {
            for (let i = frameIndex - 1; i >= 0; i--) {
                if (imagesRef.current[i]) {
                    img = imagesRef.current[i];
                    break;
                }
            }
        }
        
        if (!img || !ctx) return;

        // Cache the dimensions calculations
        const cacheKey = `${width}x${height}x${img.width}x${img.height}`;
        let dims = dimensionsCache.current.get(cacheKey);

        if (!dims) {
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
            
            dims = { drawWidth, drawHeight, offsetX, offsetY };
            dimensionsCache.current.set(cacheKey, dims);
        }

        ctx.drawImage(img, dims.offsetX, dims.offsetY, dims.drawWidth, dims.drawHeight);
    }, []);

    return { loaded, progress, drawFrame };
};
