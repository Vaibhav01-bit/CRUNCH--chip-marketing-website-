import React, { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, useTexture, ContactShadows, Environment, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

const Potato = ({ visible, position }) => {
    const mesh = useRef();

    useFrame((state) => {
        if (!mesh.current || !visible) return;
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.z = Math.sin(t * 1) * 0.05;
        mesh.current.position.y = position[1] + Math.sin(t * 1.5) * 0.05;
    });

    return (
        <mesh
            ref={mesh}
            position={position}
            visible={visible}
            scale={[1.1, 1.5, 1.1]}
        >
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial
                color="#8B4513"
                roughness={0.8}
                metalness={0.1}
                bumpScale={0.15}
            />
        </mesh>
    );
};

const SlicedChips = ({ visible, texture }) => {
    const group = useRef();
    const [exploded, setExploded] = useState(false);

    useEffect(() => {
        if (visible) {
            // Instant explosion state
            setExploded(true);
        } else {
            setExploded(false);
        }
    }, [visible]);

    useFrame((state) => {
        if (!group.current || !visible) return;
        // Slow rotation of the entire fanned group
        group.current.rotation.y += 0.002;
    });

    const chipsData = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => ({
            idx: i,
            // Fan out positions
            targetPos: [
                (Math.random() - 0.5) * 5,
                (i - 6) * 0.6,
                (Math.random() - 0.5) * 2
            ],
            targetRot: [
                Math.random() * 0.5,
                Math.random() * Math.PI,
                Math.random() * 0.5
            ],
            // Start tightly packed
            startPos: [0, (i - 6) * 0.1, 0]
        }));
    }, []);

    return (
        <group ref={group}>
            {chipsData.map((data, i) => (
                <ChipInstance
                    key={i}
                    data={data}
                    exploded={exploded}
                    texture={texture}
                />
            ))}
        </group>
    );
};

const ChipInstance = ({ data, exploded, texture }) => {
    const mesh = useRef();

    useFrame((state) => {
        if (!mesh.current) return;

        const targetP = exploded ? data.targetPos : data.startPos;
        const targetR = exploded ? data.targetRot : [0, 0, 0];

        // "Snappy" LERP: Faster shift for that sharp cutting feel
        const speed = exploded ? 0.15 : 1;

        mesh.current.position.lerp(new THREE.Vector3(...targetP), speed);

        mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetR[0], speed * 0.5);
        mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetR[1], speed * 0.5);
        mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, targetR[2], speed * 0.5);
    });

    return (
        <mesh ref={mesh} position={data.startPos}>
            {/* Thinner chips for sharpness */}
            <cylinderGeometry args={[1.2, 1.2, 0.05, 32]} />
            <meshStandardMaterial
                map={texture}
                roughness={0.3}
                metalness={0.1}
                color="#FCD34D"
            />
        </mesh>
    );
};

const SliceEffect = ({ active }) => {
    const ref = useRef();

    // Reset position when activated
    useEffect(() => {
        if (active && ref.current) {
            ref.current.position.set(5, 5, 2);
            ref.current.scale.set(1, 1, 1);
            ref.current.material.opacity = 0.9;
        }
    }, [active]);

    useFrame(() => {
        if (ref.current && active) {
            // Fast slash motion across screen
            ref.current.position.x -= 0.8;
            ref.current.position.y -= 0.8;
            // Stretch along motion path
            ref.current.scale.x += 0.2;
            ref.current.material.opacity -= 0.04;
        }
    });

    if (!active) return null;

    return (
        <mesh ref={ref} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[6, 0.05]} />
            <meshBasicMaterial
                color="#FFF"
                transparent
                opacity={0}
                side={THREE.DoubleSide}
                toneMapped={false} // Make it super bright
            />
        </mesh>
    );
};

