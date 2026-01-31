import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import * as THREE from 'three';

const RetailerGlobe = () => {
    const globeRef = useRef();

    // Key "Crunch Locations"
    const points = useMemo(() => [
        { position: [1.2, 0.8, 1], label: "NY" },
        { position: [-1.5, 0.5, 1.2], label: "LA" },
        { position: [0.5, 1.5, -0.5], label: "LDN" },
        { position: [1.2, 0.2, 1.2], label: "MUMBAI" }, // Added India
        { position: [2, 0, 0], label: "TKYO" },
    ], []);

    useFrame((state) => {
        if (globeRef.current) {
            globeRef.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={globeRef}>
            {/* Core Globe - Light Orange Tint */}
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshStandardMaterial
                    color="#FFDEAD" // NavajoWhite
                    metalness={0.1}
                    roughness={0.5}
                    wireframe={false}
                    transparent
                    opacity={0.1}
                />
            </mesh>

            {/* Wireframe Overlay - Bold Orange */}
            <mesh scale={[1.001, 1.001, 1.001]}>
                <sphereGeometry args={[2, 32, 32]} />
                <meshStandardMaterial
                    color="#DC2626"
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Glowing Hotspots */}
            {points.map((pt, i) => (
                <Float key={i} speed={2} rotationIntensity={0} floatIntensity={0.5}>
                    <group position={pt.position} rotation={[0, 0, 0]}>
                        <mesh>
                            <sphereGeometry args={[0.12, 16, 16]} />
                            <meshStandardMaterial
                                color="#DC2626"
                                emissive="#B91C1C"
                                emissiveIntensity={2}
                            />
                        </mesh>
                        <Html distanceFactor={10}>
                            <div style={{
                                color: '#78350F',
                                fontWeight: 900,
                                fontSize: '0.6rem',
                                background: 'rgba(255,255,255,0.9)',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                pointerEvents: 'none',
                                whiteSpace: 'nowrap'
                            }}>
                                {pt.label}
                            </div>
                        </Html>
                    </group>
                </Float>
            ))}
        </group>
    );
};

const Retailers = () => {
    const stores = [
        "Whole Foods", "Blinkit", "7-Eleven",
        "Zepto", "Target", "Swiggy Instamart"
    ];

    return (
        <section id="store" style={{
            background: 'linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)', // Cream to Light Yellow
            color: '#451A03',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                minHeight: '80vh',
                alignItems: 'center'
            }}>

                {/* LEFT: UI CONTENT */}
                <div style={{ padding: '4rem', paddingRight: '2rem', zIndex: 10 }}>
                    <p style={{ color: '#DC2626', fontWeight: 900, letterSpacing: '0.2rem', marginBottom: '1rem' }}>
                        GLOBAL DISTRIBUTION
                    </p>
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                        lineHeight: 0.9,
                        marginBottom: '3rem',
                        color: 'var(--primary-dark)'
                    }}>
                        WORLDWIDE<br />
                        <span style={{ color: '#F59E0B' }}>CRUNCH.</span>
                    </h2>

                    {/* Stores Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1.5rem',
                        marginBottom: '4rem'
                    }}>
                        {stores.map((store, i) => (
                            <div key={i} className="store-card" style={{
                                padding: '1.5rem',
                                border: '2px solid rgba(245, 158, 11, 0.2)',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.6)',
                                backdropFilter: 'blur(5px)',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                cursor: 'default'
                            }}>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#78350F' }}>
                                    {store}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <button style={{
                            background: '#DC2626',
                            color: 'white',
                            border: 'none',
                            padding: '1.2rem 2.5rem',
                            fontSize: '1rem',
                            fontWeight: 900,
                            borderRadius: '50px',
                            boxShadow: '0 10px 30px rgba(220, 38, 38, 0.2)',
                            cursor: 'pointer'
                        }}>
                            FIND NEAR ME 📍
                        </button>
                        <button style={{
                            background: 'white',
                            color: '#451A03',
                            border: '3px solid #451A03',
                            padding: '1.2rem 2.5rem',
                            fontSize: '1rem',
                            fontWeight: 900,
                            borderRadius: '50px',
                            cursor: 'pointer'
                        }}>
                            ORDER ONLINE
                        </button>
                    </div>
                </div>

                {/* RIGHT: 3D GLOBE */}
                <div style={{ height: '100%', minHeight: '600px', position: 'relative' }}>
                    {/* Background Sun/Glow */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '500px', height: '500px',
                        background: 'radial-gradient(circle, rgba(252, 211, 77, 0.4) 0%, transparent 70%)', // Yellow Glow
                        borderRadius: '50%',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }} />

                    <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                        <ambientLight intensity={0.8} />
                        <pointLight position={[10, 10, 10]} intensity={1} color="#FFF" />

                        <Suspense fallback={null}>
                            <RetailerGlobe />
                            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} />
                        </Suspense>
                    </Canvas>
                </div>
            </div>

            {/* CSS for Store Cards hover */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .store-card:hover {
                    background: #FFF !important;
                    border-color: #DC2626 !important;
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(245, 158, 11, 0.2);
                }
                @media (max-width: 900px) {
                    #store > div { grid-template-columns: 1fr !important; }
                    #store canvas { height: 400px !important; }
                }
            `}} />
        </section>
    );
};

export default Retailers;
