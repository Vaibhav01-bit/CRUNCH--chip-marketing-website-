import React, { useEffect, useRef } from 'react';

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
        <section id="flavors" className="products" style={{ background: '#fff', padding: '160px 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '100px' }} className="reveal-on-scroll" ref={el => revealRefs.current[0] = el}>
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
                        Each kettle-cooked batch is a curated journey of complex layers,
                        where premium ingredients meet artisanal craftsmanship.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '4rem 2rem',
                    marginBottom: '100px'
                }}>
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="product-card reveal-on-scroll"
                            ref={el => revealRefs.current[index + 1] = el}
                            style={{ transitionDelay: `${index * 0.15}s` }}
                        >
                            <div className="product-image-container" style={{ marginBottom: '2.5rem' }}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                />
                            </div>
                            <div style={{ padding: '0 10px' }}>
                                <h3 style={{
                                    marginBottom: '1rem',
                                    fontSize: '1.8rem',
                                    fontFamily: 'var(--font-heading)',
                                    fontWeight: 700
                                }}>
                                    {product.name}
                                </h3>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--brand-orange)',
                                    fontWeight: 700,
                                    letterSpacing: '0.05rem',
                                    marginBottom: '1.2rem',
                                    fontStyle: 'italic'
                                }}>
                                    {product.tastingNote}
                                </p>
                                <p style={{
                                    fontSize: '1rem',
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.7,
                                    marginBottom: '2.5rem'
                                }}>
                                    {product.description}
                                </p>
                                <button style={{
                                    color: 'var(--brand-red)',
                                    fontWeight: '900',
                                    background: 'transparent',
                                    paddingBottom: '0.5rem',
                                    border: 'none',
                                    borderBottom: '1.5px solid var(--brand-amber)',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.15rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderBottomColor = 'var(--brand-red)';
                                        e.currentTarget.style.letterSpacing = '0.2rem';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderBottomColor = 'var(--brand-amber)';
                                        e.currentTarget.style.letterSpacing = '0.15rem';
                                    }}>
                                    VIEW PROFILE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center' }} className="reveal-on-scroll" ref={el => revealRefs.current[5] = el}>
                    <button className="explore-all-button">
                        Explore the Collection
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