const PotatoSlicerScene = () => {
    const chipTexture = useTexture('/assets/chip-single.png');

    const [state, setState] = useState('potato'); // potato | slicing | chips

    useEffect(() => {
        const loop = setInterval(() => {
            // Cycle: Potato (2s) -> Slice (0.2s) -> Chips (2.8s)
            setState('potato');
            setTimeout(() => setState('slicing'), 1500);
            setTimeout(() => setState('chips'), 1600);
        }, 5000);

        return () => clearInterval(loop);
    }, []);

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={40} />

            <ambientLight intensity={0.7} />
            <spotLight position={[10, 10, 5]} intensity={2} castShadow />
            <spotLight position={[-5, 0, 5]} intensity={1.5} color="#FFD700" />
            <Environment preset="studio" />

            <group position={[0, 0, 0]}>
                <Potato
                    visible={state === 'potato' || state === 'slicing'}
                    position={[0, 0, 0]}
                />

                <SlicedChips
                    visible={state === 'chips'}
                    texture={chipTexture}
                />

                <SliceEffect active={state === 'slicing'} />
            </group>

            <ContactShadows opacity={0.3} scale={10} blur={2.5} far={4} color="#000" />
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
            background: 'var(--brand-cream)',
            color: '#451A03', // Deep Brown Text
            padding: '160px 0',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Background Texture/Pattern could go here */}

            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '6rem',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
                maxWidth: '1300px',
                margin: '0 auto',
                padding: '0 2rem'
            }}>
                {/* Text Content */}
                <div className="flavor-content reveal-on-scroll" ref={revealRef} style={{ paddingRight: '2rem' }}>
                    <p style={{
                        color: '#DC2626', // Brand Red
                        marginBottom: '1.5rem',
                        letterSpacing: '0.4rem',
                        fontSize: '0.9rem',
                        fontWeight: '900',
                        textTransform: 'uppercase'
                    }}>
                        Sensory Explosion
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                        marginBottom: '3rem',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1,
                        fontWeight: 900,
                        color: '#451A03'
                    }}>
                        A symphony of <br />
                        <span style={{ color: '#D97706' }}>Texture</span> & <span style={{ color: '#DC2626' }}>Heat.</span>
                    </h2>

                    <div style={{
                        width: '100px',
                        height: '4px',
                        background: '#DC2626',
                        marginBottom: '3rem',
                        borderRadius: '2px'
                    }} />

                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: 1.8,
                        color: '#78350F', // Rich Brown
                        marginBottom: '2rem',
                        fontWeight: 500
                    }}>
                        Every grain of salt is hand-harvested from ancient Mediterranean pans.
                        Every chili is sun-dried for twelve days. We don't just flavor our chips;
                        we curate a sensory landscape that <span style={{ fontWeight: 800, color: '#DC2626' }}>ignites the palate</span>.
                    </p>

                    <button style={{
                        background: '#DC2626',
                        color: 'white',
                        border: 'none',
                        padding: '1rem 2rem',
                        fontSize: '1rem',
                        fontWeight: 800,
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(220, 38, 38, 0.2)',
                        transition: 'transform 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        TASTE THE HEAT 🔥
                    </button>
                </div>

                {/* 3D Visual Panel */}
                <div className="flavor-3d-panel" style={{
                    height: '600px',
                    width: '100%',
                    position: 'relative',
                    cursor: 'grab',
                    background: 'white', // Card-like background
                    borderRadius: '20px',
                    boxShadow: '0 20px 50px rgba(245, 158, 11, 0.15)', // Orange Glow Shadow
                    overflow: 'hidden'
                }}>
                    <Canvas dpr={[1, 2]}> {/* Handle high-DPI screens */}
                        <PotatoSlicerScene />
                    </Canvas>

                    {/* "Interactive" hints */}
                    <div style={{
                        position: 'absolute', bottom: '20px', right: '30px',
                        fontWeight: 800, color: '#DC2626', fontSize: '0.8rem',
                        letterSpacing: '0.1rem', pointerEvents: 'none'
                    }}>
                        FRESHLY SLICED
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlavorExperience;
