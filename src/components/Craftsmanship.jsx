import React, { useEffect, useRef } from 'react';
import CraftsmanshipScene from './CraftsmanshipScene';

const Craftsmanship = () => {
    const revealRefs = useRef([]);
    const steps = [
        {
            phase: "01",
            title: "THE SELECTION",
            desc: "Only the densest, mineral-rich potatoes from volcanic soil heritage farms are selected for their gold-standard texture."
        },
        {
            phase: "02",
            title: "THE MICRON SLICE",
            desc: "Precision-cut to a specific thickness of 1.2mm, ensuring the structural integrity of the ultimate artisan crunch."
        },
        {
            phase: "03",
            title: "KETTLE REFINEMENT",
            desc: "Small-batch cooked in cold-pressed copper kettles, where fluctuating temperatures create deep, complex layers of flavor."
        },
        {
            phase: "04",
            title: "THE FINISHING",
            desc: "Hand-dusted at peak heat with sun-evaporated sea salts and botanical spices curated for sensory impact."
        }
    ];

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
        <section id="craft" className="craftsmanship" style={{
            background: '#0a0a0a',
            color: 'white',
            padding: '180px 0',
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            {/* 3D Background */}
            <CraftsmanshipScene />

            {/* Content Container */}
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '120px' }}
                    className="reveal-on-scroll"
                    ref={el => revealRefs.current[0] = el}
                >
                    <p style={{
                        color: 'var(--brand-orange)',
                        letterSpacing: '0.5rem',
                        fontSize: '0.8rem',
                        fontWeight: '900',
                        marginBottom: '2rem',
                        textTransform: 'uppercase'
                    }}>
                        The Craftsmanship
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1.1,
                        maxWidth: '900px',
                        margin: '0 auto 3rem',
                        fontWeight: 800,
                        background: 'linear-gradient(to right, #ffffff, #e2e2e2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}>
                        A dedication to the <span style={{
                            background: 'linear-gradient(to right, var(--brand-orange), var(--brand-yellow))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.4))'
                        }}>artisan</span> process.
                    </h2>
                    <div style={{ width: '80px', height: '2px', background: 'var(--brand-amber)', margin: '0 auto', opacity: 0.5 }} />
                </div>

                {/* Staggered Grid Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '4rem 2rem',
                    position: 'relative'
                }}>
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="reveal-on-scroll craft-card"
                            ref={el => revealRefs.current[index + 1] = el}
                            style={{
                                transitionDelay: `${index * 0.15}s`,
                            }}
                        >
                            {/* Hover Indicator Line */}
                            <div className="phase-indicator" />
                            
                            {/* Large Background Number */}
                            <div className="phase-bg-num">{step.phase}</div>

                            <div style={{
                                color: 'var(--brand-orange)',
                                fontSize: '0.85rem',
                                fontWeight: '900',
                                marginBottom: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                letterSpacing: '0.2rem',
                                opacity: 0.9,
                                position: 'relative',
                                zIndex: 2
                            }}>
                                <span className="phase-dot"></span>
                                PHASE {step.phase}
                            </div>
                            <h3 style={{
                                fontSize: '1.6rem',
                                marginBottom: '1.2rem',
                                letterSpacing: '0.02rem',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 700,
                                color: 'white',
                                position: 'relative',
                                zIndex: 2
                            }}>
                                {step.title}
                            </h3>
                            <p style={{
                                fontSize: '1.05rem',
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: 1.7,
                                fontWeight: '400',
                                position: 'relative',
                                zIndex: 2
                            }}>
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gradient Overlay for Depth */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '30%',
                background: 'linear-gradient(to bottom, #0a0a0a, transparent)',
                zIndex: 2,
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '30%',
                background: 'linear-gradient(to top, #0a0a0a, transparent)',
                zIndex: 2,
                pointerEvents: 'none'
            }} />

            <style dangerouslySetInnerHTML={{
                __html: `
                .craft-card {
                    text-align: left;
                    padding: 3.5rem 2.5rem;
                    background: rgba(25, 25, 25, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    backdrop-filter: blur(12px);
                    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                .craft-card:hover {
                    background: rgba(40, 40, 40, 0.6);
                    border-color: rgba(245, 158, 11, 0.5);
                    transform: translateY(-10px) scale(1.02);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(245,158,11,0.05);
                }
                .phase-indicator {
                    position: absolute; top: 0; left: 0; height: 3px; width: 0%;
                    background: linear-gradient(90deg, var(--brand-orange), var(--brand-yellow));
                    transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
                    z-index: 3;
                }
                .craft-card:hover .phase-indicator {
                    width: 100%;
                    box-shadow: 0 0 15px var(--brand-orange);
                }
                .phase-dot {
                    width: 8px; height: 8px; border-radius: 50%;
                    background: currentColor;
                    box-shadow: 0 0 10px var(--brand-orange);
                    transition: all 0.3s ease;
                }
                .craft-card:hover .phase-dot {
                    transform: scale(1.5);
                    box-shadow: 0 0 15px var(--brand-yellow);
                    background: var(--brand-yellow);
                }
                .phase-bg-num {
                    position: absolute;
                    bottom: -20px;
                    right: 10px;
                    font-size: 8rem;
                    font-weight: 900;
                    font-family: var(--font-heading);
                    color: rgba(255, 255, 255, 0.03);
                    line-height: 1;
                    z-index: 1;
                    transition: all 0.5s ease;
                }
                .craft-card:hover .phase-bg-num {
                    color: rgba(245, 158, 11, 0.08);
                    transform: scale(1.1) rotate(-5deg);
                }
            `}} />
        </section>
    );
};

export default Craftsmanship;
