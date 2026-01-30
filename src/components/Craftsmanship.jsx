import React, { useEffect, useRef } from 'react';

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
            overflow: 'hidden'
        }}>
            {/* Background Texture/Image */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/assets/process-visual.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.15,
                filter: 'grayscale(0.5) contrast(1.2)',
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1.1,
                        maxWidth: '900px',
                        margin: '0 auto 3rem',
                        fontWeight: 800
                    }}>
                        A dedication to the <span style={{ color: 'var(--brand-orange)' }}>artisan</span> process.
                    </h2>
                    <div style={{ width: '80px', height: '2px', background: 'var(--brand-amber)', margin: '0 auto' }} />
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '5rem 3rem',
                    position: 'relative'
                }}>
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="reveal-on-scroll"
                            ref={el => revealRefs.current[index + 1] = el}
                            style={{
                                textAlign: 'left',
                                transitionDelay: `${index * 0.1}s`,
                                padding: '3rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.5s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(241, 135, 1, 0.2)';
                                e.currentTarget.style.transform = 'translateY(-10px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{
                                color: 'var(--brand-orange)',
                                fontSize: '0.9rem',
                                fontWeight: '900',
                                marginBottom: '2.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                letterSpacing: '0.2rem'
                            }}>
                                <span style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: 'var(--brand-orange)',
                                    boxShadow: '0 0 15px var(--brand-orange)'
                                }}></span>
                                PHASE {step.phase}
                            </div>
                            <h3 style={{
                                fontSize: '1.6rem',
                                marginBottom: '1.5rem',
                                letterSpacing: '0.05rem',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 700,
                                color: 'white'
                            }}>
                                {step.title}
                            </h3>
                            <p style={{
                                fontSize: '1.05rem',
                                color: 'rgba(255,255,255,0.6)',
                                lineHeight: 1.8,
                                fontWeight: '400'
                            }}>
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subtle Gradient Overlay at bottom */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '200px',
                background: 'linear-gradient(to top, #0a0a0a, transparent)',
                zIndex: 1
            }} />
        </section>
    );
};

export default Craftsmanship;
