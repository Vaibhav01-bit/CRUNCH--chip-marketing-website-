import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = (props) => {
    const ref = useRef();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // Generate particles
    // Count: Number of particles
    // Using a "gold" palette slightly varied
    const count = isMobile ? 800 : 2000;

    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        // Brand colors (approximate RGB normalized 0-1)
        // Gold/Amber: 1.0, 0.75, 0.0 (High intensity)
        // Red/Spice: 0.9, 0.2, 0.1
        // White/Salt: 0.9, 0.9, 0.9

        const palette = [
            new THREE.Color('#F59E0B'), // Brand Orange
            new THREE.Color('#FCD34D'), // Brand Yellow
            new THREE.Color('#FFFBEB'), // Cream/Salt
            new THREE.Color('#DC2626'), // Red/Spice
        ];

        for (let i = 0; i < count; i++) {
            // Position: Spread widely on x, y, and depth
            positions[i * 3] = (Math.random() - 0.5) * 15; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15; // z

            // Color: Pick random from palette
            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        return [positions, colors];
    }, [count]);

    useFrame((state, delta) => {
        if (ref.current) {
            // Subtle rotation of the entire field
            ref.current.rotation.x -= delta / 30;
            ref.current.rotation.y -= delta / 40;

            // Mouse interaction (gentle parallax)
            const { mouse } = state;
            // Lerp towards mouse position for slight shift
            ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mouse.x * 0.5, 0.05);
            ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, mouse.y * 0.5, 0.05);
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={0.035}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
};

const CraftsmanshipScene = () => {
    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 1.5]} // Limit DPR for performance
            >
                {/* Fog for depth fading - matching dark background #0a0a0a */}
                <fog attach="fog" args={['#0a0a0a', 3, 12]} />
                <ParticleField />
            </Canvas>
        </div>
    );
};

export default CraftsmanshipScene;
