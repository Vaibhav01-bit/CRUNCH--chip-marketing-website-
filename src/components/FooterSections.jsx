import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Points, PointMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const ChipRain = () => {
    const chipTexture = useTexture('/assets/chip-single.png');
    const count = 30; // Number of falling chips

    const chips = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            position: [(Math.random() - 0.5) * 15, Math.random() * 20 - 10, (Math.random() - 0.5) * 5 - 5],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
            scale: 0.5 + Math.random() * 0.5,
            speed: 0.02 + Math.random() * 0.05
        }));
    }, []);

    const groupRef = useRef();

    useFrame((state) => {
        // Falling logic can go here if we wanted individual Y updates, 
        // but rotating the whole group is cheaper and looks like "drifting" in space.
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001;
            groupRef.current.position.y -= 0.01;
            if (groupRef.current.position.y < -5) groupRef.current.position.y = 5;
        }
    });

    return (
        <group ref={groupRef}>
            {chips.map((data, i) => (
                <Float
                    key={i}
                    speed={data.speed * 10}
                    rotationIntensity={2}
                    floatIntensity={2}
                >
                    <mesh position={data.position} rotation={data.rotation} scale={data.scale}>
                        <planeGeometry args={[1.5, 1.5, 4, 4]} />
                        <meshStandardMaterial
                            map={chipTexture}
                            transparent
                            side={THREE.DoubleSide}
                            roughness={0.6}
                            metalness={0.0}
                            color="#eab308" // Golden
                        />
                    </mesh>
                </Float>
            ))}
        </group>
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
            background: '#0f0502', // Midnight Masala (Very Dark Brown)
            color: 'white',
            padding: '180px 0',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* 3D Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                opacity: 0.4
            }}>
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 5]} intensity={1} color="#FFF" />
                    <Suspense fallback={null}>
                        <ChipRain />
                    </Suspense>
                </Canvas>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
                <div className="reveal-on-scroll" ref={revealRef}>
                    <p style={{
                        color: 'var(--brand-yellow)',
                        letterSpacing: '0.4rem',
                        fontSize: '0.9rem',
                        fontWeight: '900',
                        marginBottom: '2rem',
                        textTransform: 'uppercase'
                    }}>
                        Priority Access
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        marginBottom: '2.5rem',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        lineHeight: 1
                    }}>
                        Join the <span style={{ color: 'var(--brand-red)' }}>Crunch Club.</span>
                    </h2>
                    <p style={{
                        marginBottom: '4.5rem',
                        opacity: 0.8,
                        fontSize: '1.2rem',
                        lineHeight: 1.8,
                        maxWidth: '600px',
                        margin: '0 auto 4.5rem',
                        color: '#d6d3d1'
                    }}>
                        Get first dibs on limited edition masala drops, secret flavor trials, and exclusive invites to our tasting events.
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
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '0.8rem',
                            borderRadius: '50px', // Pill Shape
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.4s ease'
                        }}>
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL ID"
                                style={{
                                    flex: 1,
                                    padding: '0 2rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    fontWeight: '600'
                                }}
                            />
                            <button style={{
                                background: 'var(--brand-red)',
                                color: 'white',
                                padding: '1rem 3rem',
                                fontWeight: '900',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '0.9rem',
                                letterSpacing: '0.1rem',
                                cursor: 'pointer',
                                transition: 'all 0.4s ease',
                                whiteSpace: 'nowrap'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--brand-yellow)';
                                    e.currentTarget.style.color = 'black';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--brand-red)';
                                    e.currentTarget.style.color = 'white';
                                }}
                            >
                                SIGN UP 🌶️
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fade to Black at bottom to merge with footer */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100px',
                background: 'linear-gradient(to bottom, transparent, #000)'
            }} />
        </section>
    );
};

export const Footer = () => {
    return (
        <footer style={{
            background: '#000',
            color: 'white',
            padding: '80px 0 40px',
            position: 'relative',
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '4rem',
                    marginBottom: '80px'
                }}>
                    {/* Brand Column */}
                    <div style={{ maxWidth: '300px' }}>
                        <h3 style={{
                            fontSize: '2rem',
                            marginBottom: '1rem',
                            fontFamily: 'var(--font-heading)',
                            color: 'white',
                            fontWeight: 900
                        }}>
                            CRUNCH<span style={{ color: 'var(--brand-red)' }}>.</span>
                        </h3>
                        <p style={{ opacity: 0.5, lineHeight: 1.6 }}>
                            Made with ❤️ and Masala in India.
                            Delivering the ultimate crunch to the world since 1984.
                        </p>
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
                        <div>
                            <h4 style={{ color: 'var(--brand-yellow)', marginBottom: '1.5rem', fontSize: '0.9rem', letterSpacing: '0.1rem' }}>SHOP</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', opacity: 0.7 }}>
                                <a href="#">Best Sellers</a>
                                <a href="#">Variety Packs</a>
                                <a href="#">Merch</a>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--brand-yellow)', marginBottom: '1.5rem', fontSize: '0.9rem', letterSpacing: '0.1rem' }}>COMPANY</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', opacity: 0.7 }}>
                                <a href="#">Our Story</a>
                                <a href="#">Careers</a>
                                <a href="#">Wholesale</a>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--brand-yellow)', marginBottom: '1.5rem', fontSize: '0.9rem', letterSpacing: '0.1rem' }}>SOCIAL</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', opacity: 0.7 }}>
                                <a href="#">Instagram</a>
                                <a href="#">Twitter/X</a>
                                <a href="#">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    opacity: 0.4,
                    fontSize: '0.8rem'
                }}>
                    <p>© 2026 CRUNCH FOODS INDIA. ALL RIGHTS RESERVED.</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
