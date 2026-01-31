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
        window.addEventListener('scroll', handleScroll);
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
            justifyContent: 'center', // Center everything
            alignItems: 'center',
            gap: '3rem',

            // DYNAMIC STYLING
            width: scrolled ? 'auto' : '90%', // Start wide (transparent), shrink to pill
            maxWidth: '1000px',
            padding: scrolled ? '0.6rem 1.5rem' : '1.5rem 0', // Compact when scrolled
            borderRadius: '100px',
            background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent', // Clear -> White Glass
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            boxShadow: scrolled ? '0 5px 20px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
        }}>
            {/* LOGO */}
            <div style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: scrolled ? '1.2rem' : '1.5rem',
                letterSpacing: '0.1rem',
                color: scrolled ? 'var(--primary-dark)' : 'white', // Dark on pill, White on hero
                userSelect: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s ease'
            }}>
                CRUNCH<span style={{ color: 'var(--brand-red)' }}>.</span>
            </div>

            {/* LINKS */}
            <div className="desktop-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {['FLAVORS', 'STORY', 'RETAILERS'].map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="nav-link"
                        style={{
                            textDecoration: 'none',
                            color: scrolled ? 'var(--primary-dark)' : 'white', // Adaptive Color
                            fontWeight: 700,
                            fontSize: '0.85rem', // Smaller, more professional
                            letterSpacing: '0.05rem',
                            opacity: scrolled ? 0.8 : 0.9,
                            transition: 'color 0.4s ease',
                            minHeight: 'auto' // Override global min-height for these specific links
                        }}
                    >
                        {item}
                    </a>
                ))}
            </div>

            {/* CTA */}
            <a href="#store" style={{
                textDecoration: 'none',
                background: 'var(--brand-red)',
                color: 'white',
                padding: scrolled ? '0.6rem 1.4rem' : '0.8rem 1.8rem',
                borderRadius: '100px',
                fontWeight: 800,
                fontSize: '0.85rem',
                letterSpacing: '0.05rem',
                transition: 'all 0.4s ease',
                boxShadow: scrolled ? 'none' : '0 10px 20px rgba(220, 38, 38, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
            }}>
                GRAB A BAG
            </a>

            {/* Mobile query shim */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 768px) {
                    .desktop-links {
                        display: none !important;
                    }
                    nav {
                        width: 90% !important;
                        justify-content: space-between !important;
                        background: rgba(255,255,255,0.9) !important; /* Always background on mobile */
                        padding: 0.6rem 1.2rem !important; 
                        margin-top: 0.5rem;
                    }
                    .nav-link { color: var(--primary-dark) !important; }
                    /* Make logo dark on mobile because bg is white */
                    nav > div:first-child { color: var(--primary-dark) !important; }
                }
            `}} />
        </nav>
    );
};

export default Navbar;
