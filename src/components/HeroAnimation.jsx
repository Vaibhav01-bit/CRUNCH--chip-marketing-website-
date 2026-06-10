import React, { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Float, PerspectiveCamera, Points, PointMaterial, Environment, Center } from '@react-three/drei';
import * as THREE from 'three';

const SpiceDust = ({ count = 600 }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 40;
            p[i * 3 + 1] = (Math.random() - 0.5) * 40;
            p[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return p;
    }, [count]);

    const pointsRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (pointsRef.current) {
            pointsRef.current.rotation.y = time * 0.03;
            pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
        }
    });

    return (
        <Points ref={pointsRef} positions={points} stride={3}>
            <PointMaterial
                transparent
                color="#f59e0b"
                size={0.035}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.4}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

const FloatingObject = ({ texturePath, scrollProgress, index, speed = 1, rotationIntensity = 1, floatIntensity = 1, initialPos = [0, 0, 0], scale = 1 }) => {
    const texture = useTexture(texturePath);
    const meshRef = useRef();
    const { viewport, mouse } = useThree();

    useFrame((state) => {
        if (!meshRef.current) return;

        // Base floating pos
        const time = state.clock.getElapsedTime() + index * 100;
        const xOffset = Math.sin(time * 0.5 * speed) * 0.2;
        const yOffset = Math.cos(time * 0.3 * speed) * 0.2;
        
        // Mouse follow tilt
        const targetX = (mouse.x * viewport.width) / (10 + index * 2);
        const targetY = (mouse.y * viewport.height) / (10 + index * 2);
        
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY, 0.05);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX, 0.05);

        // Scroll behavior
        const p = scrollProgress.current;
        meshRef.current.position.y = initialPos[1] + yOffset - p * (20 + index * 5);
        meshRef.current.position.x = initialPos[0] + xOffset;
        meshRef.current.position.z = initialPos[2] + p * 5;
        
        meshRef.current.rotation.z += p * 0.05 + 0.002;
    });

    return (
        <Float speed={speed * 1.5} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
            <mesh ref={meshRef} position={initialPos} scale={[scale, scale, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshStandardMaterial 
                    map={texture} 
                    transparent 
                    alphaTest={0.05} 
                    side={THREE.DoubleSide}
                    roughness={0.3}
                    metalness={0.1}
                />
            </mesh>
        </Float>
    );
};

const EnvironmentalGlow = () => {
    const lightRef = useRef();
    const { viewport, mouse } = useThree();

    useFrame((state) => {
        if (!lightRef.current) return;
        const time = state.clock.getElapsedTime();
        
        // Pulse intensity and shift color slightly
        lightRef.current.intensity = 60 + Math.sin(time * 2) * 20;
        
        // Follow mouse but with delay (smooth)
        const x = (mouse.x * viewport.width) / 3;
        const y = (mouse.y * viewport.height) / 3;
        
        lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, x, 0.05);
        lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, y, 0.05);
        lightRef.current.position.z = 6;
    });

    return (
        <pointLight
            ref={lightRef}
            intensity={80}
            color="#dc2626"
            distance={25}
            decay={2}
        />
    );
};

