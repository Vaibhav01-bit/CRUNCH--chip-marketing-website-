import { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll = ({ children }) => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4, // Slightly longer for premium feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: true, // Enable smooth touch for mobile
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Expose instance for other components
        window.lenis = lenis;

        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            window.lenis = null;
            cancelAnimationFrame(rafId);
        };
    }, []);

    return <div className="smooth-scroll-wrapper">{children}</div>;
};

export default SmoothScroll;
