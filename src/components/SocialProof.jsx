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
            background: 'var(--brand-red)',
            padding: '80px 0',
            position: 'relative',
            overflow: 'hidden',
            color: 'white'
        }}>
            <WavyDivider position="top" color="var(--brand-yellow)" />

            <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 2 }}>
                <p style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    The Crunch Community
                </p>
                <div style={{ fontSize: '3rem', lineHeight: 1 }}>⭐⭐⭐⭐⭐</div>
            </div>

            {/* Marquee Container */}
            <div style={{
                display: 'flex',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                position: 'relative',
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}>
                <div style={{
                    display: 'flex',
                    animation: 'scroll 20s linear infinite',
                    gap: '40px',
                    paddingLeft: '40px'
                }}>
                    {[...reviews, ...reviews, ...reviews].map((review, i) => (
                        <div key={i} style={{
                            background: 'white',
                            color: 'var(--brand-red)',
                            padding: '1.5rem 2rem',
                            borderRadius: '50px',
                            minWidth: '300px',
                            transform: i % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <p style={{
                                fontSize: '1.1rem',
                                fontWeight: 800,
                                fontStyle: 'italic',
                                marginBottom: '0.5rem',
                                textTransform: 'uppercase'
                            }}>
                                "{review.text}"
                            </p>
                            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>— {review.author}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}} />

            <WavyDivider position="bottom" color="var(--brand-cream)" />
        </section>
    );
};

export default SocialProof;
