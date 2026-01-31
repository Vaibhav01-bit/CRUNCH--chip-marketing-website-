import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useImageSequence } from '../hooks/useImageSequence';

const HeroAnimation = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Generate URLs for all 118 frames
    const frameUrls = useMemo(() => {
        return Array.from({ length: 118 }, (_, i) =>
            `/assets/hero-sequence/frame_${i.toString().padStart(3, '0')}.jpg`
        );
    }, []);

    const { loaded, progress, drawFrame } = useImageSequence(frameUrls);

    // Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const scrollY = window.scrollY;
            const containerHeight = containerRef.current.offsetHeight - window.innerHeight;

            // Map scroll to 0-1
            const p = Math.max(0, Math.min(scrollY / containerHeight, 1));
            setScrollProgress(p);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !loaded) return;

        const ctx = canvas.getContext('2d');
        const frameIndex = Math.min(
            117,
            Math.floor(scrollProgress * 117)
        );

        // Responsive resizing
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        drawFrame(ctx, frameIndex, canvas.width, canvas.height);

    }, [scrollProgress, loaded, drawFrame]);

    return (
        <div ref={containerRef} style={{ height: '400vh', position: 'relative', background: '#000' }}>
            <div className="sticky-wrapper" style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                background: '#000' // CINEMATIC BLACK BASE
            }}>

                {/* 1. Canvas Sequence Layer - OPAQUE for Logic */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute', top: 0, left: 0,
                        width: '100%', height: '100%',
                        // REMOVED mix-blend-mode for full fidelity
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 0.5s ease'
                    }}
                />

                {/* Loading State */}
                {!loaded && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', flexDirection: 'column'
                    }}>
                        <div style={{ fontWeight: 900, fontSize: '2rem', marginBottom: '1rem' }}>LOADING...</div>
                        <div style={{ width: '200px', height: '4px', background: '#333', borderRadius: '2px' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--brand-red)', transition: 'width 0.1s linear' }} />
                        </div>
                    </div>
                )}

                {/* 2. Text Content Overlay (Fades out as explosion happens) */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    zIndex: 10,
                    opacity: Math.max(0, 1 - scrollProgress * 5), // Fade out faster
                    pointerEvents: scrollProgress > 0.2 ? 'none' : 'auto',
                    width: '100%', padding: '0 1rem'
                }}>
                    <p style={{
                        letterSpacing: '0.4rem', fontSize: '0.9rem', fontWeight: '900',
                        color: 'var(--brand-yellow)',
                        textTransform: 'uppercase', marginBottom: '1.5rem',
                        display: 'inline-block',
                    }}>
                        Original Recipe • Indian Soul
                    </p>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 10vw, 8rem)', lineHeight: 0.9,
                        fontFamily: 'var(--font-heading)', color: 'white',
                        fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '2rem'
                    }}>
                        GLOBAL <span style={{ color: 'var(--brand-red)' }}>CRUNCH.</span> DESI SOUL.
                    </h1>
                    <p style={{
                        fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)',
                        fontWeight: 600, maxWidth: '600px', margin: '0 auto 2rem'
                    }}>
                        Hand-harvested volcanic potatoes. Spiced with pure Desi Masala.
                    </p>
                </div>

                {/* 3. "Scroll to Explode" Callout */}
                <div style={{
                    position: 'absolute', bottom: '3rem', left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: loaded && scrollProgress < 0.1 ? 1 : 0,
                    transition: 'opacity 0.5s',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <div style={{
                        fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.2em',
                        animation: 'bounce 2s infinite'
                    }}>
                        SCROLL FOR MASALA 🌶️
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                        40% {transform: translateY(-10px);}
                        60% {transform: translateY(-5px);}
                    }
                `}} />

            </div>
        </div>
    );
};

export default HeroAnimation;
