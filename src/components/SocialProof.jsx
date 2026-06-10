import React from 'react';
import WavyDivider from './WavyDivider';

const reviews = [
    { text: "MIRCHI SE BHI TEZ 🌶️", author: "Rahul K. (Mumbai)" },
    { text: "OBSESSED. BEST CHIP IN NYC.", author: "Sarah J. (New York)" },
    { text: "ONE PACKET IS NEVER ENOUGH YAAR", author: "Anjali M. (Delhi)" },
    { text: "CRUNCH LEVELS: CRITICAL ⚠️", author: "Mike T. (London)" },
    { text: "MAZA AA GAYA BOSS!", author: "Siddarth P. (Bangalore)" }
];

const SocialProof = () => {
    return (
        <section style={{
            background: 'linear-gradient(135deg, var(--brand-red) 0%, #7f1d1d 100%)',
            padding: '100px 0',
            position: 'relative',
            overflow: 'hidden',
            color: 'white'
        }}>
            <WavyDivider position="top" color="var(--brand-yellow)" />

            {/* Background floating elements */}
            <div style={{
                position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px',
                background: 'var(--brand-orange)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.3, zIndex: 1
            }} />
            <div style={{
                position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px',
                background: 'var(--brand-yellow)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.2, zIndex: 1
            }} />

            <div style={{ textAlign: 'center', marginBottom: '60px', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ color: 'var(--brand-yellow)', fontSize: '1.8rem', filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' }}>★</span>
                    ))}
                </div>
                <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    lineHeight: 1.1,
                    textShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                    The Crunch Community
                </h2>
                <p style={{ fontSize: '1.1rem', opacity: 0.8, marginTop: '1rem', fontWeight: 500 }}>
                    Join thousands of flavor-obsessed snackers.
                </p>
            </div>

            {/* Marquee Container */}
            <div className="marquee-wrapper" style={{
                display: 'flex',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                position: 'relative',
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                zIndex: 2,
                padding: '20px 0'
            }}>
                <div className="marquee-track" style={{
                    display: 'flex',
                    gap: '40px',
                    paddingLeft: '40px'
                }}>
                    {[...reviews, ...reviews, ...reviews].map((review, i) => (
                        <div key={i} className="review-card" style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            color: '#1a1a1a',
                            padding: '2rem 2.5rem',
                            borderRadius: '24px',
                            minWidth: '380px',
                            transform: i % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.8)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            border: '1px solid rgba(255,255,255,0.5)',
                            transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                            cursor: 'pointer'
                        }}>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem', color: 'var(--brand-orange)', fontSize: '1.2rem' }}>
                                ★★★★★
                            </div>
                            <p style={{
                                fontSize: '1.2rem',
                                fontWeight: 800,
                                fontStyle: 'italic',
                                marginBottom: '1rem',
                                textTransform: 'uppercase',
                                lineHeight: 1.4,
                                color: 'var(--brand-red)'
                            }}>
                                "{review.text}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--brand-red)' }}>
                                    {review.author.charAt(0)}
                                </div>
                                <span style={{ fontSize: '0.95rem', fontWeight: 600, opacity: 0.8 }}>{review.author}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .marquee-track {
                    animation: scroll 25s linear infinite;
                }
                .marquee-wrapper:hover .marquee-track {
                    animation-play-state: paused;
                }
                .review-card:hover {
                    transform: translateY(-10px) rotate(0deg) scale(1.02) !important;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,1) !important;
                    z-index: 10;
                }
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
            `}} />

            <WavyDivider position="bottom" color="var(--brand-cream)" />
        </section>
    );
};

export default SocialProof;
