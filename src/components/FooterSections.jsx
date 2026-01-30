import React from 'react';

export const Newsletter = () => {
    return (
        <section className="newsletter" style={{
            background: '#0a0a0a',
            color: 'white',
            padding: '180px 0',
            textAlign: 'center'
        }}>
            <div className="container" style={{ maxWidth: '700px' }}>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Join the Inner Circle.</h2>
                <p style={{ marginBottom: '3.5rem', opacity: 0.6, fontSize: '1.1rem', lineHeight: 1.6 }}>Exclusive access to limited-run seasonal harvests and artisan collaborations.</p>
                <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '0px' }}>
                    <input
                        type="email"
                        placeholder="EMAIL ADDRESS"
                        style={{
                            flex: 1,
                            padding: '1.2rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            letterSpacing: '0.2rem',
                            fontSize: '0.8rem'
                        }}
                    />
                    <button style={{
                        background: 'var(--brand-red)',
                        color: 'white',
                        padding: '1rem 3rem',
                        fontWeight: 'bold',
                        border: 'none',
                        fontSize: '0.8rem',
                        letterSpacing: '0.1rem',
                        boxShadow: '0 10px 20px rgba(243, 91, 4, 0.2)'
                    }}>
                        SUBSCRIBE
                    </button>
                </div>
            </div>
        </section>
    );
};

export const Footer = () => {
    return (
        <footer style={{ background: '#000', color: 'white', padding: '100px 0 50px' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '100px' }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--brand-orange)', fontWeight: 900 }}>CRUNCH.</h3>
                        <p style={{ opacity: 0.5, lineHeight: 1.8, fontSize: '0.9rem' }}>
                            Architecting the ultimate sensory experience since 1984. Hand-harvested, kettle-cooked, and defined by the crunch.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '0.75rem', letterSpacing: '0.2rem', opacity: 0.9 }}>SHOP</h4>
                        <div style={{ opacity: 0.5, display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                            <span>Collections</span>
                            <span>Limited Editions</span>
                            <span>Retail Partners</span>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '0.75rem', letterSpacing: '0.2rem', opacity: 0.9 }}>DISCOVER</h4>
                        <div style={{ opacity: 0.5, display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                            <span>Our Story</span>
                            <span>Sourcing</span>
                            <span>Contact</span>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '0.75rem', letterSpacing: '0.2rem', opacity: 0.9 }}>FOLLOW</h4>
                        <div style={{ opacity: 0.5, display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                            <span>Instagram</span>
                            <span>Twitter</span>
                            <span>Vimeo</span>
                        </div>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', opacity: 0.3, fontSize: '0.7rem', letterSpacing: '0.1rem' }}>
                    <p>© 2026 ANTIGRAVITY ARTISANS. ALL RIGHTS RESERVED.</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <span>PRIVACY POLICY</span>
                        <span>TERMS OF SERVICE</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
