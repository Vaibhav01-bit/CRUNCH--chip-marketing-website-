import React, { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, PerspectiveCamera, Points, PointMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const FloatingChips = () => {
    const chipTexture = useTexture('/assets/chip-single.png');
    const chipsCount = 5;

    const chips = useMemo(() => {
        return Array.from({ length: chipsCount }).map((_, i) => ({
            position: [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, Math.random() * 2],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
            scale: 0.8 + Math.random() * 0.5,
            speed: 0.2 + Math.random() * 0.3
        }));
    }, []);

    return (
        <group>
            {chips.map((data, i) => (
                <Float
                    key={i}
                    speed={data.speed * 4}
                    rotationIntensity={1.5}
                    floatIntensity={2}
                >
                    <mesh position={data.position} rotation={data.rotation} scale={data.scale}>
                        <planeGeometry args={[1.5, 1.5]} />
                        <meshStandardMaterial
                            map={chipTexture}
                            transparent
                            alphaTest={0.5}
                            side={THREE.DoubleSide}
                            roughness={0.4}
                            metalness={0.1}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

const SaltParticles = () => {
    const count = 2000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return pos;
    }, []);

    const pointsRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (pointsRef.current) {
            pointsRef.current.rotation.y = time * 0.05;
            pointsRef.current.rotation.x = time * 0.02;
        }
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#ffffff"
                size={0.015}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.4}
            />
        </Points>
    );
};

const Scene3D = () => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} color="#f18701" />
            <directionalLight position={[-5, -5, 5]} intensity={1} color="#f35b04" />

            <Suspense fallback={null}>
                <FloatingChips />
                <SaltParticles />
            </Suspense>

            {/* Soft heat wave effect - subtle light distortion */}
            <mesh position={[0, 0, -2]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial
                    color="#000000"
                    emissive="#f18701"
                    emissiveIntensity={0.02}
                    transparent
                    opacity={1}
                />
            </mesh>
        </>
    );
};

const FlavorExperience = () => {
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
        <section className="flavor-experience" style={{
            background: '#000',
            color: 'white',
            padding: '180px 0',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '10rem',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2
            }}>
                <div className="flavor-content reveal-on-scroll" ref={revealRef}>
                    <p style={{
                        color: 'var(--brand-orange)',
                        marginBottom: '2rem',
                        letterSpacing: '0.5rem',
                        fontSize: '0.8rem',
                        fontWeight: '900',
                        textTransform: 'uppercase'
                    }}>
                        Sensory Impact
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        marginBottom: '4rem',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1.1,
                        fontWeight: 800
                    }}>
                        A symphony of <span style={{ color: 'var(--brand-orange)' }}>texture</span> <br />and heat.
                    </h2>
                    <div style={{
                        width: '80px',
                        height: '1px',
                        background: 'var(--brand-orange)',
                        marginBottom: '4rem',
                        opacity: 0.5
                    }} />
                    <p style={{
                        fontSize: '1.25rem',
                        lineHeight: 1.8,
                        color: 'rgba(255,255,255,0.7)',
                        maxWidth: '550px',
                        fontWeight: '400'
                    }}>
                        Every grain of salt is hand-harvested from ancient Mediterranean pans. Every chili is sun-dried for twelve days. We don't just flavor our chips; we curate a sensory landscape that ignites the palate and lingers in the memory.
                    </p>
                </div>

                <div className="flavor-3d-panel" style={{
                    height: '600px',
                    width: '100%',
                    position: 'relative',
                    cursor: 'grab'
                }}>
                    <Canvas>
                        <Scene3D />
                    </Canvas>

                    {/* Vignette for the 3D scene */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)',
                        pointerEvents: 'none',
                        zIndex: 1
                    }} />
                </div>
            </div>
        </section>
    );
};

export default FlavorExperience;
