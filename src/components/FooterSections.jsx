import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';

const sensoryVortexPositions = (count) => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = 2 + Math.random() * 5;
        const z = (Math.random() - 0.5) * 10;
        pos[i * 3] = Math.cos(theta) * r;
        pos[i * 3 + 1] = Math.sin(theta) * r;
        pos[i * 3 + 2] = z;
    }
    return pos;
};

const SensoryVortex = () => {
    const count = 3000;
    const pointsRef = useRef();
    const positions = useMemo(() => sensoryVortexPositions(count), [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (pointsRef.current) {
            pointsRef.current.rotation.z = time * 0.05;
            pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.2;
        }
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#f18701"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.3}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

export const Newsletter = () => {
    const revealRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            },
            { threshold: 0.1 }
        );

        if (revealRef.current) observer.observe(revealRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="newsletter" style={{
            background: '#0a0a0a',
            color: 'white',
            padding: '200px 0',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* 3D Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                opacity: 0.6
            }}>
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                    <Suspense fallback={null}>
                        <SensoryVortex />
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                            {/* Optional: Add a subtle floating 'element' if needed, but keeping it clean for now */}
                        </Float>
                    </Suspense>
                </Canvas>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
                <div className="reveal-on-scroll" ref={revealRef}>
                    <p style={{
                        color: 'var(--brand-orange)',
                        letterSpacing: '0.6rem',
                        fontSize: '0.8rem',
                        fontWeight: '900',
                        marginBottom: '2rem',
                        textTransform: 'uppercase'
                    }}>
                        Exclusive Access
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        marginBottom: '2.5rem',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        lineHeight: 1.1
                    }}>
                        Join the <span style={{ color: 'var(--brand-orange)' }}>Inner Circle</span>.
                    </h2>
                    <p style={{
                        marginBottom: '4.5rem',
                        opacity: 0.7,
                        fontSize: '1.2rem',
                        lineHeight: 1.8,
                        maxWidth: '600px',
                        margin: '0 auto 4.5rem'
                    }}>
                        Exclusive priority access to limited-run seasonal harvests, artisan flavor collaborations, and behind-the-scenes craft stories.
                    </p>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            width: '100%',
                            maxWidth: '600px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            padding: '0.6rem',
                            borderRadius: '0px',
                            backdropFilter: 'blur(20px)',
                            transition: 'all 0.4s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(241, 135, 1, 0.3)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                            }}
                        >
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                style={{
                                    flex: 1,
                                    padding: '1.4rem 2rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    letterSpacing: '0.2rem',
                                    fontSize: '0.85rem',
                                    outline: 'none',
                                    fontWeight: '900'
                                }}
                            />
                            <button style={{
                                background: 'var(--brand-red)',
                                color: 'white',
                                padding: '1rem 3.5rem',
                                fontWeight: '900',
                                border: 'none',
                                fontSize: '0.8rem',
                                letterSpacing: '0.2rem',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.2, 0, 0.2, 1)',
                                boxShadow: '0 10px 30px rgba(243, 91, 4, 0.2)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--brand-orange)';
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--brand-red)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                START JOURNEY
                            </button>
                        </div>
                        <p style={{ fontSize: '0.7rem', opacity: 0.4, letterSpacing: '0.1rem' }}>
                            UNSUBSCRIBE AT ANY TIME. PRIVACY MATTERS.
                        </p>
                    </div>
                </div>
            </div>

            {/* Subtle Gradient Overlays */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '150px',
                background: 'linear-gradient(to bottom, #0a0a0a, transparent)',
                zIndex: 1
            }} />
        </section>
    );
};

export const Footer = () => {
    const revealRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        revealRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <footer style={{
            background: '#000',
            color: 'white',
            padding: '120px 0 60px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '4rem',
                    marginBottom: '120px'
                }}>
                    <div className="reveal-on-scroll" ref={el => revealRefs.current[0] = el}>
                        <h3 style={{
                            fontSize: '1.8rem',
                            marginBottom: '2.5rem',
                            fontFamily: 'var(--font-heading)',
                            color: 'var(--brand-orange)',
                            fontWeight: 900,
                            letterSpacing: '0.1rem'
                        }}>
                            CRUNCH.
                        </h3>
                        <p style={{
                            opacity: 0.5,
                            lineHeight: 1.8,
                            fontSize: '0.95rem',
                            maxWidth: '300px'
                        }}>
                            Architecting the ultimate sensory experience since 1984. Hand-harvested, kettle-cooked, and defined by the crunch.
                        </p>
                    </div>

                    <div className="reveal-on-scroll" ref={el => revealRefs.current[1] = el} style={{ transitionDelay: '0.1s' }}>
                        <h4 style={{
                            marginBottom: '2rem',
                            fontSize: '0.7rem',
                            letterSpacing: '0.3rem',
                            opacity: 0.9,
                            color: 'var(--brand-amber)',
                            fontWeight: 900,
                            textTransform: 'uppercase'
                        }}>
                            Shop
                        </h4>
                        <div style={{
                            opacity: 0.6,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.2rem',
                            fontSize: '0.9rem',
                            fontWeight: 500
                        }}>
                            {['Collections', 'Limited Editions', 'Retail Partners'].map((link) => (
                                <a key={link} href="#" style={{ transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand-orange)'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="reveal-on-scroll" ref={el => revealRefs.current[2] = el} style={{ transitionDelay: '0.2s' }}>
                        <h4 style={{
                            marginBottom: '2rem',
                            fontSize: '0.7rem',
                            letterSpacing: '0.3rem',
                            opacity: 0.9,
                            color: 'var(--brand-amber)',
                            fontWeight: 900,
                            textTransform: 'uppercase'
                        }}>
                            Discover
                        </h4>
                        <div style={{
                            opacity: 0.6,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.2rem',
                            fontSize: '0.9rem',
                            fontWeight: 500
                        }}>
                            {['Our Story', 'Sourcing', 'Contact'].map((link) => (
                                <a key={link} href="#" style={{ transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand-orange)'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="reveal-on-scroll" ref={el => revealRefs.current[3] = el} style={{ transitionDelay: '0.3s' }}>
                        <h4 style={{
                            marginBottom: '2rem',
                            fontSize: '0.7rem',
                            letterSpacing: '0.3rem',
                            opacity: 0.9,
                            color: 'var(--brand-amber)',
                            fontWeight: 900,
                            textTransform: 'uppercase'
                        }}>
                            Follow
                        </h4>
                        <div style={{
                            opacity: 0.6,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.2rem',
                            fontSize: '0.9rem',
                            fontWeight: 500
                        }}>
                            {['Instagram', 'Twitter', 'Vimeo'].map((link) => (
                                <a key={link} href="#" style={{ transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand-orange)'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="reveal-on-scroll" ref={el => revealRefs.current[4] = el}
                    style={{
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        paddingTop: '60px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: 0.4,
                        fontSize: '0.75rem',
                        letterSpacing: '0.15rem',
                        fontWeight: 600
                    }}
                >
                    <p>© 2026 VAIBHAV INGLE. ALL RIGHTS RESERVED.</p>
                    <div style={{ display: 'flex', gap: '3rem' }}>
                        <a href="#" style={{ transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>PRIVACY POLICY</a>
                        <a href="#" style={{ transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>TERMS OF SERVICE</a>
                    </div>
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/assets/process-visual.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.03,
                filter: 'grayscale(1)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
        </footer>
    );
};
