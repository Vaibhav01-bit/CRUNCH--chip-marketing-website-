import React, { useEffect, useRef } from 'react';
import CircularGallery from './CircularGallery';

const products = [
    {
        id: 1,
        name: 'Sea Salt & Balsamic',
        tastingNote: 'A delicate balance of minerality and oak-aged sweetness.',
        image: '/this-is-why-potato-chips-are-so-addictive-407805769-Jiri-Hera.jpg',
        description: 'Mediterranean sea salt paired with aged balsamic vinegar.'
    },
    {
        id: 2,
        name: 'Truffle & Black Pepper',
        tastingNote: 'Deep umami richness met with a sharp, aromatic bite.',
        image: '/truffle-chips_.webp',
        description: 'Earthy black truffle with a sharp peppercorn finish.'
    },
    {
        id: 3,
        name: 'Mango & Habanero',
        tastingNote: 'Vibrant tropical sweetness ignited by a slow, creeping heat.',
        image: '/mango-habanero-salsa-6.jpg',
        description: 'Tropical sun-ripened mango met with the fire of signature habaneros.'
    },
    {
        id: 4,
        name: 'Smoked Paprika',
        tastingNote: 'Robust earthy notes infused with the essence of open-flame oak.',
        image: '/smoked-paprika-potato-chips.webp',
        description: 'Oak-smoked paprika for a deep, campfire aroma.'
    }
];

const ProductShowcase = () => {
    const revealRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            },
            { threshold: 0.1 }
        );

        if (revealRef.current) observer.observe(revealRef.current);
        return () => observer.disconnect();
    }, []);

    const galleryItems = products.map(p => ({
        image: p.image,
        text: p.name.toUpperCase()
    }));

    return (
        <section id="flavors" className="products" style={{
            background: '#fff',
            padding: '160px 0',
            overflow: 'hidden'
        }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '60px' }} className="reveal-on-scroll" ref={revealRef}>
                    <p style={{
                        color: 'var(--brand-orange)',
                        letterSpacing: '0.4rem',
                        fontSize: '0.8rem',
                        fontWeight: '900',
                        marginBottom: '1.5rem',
                        textTransform: 'uppercase'
                    }}>
                        Signature Collection
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '2rem'
                    }}>
                        The Flavor Profiles
                    </h2>
                    <div style={{ width: '60px', height: '2px', background: 'var(--brand-amber)', margin: '0 auto 2rem' }} />
                    <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                        Experience our artisanal collection through an interactive sensory lens.
                        Drag or scroll to explore the craftsmanship behind every crunch.
                    </p>
                </div>

                <div style={{ height: '700px', position: 'relative', width: '100%', cursor: 'grab' }}>
                    <CircularGallery
                        items={galleryItems}
                        bend={1.5}
                        textColor="var(--brand-orange)"
                        borderRadius={0.02}
                        scrollSpeed={3}
                        scrollEase={0.04}
                        font="bold 40px 'Playfair Display', serif"
                    />
                </div>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <button className="explore-all-button">
                        Explore the full range
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
