import React from 'react';

const WavyDivider = ({ color = '#FFFBEB', position = 'bottom', height = '60px' }) => {
    const isTop = position === 'top';

    return (
        <div style={{
            position: 'absolute',
            [isTop ? 'top' : 'bottom']: -1, // Overlap slightly to prevent gaps
            left: 0,
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0,
            transform: isTop ? 'rotate(180deg)' : 'none',
            zIndex: 10
        }}>
            <svg
                position="relative"
                display="block"
                width="calc(100% + 1.3px)"
                height={height}
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                style={{ width: 'calc(100% + 1.3px)', height: height }}
            >
                <path
                    d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                    fill={color}
                ></path>
            </svg>
        </div>
    );
};

export default WavyDivider;
