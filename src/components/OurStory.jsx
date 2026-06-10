import React, { useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Float, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Potato = ({ texture, position, rotation, scale, speed, depthBias }) => {
    const meshRef = useRef();
    const initialY = position[1];
    const initialX = position[0];

    // Scale and opacity based on depth (Z position) for a "fake" DOF effect
    const depthFactor = useMemo(() => {
        const factor = (position[2] + 15) / 15; // 0 to 1 range approx
        return Math.max(0.2, factor);
    }, [position]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            // Slow organic motion: Upward drift and lateral sway
            meshRef.current.position.y = initialY + Math.sin(time * 0.1 * speed + initialY) * 0.5 + (time * 0.15 * speed);
            meshRef.current.position.x = initialX + Math.sin(time * 0.12 * speed + initialX) * 0.4;

            // Complex 3-axis tumbling
            meshRef.current.rotation.z += 0.002 * speed;
            meshRef.current.rotation.x += 0.0015 * speed;
            meshRef.current.rotation.y += 0.001 * speed;

            // Seamless looping for Y (reset when too high)
            if (meshRef.current.position.y > 20) {
                meshRef.current.position.y = -20;
            }
        }
    });

    return (
        <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
                map={texture}
                transparent={true}
                opacity={0.4 + (0.5 * depthFactor)} // Fade distant ones
                alphaTest={0.05}
                roughness={0.9}
                metalness={0.05}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

const VolcanicDust = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 100 : 300;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 40;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return pos;
    }, [count]);

    const pointsRef = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (pointsRef.current) {
            pointsRef.current.rotation.y = time * 0.02;
            pointsRef.current.rotation.z = Math.sin(time * 0.05) * 0.1;
        }
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#8b4513"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.2}
            />
        </Points>
    );
};

const PotatoField = () => {
    const tex1 = useTexture('/assets/potato-whole-1.png');
    const tex2 = useTexture('/assets/potato-whole-2.png');
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const potatoes = useMemo(() => {
        const count = isMobile ? 12 : 30;
        return Array.from({ length: count }, (_, i) => ({
            texture: i % 2 === 0 ? tex1 : tex2,
            position: [
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.8) * 40,
                (Math.random() - 1) * 20
            ],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
            scale: 2 + Math.random() * 3,
            speed: 0.3 + Math.random() * 1.2
        }));
    }, [tex1, tex2, isMobile]);

    return (
        <group>
            <VolcanicDust />
            {potatoes.map((p, i) => (
                <Potato key={i} {...p} />
            ))}
        </group>
    );
};

const PotatoBackground3D = () => {
    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'var(--brand-cream)' }}>
            <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 20]} />

                {/* Bright Studio Lighting */}
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#FCD34D" />
                <pointLight position={[-10, 5, 10]} intensity={1.0} color="#fff" />
                <spotLight position={[0, 20, 0]} intensity={0.8} angle={Math.PI / 4} penumbra={1} castShadow />

                <Suspense fallback={null}>
                    <PotatoField />
                </Suspense>
            </Canvas>

            {/* Bright Gradient Overlays */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, transparent 30%, rgba(255, 251, 235, 0.4) 100%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, var(--brand-cream) 0%, transparent 10%, transparent 90%, var(--brand-cream) 100%)',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

const TiltPanel = ({ children }) => {
    const ref = useRef(null);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation (max 10 degrees)
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
        if (!ref.current) return;
        ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transition: 'transform 0.1s ease-out',
                transformStyle: 'preserve-3d',
                width: '100%',
                height: '100%'
            }}
        >
            {children}
        </div>
    );
};

