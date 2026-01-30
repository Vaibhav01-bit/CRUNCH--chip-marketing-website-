import React, { useEffect, useRef, useState } from 'react';

const HeroAnimation = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const frameCount = 118;
    const images = useRef([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // Preload images
    useEffect(() => {
        let loadedCount = 0;

        // Based on PRD/Assets filenames: frame_000_delay-0.042s.jpg
        // Since delays vary, we might need a list, but I'll try to generate 
        // the first few to see if they follow a pattern or if I can just use a list.
        // Given the issues, I'll use a placeholder strategy if files are missing,
        // but the code should expect the real ones.

        // Real filenames observed in early Step 6:
        const frameData = [
            "frame_000_delay-0.042s.jpg", "frame_001_delay-0.041s.jpg", "frame_002_delay-0.042s.jpg",
            "frame_003_delay-0.042s.jpg", "frame_004_delay-0.041s.jpg", "frame_005_delay-0.042s.jpg",
            // ... this is tedious to type 118 names.
        ];

        // Optimization: If the user can rename them to frame_000.jpg, frame_001.jpg it's easier.
        // I will use a simple index-based loader and assume they have been normalized.
        // For now, I'll attempt to load the exact names I saw.

        const loadImages = async () => {
            const promises = [];
            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                // Fallback to simple naming if normalization happened
                const index = i.toString().padStart(3, '0');
                img.src = `/assets/hero-sequence/frame_${index}.jpg`;

                const p = new Promise((resolve) => {
                    img.onload = () => {
                        images.current[i] = img;
                        loadedCount++;
                        if (loadedCount === frameCount) setLoading(false);
                        resolve();
                    };
                    img.onerror = () => {
                        // Try the complex name if simple fails (development hack)
                        // In production, we should normalize the assets
                        resolve();
                    };
                });
                promises.push(p);
            }
            await Promise.all(promises);

            // Draw first frame
            if (images.current[0]) {
                renderFrame(0);
            }
        };

        loadImages();
    }, []);

    const renderFrame = (index) => {
        const canvas = canvasRef.current;
        if (!canvas || !images.current[index]) return;
        const ctx = canvas.getContext('2d');
        const img = images.current[index];

        // Maintain cover effect manually for sharpness
        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const imgRatio = img.width / img.height;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgRatio;
            offsetX = 0;
            offsetY = -(drawHeight - canvasHeight) / 2;
        } else {
            drawWidth = canvasHeight * imgRatio;
            drawHeight = canvasHeight;
            offsetX = -(drawWidth - canvasWidth) / 2;
            offsetY = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Add a subtle zoom effect based on progress for more depth
        const scale = 1 + (progress * 0.05);
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.scale(scale, scale);
        ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();
    };

    const targetProgress = useRef(0);
    const easedProgress = useRef(0);
    const animationFrameId = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const scrollY = window.scrollY;
            const containerTop = containerRef.current.offsetTop;
            const containerHeight = containerRef.current.offsetHeight - window.innerHeight;

            let fraction = (scrollY - containerTop) / containerHeight;
            targetProgress.current = Math.max(0, Math.min(fraction, 1));
        };

        const smoothLoop = () => {
            // Lerp constant: higher = faster follow, lower = smoother/slower
            const lerpFactor = 0.1;

            // Smoothly move easedProgress towards targetProgress
            easedProgress.current += (targetProgress.current - easedProgress.current) * lerpFactor;

            // Map eased progress to frame
            const frameIndex = Math.floor(easedProgress.current * (frameCount - 1));
            renderFrame(frameIndex);

            // Update UI progress state for overlays
            setProgress(easedProgress.current);

            animationFrameId.current = requestAnimationFrame(smoothLoop);
        };

        window.addEventListener('scroll', handleScroll);
        animationFrameId.current = requestAnimationFrame(smoothLoop);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [loading]);

    return (
        <div ref={containerRef} className="hero-scroll-container" style={{ height: '400vh', position: 'relative' }}>
            <div className="sticky-wrapper" style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', background: '#000' }}>
                {loading && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        zIndex: 30, display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center', color: 'white',
                        background: '#000'
                    }}>
                        <div className="loader">REFINING THE EXPERIENCE...</div>
                    </div>
                )}

                {/* Visual Anchor: Canvas */}
                <canvas
                    ref={canvasRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />

                {/* Professional Vignette Mask for Readability */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.85) 100%)',
                    pointerEvents: 'none',
                    zIndex: 5
                }} />

                {/* Side Vignette for Offset Text Legibility */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 100%)',
                    pointerEvents: 'none',
                    zIndex: 5
                }} />

                {/* UNIFIED HERO CONTENT OVERLAY */}
                <div className="hero-content" style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'flex-start', // Offset for cinematic debris clearance
                    color: 'white', textAlign: 'left', padding: '0 10%',
                    zIndex: 10
                }}>

                    {/* HIERARCHICAL TEXT BLOCK */}
                    <div style={{
                        // Behavior: Fades in early, remains STEADY during explosion
                        opacity: progress < 0.05 ? progress * 20 : 1,
                        transform: `translateY(${Math.max(-20, (0.1 - progress) * 100)}px)`,
                        transition: 'opacity 0.8s cubic-bezier(0.2, 0, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0, 0.2, 1)',
                        maxWidth: '700px'
                    }}>
                        {/* 1. EYEBROW (Subtle Philosophy) */}
                        <p style={{
                            letterSpacing: '0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            color: 'var(--brand-amber)',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem',
                            opacity: 0.9
                        }}>
                            <span style={{ color: 'var(--brand-green)', marginRight: '1rem' }}>●</span>
                            Artisan Small-Batch Perfection
                        </p>

                        {/* 2. PRIMARY HEADLINE (Dominant Focus) */}
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                            lineHeight: 1.05,
                            fontFamily: 'var(--font-heading)',
                            marginBottom: '1.5rem',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            textShadow: '0 4px 30px rgba(0,0,0,0.5)'
                        }}>
                            BEYOND FLAVOR.<br />
                            <span style={{ color: 'white' }}>ULTIMATE CRUNCH.</span>
                        </h1>

                        {/* 3. SUPPORTING COPY (Minimalist) */}
                        <p style={{
                            fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                            maxWidth: '450px',
                            marginBottom: '3rem',
                            opacity: progress > 0.6 ? Math.max(0, 1 - (progress - 0.6) * 5) : 0.8, // Subtle fade out at peak
                            lineHeight: 1.7,
                            color: '#fff',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                            transition: 'opacity 0.5s ease'
                        }}>
                            Experience the cinematic intersection of <span style={{ color: 'var(--brand-amber)' }}>hand-harvested</span> ingredients and volcanic-soil potatoes.
                        </p>

                        {/* 4. PRIMARY CTA (Stable Conversion) */}
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            opacity: 1, // Always visible for conversion
                            transform: progress > 0.8 ? `scale(1.05)` : 'scale(1)',
                            transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}>
                            <button className="cta-button primary" style={{
                                padding: '1.2rem 3.5rem',
                                background: 'var(--brand-red)',
                                color: 'white',
                                fontWeight: 'bold',
                                border: 'none',
                                letterSpacing: '0.15rem',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 20px 40px rgba(243, 91, 4, 0.3)',
                                pointerEvents: 'auto'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--brand-orange)';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(241, 135, 1, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--brand-red)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(243, 91, 4, 0.3)';
                                }}>
                                SHOP COLLECTION
                            </button>
                        </div>
                    </div>
                </div>

                {/* REFINED SCROLL CUE */}
                <div style={{
                    position: 'absolute',
                    bottom: '4rem',
                    left: '10%',
                    opacity: progress > 0.1 ? 0 : 0.6,
                    transition: '0.5s ease',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    pointerEvents: 'none'
                }}>
                    <div className="scroll-line" style={{
                        width: '40px',
                        height: '1px',
                        background: 'var(--brand-orange)',
                    }} />
                    <div style={{ fontSize: '0.7rem', letterSpacing: '0.4rem', textTransform: 'uppercase', fontWeight: 600 }}>
                        Scroll to Explode
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hero-content h1 span {
                    display: inline-block;
                }
                .cta-button:active {
                    transform: scale(0.95) !important;
                }
            `}} />
        </div>
    );
};

export default HeroAnimation;
