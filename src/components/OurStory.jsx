import React, { useEffect, useRef } from 'react';

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
            background: '#fff',
            padding: '160px 0',
            overflow: 'hidden'
        }}>
            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '6rem',
                alignItems: 'center'
            }}>
                {/* Left: Cinematic Visual Panel */}
                <div className="reveal-on-scroll"
                    ref={el => revealRefs.current[0] = el}
                    style={{
                        position: 'relative',
                        height: '650px',
                        background: '#f8f8f8',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'url(/assets/story-macro.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'grayscale(0.1) contrast(1.05)',
                        opacity: 0.95,
                        zIndex: 1
                    }} />

                    {/* Vingette Overlay */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle, transparent 40%, rgba(255,255,255,0.15) 100%)',
                        zIndex: 3
                    }} />
                </div>

                {/* Right: Editorial Typography */}
                <div className="reveal-on-scroll"
                    ref={el => revealRefs.current[1] = el}
                    style={{ textAlign: 'left', transitionDelay: '0.2s' }}
                >
                    <div style={{
                        display: 'inline-block',
                        padding: '0.6rem 1.4rem',
                        border: '1px solid var(--brand-amber)',
                        color: 'var(--brand-orange)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.2rem',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        marginBottom: '3rem',
                        opacity: 0.8
                    }}>
                        Born In Volcanic Soil
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '3rem',
                        color: 'var(--primary-dark)'
                    }}>
                        Crafted by <br />
                        Obsession, <br />
                        Defined by <span style={{ color: 'var(--brand-orange)' }}>crunch</span>.
                    </h2>

                    <div style={{ width: '100px', height: '1px', background: 'var(--brand-orange)', marginBottom: '3rem', opacity: 0.4 }} />

                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: 1.8,
                        color: 'var(--text-muted)',
                        marginBottom: '4rem',
                        maxWidth: '500px',
                        fontWeight: '400'
                    }}>
                        Our philosophy is simple: perfection takes time. From the rich, mineral-laden soil of the valley to the precise temperature of our copper kettles, every step is a deliberate act of craft.
                    </p>

                    <button style={{
                        background: 'var(--brand-red)',
                        color: 'white',
                        padding: '1.2rem 3.5rem',
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
                        Learn Our Craft
                    </button>
                </div>
            </div>
        </section>
    );
};

export default OurStory;
