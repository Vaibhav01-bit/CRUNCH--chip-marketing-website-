import React, { useEffect, useState } from 'react';

const ParallaxChips = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Simple parallax config
    const chips = [
        { id: 1, src: '/assets/potato-whole-1.png', top: '10%', right: '5%', speed: 0.1, size: '80px', rotate: 20 },
        { id: 2, src: '/assets/potato-whole-2.png', top: '40%', left: '2%', speed: 0.15, size: '120px', rotate: -15 },
        { id: 3, src: '/assets/potato-whole-1.png', top: '70%', right: '8%', speed: 0.08, size: '100px', rotate: 45 },
        { id: 4, src: '/assets/potato-whole-2.png', top: '25%', left: '8%', speed: 0.2, size: '60px', rotate: 90 },
    ];

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5, overflow: 'hidden' }}>
            {chips.map(chip => (
                <img
                    key={chip.id}
                    src={chip.src}
                    alt="floating chip"
                    style={{
                        position: 'absolute',
                        top: chip.top,
                        left: chip.left,
                        right: chip.right,
                        width: chip.size,
                        transform: `translateY(${offset * chip.speed}px) rotate(${chip.rotate + (offset * 0.05)}deg)`,
                        transition: 'transform 0.1s linear',
                        opacity: 0.9,
                        filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
                    }}
                />
            ))}
        </div>
    );
};

export default ParallaxChips;
