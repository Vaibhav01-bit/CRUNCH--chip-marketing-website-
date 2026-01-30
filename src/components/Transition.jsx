import React, { useEffect, useRef, useState } from 'react';

const Transition = () => {
    const sectionRef = useRef(null);
    const [chips, setChips] = useState([]);
    const scrollY = useRef(0);

    // Initialize random chips and mangos
    useEffect(() => {
        const initialChips = Array.from({ length: 6 }).map((_, i) => ({
            id: `chip-${i}`,
            type: 'chip',
            x: Math.random() * 90,
            y: Math.random() * 100,
            size: Math.random() * 100 + 120, // Increased size: 120px to 220px
            rotation: Math.random() * 360,
            speed: Math.random() * 0.12 + 0.08,
            parallax: Math.random() * 0.3 + 0.2,
            blur: Math.random() * 1.5 + 0.5, // Reduced blur for clarity
            opacity: Math.random() * 0.1 + 0.25 // More noticeable opacity
        }));

        const initialMangos = Array.from({ length: 2 }).map((_, i) => ({
            id: `mango-${i}`,
            type: 'mango',
            x: Math.random() * 80 + 10,
            y: Math.random() * 100,
            size: Math.random() * 100 + 180,
            rotation: Math.random() * 360,
            speed: Math.random() * 0.05 + 0.02,
            parallax: Math.random() * 0.1 + 0.05,
            blur: Math.random() * 10 + 6, // Very blurred to stay in far background
            opacity: 0.06
        }));

        setChips([...initialChips, ...initialMangos]);

        const handleScroll = () => {
            scrollY.current = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [frame, setFrame] = useState(0);
    useEffect(() => {
        let animationId;
        const animate = () => {
            setFrame(f => f + 1);
            animationId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <section ref={sectionRef} className="transition-section" style={{
            background: '#fff',
            padding: '180px 0',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Animation Layer */}
            <div className="chips-bg" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1
            }}>
                {chips.map((item) => {
                    const driftY = (frame * item.speed) % 150; // Continuous drift
                    const parallaxY = scrollY.current * item.parallax;
                    return (
                        <div key={item.id} style={{
                            position: 'absolute',
                            left: `${item.x}%`,
                            top: `${(item.y - driftY - (parallaxY % 1000) / 10 + 120) % 120 - 10}%`,
                            width: `${item.size}px`,
                            height: `${item.size}px`,
                            transform: `rotate(${item.rotation + frame * (item.type === 'mango' ? 0.05 : 0.1)}deg)`,
                            filter: `blur(${item.blur}px)`,
                            opacity: item.opacity,
                            transition: 'opacity 0.8s ease',
                        }}>
                            <img
                                src={item.type === 'mango' ? "/assets/mango-single.png" : "/assets/chip-single.png"}
                                alt=""
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    mixBlendMode: item.type === 'mango' ? 'normal' : 'multiply'
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="container" style={{ maxWidth: '850px', position: 'relative', zIndex: 10 }}>
                <p style={{
                    color: 'var(--brand-orange)',
                    letterSpacing: '0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: '900',
                    marginBottom: '2.5rem',
                    textTransform: 'uppercase',
                    opacity: 0.9
                }}>
                    <span style={{ color: 'var(--brand-green)', marginRight: '1rem' }}>●</span>
                    Grounded In Excellence
                </p>
                <h2 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1.1,
                    color: 'var(--primary-dark)',
                    marginBottom: '3rem',
                    fontWeight: 800
                }}>
                    The aftermath of a perfect <span style={{ color: 'var(--brand-orange)', position: 'relative' }}>
                        crunch
                        <span style={{
                            position: 'absolute',
                            bottom: '-5px',
                            left: 0,
                            width: '100%',
                            height: '2px',
                            background: 'var(--brand-amber)',
                            opacity: 0.3
                        }} />
                    </span> is a moment of pure, artisan clarity.
                </h2>
                <div style={{
                    width: '80px',
                    height: '1px',
                    background: 'var(--brand-orange)',
                    margin: '0 auto 3rem',
                    opacity: 0.5
                }} />
                <p style={{
                    fontSize: '1.3rem',
                    lineHeight: 1.8,
                    color: 'var(--text-muted)',
                    maxWidth: '650px',
                    margin: '0 auto',
                    fontWeight: '400',
                    opacity: 0.8
                }}>
                    We don't just fry potatoes. We architect an experience that begins with volcanic soil and ends with a symphony of salt, oil, and heat. Every chip is a legacy.
                </p>
            </div>
        </section>
    );
};

export default Transition;
