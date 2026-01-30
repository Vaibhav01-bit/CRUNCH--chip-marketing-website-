import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

const Globe = () => {
    const globeRef = useRef();

    // Key distribution points (lat, lon to cartesian)
    const points = useMemo(() => [
        { name: "London", pos: new THREE.Vector3(2, 1.5, 0.5) },
        { name: "New York", pos: new THREE.Vector3(-2, 1.2, 0.8) },
        { name: "Tokyo", pos: new THREE.Vector3(1.8, -0.5, 1.8) },
        { name: "Paris", pos: new THREE.Vector3(2.2, 1.4, -0.2) },
        { name: "Los Angeles", pos: new THREE.Vector3(-2.4, 0.8, -1.2) }
    ], []);

    useFrame((state) => {
        if (globeRef.current) {
            globeRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group ref={globeRef}>
            {/* The Globe Shell */}
            <mesh>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshStandardMaterial
                    color="#f18701"
                    wireframe
                    transparent
                    opacity={0.1}
                />
            </mesh>

            {/* The Nodes */}
            {points.map((pt, i) => (
                <group key={i} position={pt.pos}>
                    <mesh>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial
                            color="#f35b04"
                            emissive="#f35b04"
                            emissiveIntensity={2}
                        />
                    </mesh>
                    <pointLight color="#f35b04" intensity={0.5} distance={1} />

                    {/* Subtle point name (using Html) */}
                    <Html distanceFactor={10}>
                        <div style={{
                            color: 'white',
                            fontSize: '0.6rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1rem',
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap',
                            opacity: 0.8
                        }}>
                            {pt.name}
                        </div>
                    </Html>
                </group>
            ))}

            {/* Inner Core Glow */}
            <mesh>
                <sphereGeometry args={[2.3, 32, 32]} />
                <meshStandardMaterial
                    color="#f18701"
                    transparent
                    opacity={0.02}
                />
            </mesh>
        </group>
    );
};

const Retailers = () => {
    const partners = [
        "Whole Foods Market", "Erewhon", "Selfridges", "Harrods", "Dean & DeLuca", "Zabar's"
    ];

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
        <section id="store" className="retailers" style={{
            background: '#0a0a0a',
            color: 'white',
            padding: '180px 0',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ textAlign: 'center', marginBottom: '100px' }}
                    className="reveal-on-scroll"
                    ref={el => revealRefs.current[0] = el}
                >
                    <p style={{
                        color: 'var(--brand-orange)',
                        marginBottom: '2rem',
                        letterSpacing: '0.5rem',
                        fontSize: '0.8rem',
                        fontWeight: '900',
                        textTransform: 'uppercase'
                    }}>
                        Global Distribution
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        marginBottom: '4rem',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1.1,
                        fontWeight: 800
                    }}>
                        Exclusively at <span style={{ color: 'var(--brand-orange)' }}>fine</span> retailers.
                    </h2>
                    <div style={{ width: '80px', height: '1px', background: 'white', margin: '0 auto', opacity: 0.2 }} />
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '6rem',
                        alignItems: 'center'
                    }}
                >
                    {/* Left: Partner Grid */}
                    <div className="reveal-on-scroll"
                        ref={el => revealRefs.current[1] = el}
                        style={{ transitionDelay: '0.2s' }}
                    >
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '3rem',
                            textAlign: 'left'
                        }}>
                            {partners.map((partner, i) => (
                                <div key={i} style={{
                                    padding: '2rem',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    background: 'rgba(255,255,255,0.02)',
                                    backdropFilter: 'blur(10px)',
                                    fontSize: '1.1rem',
                                    fontWeight: '900',
                                    letterSpacing: '0.1rem',
                                    fontFamily: 'var(--font-heading)',
                                    color: 'rgba(255,255,255,0.6)',
                                    transition: 'all 0.4s ease',
                                    cursor: 'default'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'var(--brand-orange)';
                                        e.currentTarget.style.borderColor = 'rgba(241, 135, 1, 0.3)';
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {partner.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: 3D Visualization */}
                    <div className="reveal-on-scroll"
                        ref={el => revealRefs.current[2] = el}
                        style={{
                            height: '600px',
                            position: 'relative',
                            transitionDelay: '0.4s'
                        }}
                    >
                        <Canvas>
                            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} />
                            <Suspense fallback={null}>
                                <Globe />
                            </Suspense>
                            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                        </Canvas>

                        {/* Soft Glow Background */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '400px',
                            height: '400px',
                            background: 'radial-gradient(circle, rgba(241, 135, 1, 0.1) 0%, transparent 70%)',
                            borderRadius: '50%',
                            zIndex: -1,
                            pointerEvents: 'none'
                        }} />
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '100px', transitionDelay: '0.6s' }}
                    className="reveal-on-scroll"
                    ref={el => revealRefs.current[3] = el}
                >
                    <button style={{
                        background: 'var(--brand-red)',
                        color: 'white',
                        padding: '1.4rem 4rem',
                        fontSize: '0.85rem',
                        fontWeight: '900',
                        letterSpacing: '0.2rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.2, 0, 0.2, 1)',
                        boxShadow: '0 15px 35px rgba(243, 91, 4, 0.2)',
                        textTransform: 'uppercase'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.background = 'var(--brand-orange)';
                            e.currentTarget.style.boxShadow = '0 20px 45px rgba(241, 135, 1, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.background = 'var(--brand-red)';
                            e.currentTarget.style.boxShadow = '0 15px 35px rgba(243, 91, 4, 0.2)';
                        }}>
                        Find Your Local Stockist
                    </button>
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/assets/process-visual.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.05,
                filter: 'grayscale(1)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
        </section>
    );
};

export default Retailers;
