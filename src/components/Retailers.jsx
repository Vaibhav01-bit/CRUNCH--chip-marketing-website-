import React from 'react';

const Retailers = () => {
    const partners = [
        "Whole Foods Market", "Erewhon", "Selfridges", "Harrods", "Dean & DeLuca", "Zabar's"
    ];

    return (
        <section id="store" className="retailers" style={{
            background: '#fff',
            padding: '150px 0',
            textAlign: 'center'
        }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <p style={{ color: 'var(--brand-orange)', marginBottom: '1.5rem', letterSpacing: '0.4rem', fontSize: '0.75rem', fontWeight: 'bold' }}>ACQUISITION</p>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '50px', fontFamily: 'var(--font-heading)' }}>Exclusively at <span style={{ color: 'var(--brand-orange)' }}>fine</span> retailers.</h2>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '3rem',
                    opacity: 0.6,
                    marginBottom: '80px'
                }}>
                    {partners.map((partner, i) => (
                        <div key={i} style={{
                            fontSize: '1.2rem',
                            fontWeight: '900',
                            letterSpacing: '0.1rem',
                            fontFamily: 'var(--font-heading)'
                        }}>
                            {partner.toUpperCase()}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'inline-block', position: 'relative' }}>
                    <button style={{
                        background: 'var(--brand-red)',
                        color: 'white',
                        padding: '1.2rem 4rem',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.2rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(243, 91, 4, 0.2)'
                    }}>
                        FIND YOUR LOCAL STOCKIST
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Retailers;