const HeroAnimation = () => {
    const scrollProgress = useRef(0);
    const overlayRef = useRef();
    const canvasContainerRef = useRef();
    const [isInView, setIsInView] = React.useState(true);
    const [isMobile, setIsMobile] = React.useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Use Lenis for scroll if available, otherwise fallback to window
        const handleScroll = (e) => {
            const p = e.progress || Math.max(0, Math.min(window.scrollY / window.innerHeight, 1));
            scrollProgress.current = p;

            if (overlayRef.current) {
                overlayRef.current.style.opacity = 1 - p * 2;
                overlayRef.current.style.transform = `translate3d(-50%, -50%, 0) translateY(${-p * 150}px) scale(${1 - p * 0.1})`;
            }
        };

        if (window.lenis) {
            window.lenis.on('scroll', handleScroll);
        } else {
            window.addEventListener('scroll', () => handleScroll({ progress: window.scrollY / window.innerHeight }), { passive: true });
        }

        // Intersection Observer to pause rendering
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0 }
        );
        if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);

        return () => {
            if (window.lenis) window.lenis.off('scroll', handleScroll);
            observer.disconnect();
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Scene objects configuration
    const chips = [
        { initialPos: [0, 0, 0], scale: 7, speed: 1 }, // Main center chip
        { initialPos: [-5, 3, -4], scale: 4, speed: 0.8 }, // Top left
        { initialPos: [6, -2, -3], scale: 5, speed: 1.2 }, // Bottom right
        { initialPos: [-4, -4, -6], scale: 3, speed: 0.7 }, // Back left
        { initialPos: [5, 4, -5], scale: 3.5, speed: 0.9 }, // Top right
        { initialPos: [-7, -1, -4], scale: 4, speed: 1.1 }, // Mid left
    ];

    return (
        <section 
            ref={canvasContainerRef}
            className="hero-3d" 
            style={{ 
                height: '160vh', 
                position: 'relative', 
                background: '#020202',
                overflow: 'hidden'
            }}
        >
            <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%' }}>
                <Canvas dpr={[1, 1]} frameloop={isInView ? "always" : "never"}>
                    <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={35} />
                    
                    <ambientLight intensity={0.4} />
                    <EnvironmentalGlow />
                    <pointLight position={[-10, 5, 10]} intensity={40} color="#f59e0b" />
                    
                    <Suspense fallback={null}>
                        {chips.map((chip, i) => (
                            <FloatingObject 
                                key={`chip-${i}`}
                                index={i}
                                texturePath="/assets/chip-single.png"
                                scrollProgress={scrollProgress}
                                {...chip}
                            />
                        ))}
                        <SpiceDust count={isMobile ? 100 : 200} />
                        <Environment preset="night" />
                    </Suspense>
                </Canvas>

                {/* Overlay UI */}
                <div 
                    ref={overlayRef}
                    style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%', textAlign: 'center', zIndex: 10,
                        pointerEvents: 'none', color: 'white', padding: '0 2rem',
                        willChange: 'opacity, transform'
                    }}
                >
                    <div className="fade-up delay-1" style={{
                        display: 'inline-block', padding: '0.7rem 1.8rem',
                        background: 'rgba(220, 38, 38, 0.1)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(220, 38, 38, 0.3)',
                        borderRadius: '100px', color: 'var(--brand-red)',
                        fontSize: '0.8rem', fontWeight: 900,
                        letterSpacing: '0.3rem', textTransform: 'uppercase',
                        marginBottom: '2.5rem',
                        boxShadow: '0 10px 30px rgba(220, 38, 38, 0.2)'
                    }}>
                        Original Recipe • Indian Soul
                    </div>

                    <h1 className="fade-up delay-2" style={{
                        fontSize: 'clamp(3.5rem, 10vw, 8.5rem)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900, lineHeight: 0.85,
                        letterSpacing: '-0.05em', marginBottom: '3rem',
                        textShadow: '0 30px 60px rgba(0,0,0,0.6)'
                    }}>
                        GLOBAL <span style={{ color: 'var(--brand-red)' }}>CRUNCH.</span><br />
                        DESI SOUL.
                    </h1>

                    <p className="fade-up delay-3" style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                        maxWidth: '550px', margin: '0 auto',
                        color: 'rgba(255,255,255,0.7)', lineHeight: 1.6,
                        fontWeight: 500, letterSpacing: '0.01em'
                    }}>
                        Hand-harvested volcanic potatoes. Spiced with pure Desi Masala.
                        Crafted for the bold.
                    </p>

                    <div className="fade-up delay-4" style={{ pointerEvents: 'auto' }}>
                        <button className="hero-btn">
                            Explore Flavors
                        </button>
                    </div>
                </div>

                {/* Advanced Scroll Indicator */}
                <div style={{
                    position: 'absolute', bottom: '3rem', left: '50%',
                    transform: 'translateX(-50%)', zIndex: 10, textAlign: 'center'
                }}>
                    <div className="scroll-indicator" style={{
                        width: '2px', height: '80px',
                        background: 'linear-gradient(to bottom, var(--brand-red), transparent)',
                        margin: '0 auto 1.5rem',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        <div className="scroll-line-anim" />
                    </div>
                    <span style={{
                        fontSize: '0.65rem', fontWeight: 900,
                        color: 'rgba(255,255,255,0.3)', letterSpacing: '0.5rem',
                        textTransform: 'uppercase'
                    }}>
                        Scroll
                    </span>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .scroll-line-anim {
                        position: absolute; top: 0; left: 0; width: 100%; height: 40px;
                        background: linear-gradient(to bottom, transparent, #fff, transparent);
                        animation: scrollLine 2s infinite ease-in-out;
                    }
                    @keyframes scrollLine {
                        0% { transform: translateY(-100%); }
                        100% { transform: translateY(200%); }
                    }
                    .fade-up {
                        opacity: 0;
                        transform: translateY(30px);
                        animation: fadeUpAnim 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                    .delay-1 { animation-delay: 0.2s; }
                    .delay-2 { animation-delay: 0.4s; }
                    .delay-3 { animation-delay: 0.6s; }
                    .delay-4 { animation-delay: 0.8s; }
                    
                    @keyframes fadeUpAnim {
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .hero-btn {
                        position: relative;
                        display: inline-block;
                        padding: 1rem 2.5rem;
                        background: linear-gradient(135deg, var(--brand-red) 0%, #991b1b 100%);
                        color: white;
                        font-weight: 800;
                        font-size: 1.1rem;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                        border-radius: 100px;
                        border: none;
                        cursor: pointer;
                        overflow: hidden;
                        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3), inset 0 2px 0 rgba(255,255,255,0.2);
                        margin-top: 2rem;
                    }
                    .hero-btn:hover {
                        transform: translateY(-5px) scale(1.02);
                        box-shadow: 0 20px 40px rgba(220, 38, 38, 0.5), inset 0 2px 0 rgba(255,255,255,0.3);
                    }
                    .hero-btn::after {
                        content: '';
                        position: absolute;
                        top: 0; left: -100%; width: 50%; height: 100%;
                        background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
                        transform: skewX(-20deg);
                        transition: all 0.6s ease;
                    }
                    .hero-btn:hover::after {
                        left: 150%;
                    }
                `}} />
            </div>
        </section>
    );
};

export default HeroAnimation;