const OurStory = () => {
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
        <section id="story" className="our-story" style={{
            background: 'var(--brand-cream)',
            padding: '160px 0',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Immersive Floating Potato Animation */}
            <PotatoBackground3D />

            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '4rem',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Left: Cinematic Visual Panel with Tilt */}
                <div className="reveal-on-scroll"
                    ref={el => revealRefs.current[0] = el}
                    style={{
                        height: '650px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <TiltPanel>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            background: '#f8f8f8',
                            overflow: 'hidden',
                            borderRadius: '24px',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.2), inset 0 0 0 2px rgba(255,255,255,0.5)',
                            border: '4px solid white'
                        }}>
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: 'url(/assets/story-macro.png)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'grayscale(0.1) contrast(1.05)',
                                opacity: 1,
                                zIndex: 1
                            }} />

                            {/* Vignette Overlay */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'radial-gradient(circle, transparent 40%, rgba(255,255,255,0.1) 100%)',
                                zIndex: 3
                            }} />

                            {/* Sticker Badge */}
                            <div style={{
                                position: 'absolute',
                                bottom: '2rem',
                                left: '2rem',
                                background: '#FFFFFF',
                                padding: '1rem 1.5rem',
                                borderRadius: '100px',
                                zIndex: 4,
                                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                border: '3px solid var(--brand-red)',
                                transform: 'rotate(-5deg)'
                            }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.05rem', color: 'var(--brand-red)' }}>EST. 2024</p>
                            </div>
                        </div>
                    </TiltPanel>
                </div>

                {/* Right: Modern Card */}
                <div className="reveal-on-scroll"
                    ref={el => revealRefs.current[1] = el}
                    style={{
                        textAlign: 'left',
                        transitionDelay: '0.2s',
                        background: 'rgba(255, 255, 255, 0.65)',
                        backdropFilter: 'blur(25px)',
                        padding: '3.5rem',
                        borderRadius: '32px',
                        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255,255,255,1)'
                    }}
                >
                    <div className="reveal-delay-100" style={{
                        display: 'inline-block',
                        padding: '0.6rem 1.4rem',
                        background: 'var(--brand-yellow)',
                        color: 'var(--primary-dark)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.1rem',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        marginBottom: '2.5rem',
                        borderRadius: '100px'
                    }}>
                        Born In Volcanic Soil
                    </div>

                    <h2 className="reveal-delay-200" style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        lineHeight: 1.05,
                        marginBottom: '2.5rem',
                        color: 'var(--primary-dark)',
                        letterSpacing: '-0.03em'
                    }}>
                        Crafted by <br />
                        Obsession, <br />
                        Defined by <span style={{ 
                            background: 'linear-gradient(to right, var(--brand-red), var(--brand-orange))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 2px 4px rgba(220, 38, 38, 0.3))'
                        }}>crunch</span>.
                    </h2>

                    <div style={{ width: '80px', height: '6px', background: 'var(--brand-yellow)', marginBottom: '2.5rem', borderRadius: '10px' }} />

                    <p className="reveal-delay-300" style={{
                        fontSize: '1.15rem',
                        lineHeight: 1.8,
                        color: 'var(--text-muted)',
                        marginBottom: '3.5rem',
                        maxWidth: '500px',
                        fontWeight: '400'
                    }}>
                        Our philosophy is simple: perfection takes time. From the rich, mineral-laden soil of the valley to the precise temperature of our copper kettles, every step is a deliberate act of craft.
                    </p>

                    <button 
                        className="story-btn"
                        onClick={async () => {
                            try {
                                const res = await fetch("/api/orders/checkout", { method: "POST" });
                                const data = await res.json();
                                alert(data.message);
                            } catch (error) {
                                alert("Backend server is offline. Try starting the FastAPI server!");
                            }
                        }}
                    >
                        Learn Our Craft
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .story-btn {
                    position: relative;
                    background: linear-gradient(135deg, var(--brand-red) 0%, #991b1b 100%);
                    color: white;
                    padding: 1.2rem 3.5rem;
                    font-size: 0.95rem;
                    font-weight: 800;
                    letter-spacing: 0.15rem;
                    border: none;
                    cursor: pointer;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    box-shadow: 0 15px 35px rgba(220, 38, 38, 0.3), inset 0 2px 0 rgba(255,255,255,0.2);
                    text-transform: uppercase;
                    border-radius: 100px;
                }
                .story-btn:hover {
                    transform: translateY(-5px) scale(1.02);
                    box-shadow: 0 25px 45px rgba(220, 38, 38, 0.5), inset 0 2px 0 rgba(255,255,255,0.3);
                }
                .story-btn::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%; width: 50%; height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
                    transform: skewX(-20deg);
                    transition: all 0.6s ease;
                }
                .story-btn:hover::after {
                    left: 150%;
                }
            `}} />
        </section>
    );
};

export default OurStory;
