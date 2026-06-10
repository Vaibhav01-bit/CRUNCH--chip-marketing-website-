import React, { useEffect, useState } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    return (
        <nav style={{
            position: 'fixed',
            top: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '3rem',

            // PREMIUM GLASSMORPHISM
            width: scrolled ? 'auto' : '90%',
            maxWidth: '1100px',
            padding: scrolled ? '0.7rem 2rem' : '1.5rem 2rem',
            borderRadius: '100px',
            background: scrolled ? 'rgba(15, 15, 15, 0.45)' : 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: scrolled ? '0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)' : 'none',
            transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}>
            {/* LOGO */}
            <div style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: scrolled ? '1.3rem' : '1.6rem',
                letterSpacing: '0.15rem',
                color: 'white',
                userSelect: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                display: 'flex',
                alignItems: 'center'
            }}>
                CRUNCH<span style={{ color: 'var(--brand-red)', textShadow: '0 0 10px rgba(220, 38, 38, 0.5)' }}>.</span>
            </div>

            {/* LINKS */}
            <div className="desktop-links" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                {['FLAVORS', 'STORY', 'RETAILERS'].map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="nav-item"
                        style={{
                            textDecoration: 'none',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            letterSpacing: '0.15rem',
                            opacity: 0.7,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            padding: '0.5rem 0'
                        }}
                    >
                        {item}
                    </a>
                ))}
            </div>

            {/* CTA */}
            <a href="#store" className="nav-cta" style={{
                textDecoration: 'none',
                background: 'linear-gradient(135deg, var(--brand-red), #991b1b)',
                color: 'white',
                padding: scrolled ? '0.7rem 1.6rem' : '0.9rem 2rem',
                borderRadius: '100px',
                fontWeight: 900,
                fontSize: '0.8rem',
                letterSpacing: '0.1rem',
                transition: 'all 0.4s ease',
                boxShadow: '0 10px 20px rgba(220, 38, 38, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                GRAB A BAG
            </a>

            {/* Custom Styles for Nav Items */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .nav-item:hover {
                    opacity: 1 !important;
                    transform: translateY(-2px);
                }
                .nav-item::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: var(--brand-red);
                    transition: width 0.3s ease;
                    box-shadow: 0 0 10px var(--brand-red);
                }
                .nav-item:hover::after {
                    width: 100%;
                }
                .nav-cta:hover {
                    transform: scale(1.05) translateY(-2px);
                    box-shadow: 0 15px 30px rgba(220, 38, 38, 0.4);
                }
                
                @media (max-width: 768px) {
                    .desktop-links {
                        display: none !important;
                    }
                    nav {
                        width: 92% !important;
                        justify-content: space-between !important;
                        padding: 0.8rem 1.5rem !important; 
                        top: 1rem !important;
                    }
                }
            `}} />
        </nav>
    );
};

export default Navbar;
