import React, { useEffect, useRef } from 'react';

const SpiceDustOverlay = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        const particles = Array.from({ length: 50 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            color: Math.random() > 0.5 ? '#DC2626' : '#F59E0B', // Red and Orange dust
            speedY: Math.random() * 0.5 + 0.2,
            speedX: (Math.random() - 0.5) * 0.5,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05
        }));

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;

                // Reset if out of view
                if (p.y > height) p.y = -10;
                if (p.x > width) p.x = 0;
                if (p.x < 0) p.x = width;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;

                // Draw irregular dust shape
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(p.size, 0);
                ctx.lineTo(p.size * 0.8, p.size * 0.8);
                ctx.lineTo(0, p.size);
                ctx.fill();

                ctx.restore();
            });

            requestAnimationFrame(animate);
        };

        const animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9998 // Just below overlays but above content if needed, or adjust z-index
            }}
        />
    );
};

export default SpiceDustOverlay;
