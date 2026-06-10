import React, { useRef, useState, useEffect, useMemo } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

/* ─────────────────────────────────────────────────────────────────
   GLOBAL DISTRIBUTION — Real World Map via D3-Geo + TopoJSON
   ───────────────────────────────────────────────────────────────── */

const W = 960;
const H = 500;

const projection = geoNaturalEarth1()
    .scale(153)
    .translate([W / 2, H / 2]);

const pathGenerator = geoPath().projection(projection);

// Real cities with actual lat/lng
const CITIES = [
    { id: 'ny',     label: 'New York',    lng: -74.006,  lat: 40.7128,  country: 'USA' },
    { id: 'la',     label: 'Los Angeles', lng: -118.2437,lat: 34.0522,  country: 'USA' },
    { id: 'london', label: 'London',      lng: -0.1278,  lat: 51.5074,  country: 'UK' },
    { id: 'mumbai', label: 'Mumbai',      lng: 72.8777,  lat: 19.0760,  country: 'India' },
    { id: 'tokyo',  label: 'Tokyo',       lng: 139.6503, lat: 35.6762,  country: 'Japan' },
    { id: 'dubai',  label: 'Dubai',       lng: 55.2708,  lat: 25.2048,  country: 'UAE' },
    { id: 'sydney', label: 'Sydney',      lng: 151.2093, lat: -33.8688, country: 'Australia' },
    { id: 'sp',     label: 'São Paulo',   lng: -46.6333, lat: -23.5505, country: 'Brazil' },
];

// Connection routes between city IDs
const ROUTE_PAIRS = [
    ['ny',     'london'],
    ['london', 'mumbai'],
    ['mumbai', 'tokyo'],
    ['la',     'sp'],
    ['london', 'dubai'],
    ['tokyo',  'sydney'],
    ['ny',     'la'],
    ['dubai',  'mumbai'],
];

// Animated counter hook
function useCounter(target, duration, active) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!active) return;
        const numeric = parseInt(target, 10);
        if (isNaN(numeric)) { setVal(target); return; }
        let current = 0;
        const step = numeric / (duration / 16);
        const id = setInterval(() => {
            current = Math.min(current + step, numeric);
            setVal(Math.floor(current));
            if (current >= numeric) clearInterval(id);
        }, 16);
        return () => clearInterval(id);
    }, [active, target, duration]);
    return val;
}

/* ─── The real map renderer ─── */
function WorldMap({ inView }) {
    const [countries, setCountries] = useState([]);
    const [hovered, setHovered] = useState(null);
    const [tick, setTick] = useState(0);
    const rafRef = useRef(null);
    const startRef = useRef(null);

    // Load TopoJSON
    useEffect(() => {
        fetch('/world-110m.json')
            .then(r => r.json())
            .then(topo => {
                const geo = feature(topo, topo.objects.countries);
                setCountries(geo.features);
            })
            .catch(console.error);
    }, []);

    // Animate route dash offset
    useEffect(() => {
        if (!inView) return;
        startRef.current = performance.now();
        const animate = (now) => {
            setTick((now - startRef.current) / 1000);
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [inView]);

    // Project cities
    const projected = useMemo(() =>
        CITIES.map(c => {
            const [px, py] = projection([c.lng, c.lat]) || [0, 0];
            return { ...c, px, py };
        }), []);

    // Build route SVG arc paths
    const routes = useMemo(() =>
        ROUTE_PAIRS.map(([fromId, toId]) => {
            const from = projected.find(c => c.id === fromId);
            const to   = projected.find(c => c.id === toId);
            if (!from || !to) return null;
            // Quadratic bezier control point — arc above midpoint
            const mx = (from.px + to.px) / 2;
            const my = (from.py + to.py) / 2 - Math.hypot(to.px - from.px, to.py - from.py) * 0.22;
            return { from, to, d: `M${from.px},${from.py} Q${mx},${my} ${to.px},${to.py}` };
        }).filter(Boolean),
    [projected]);

    // Animated dash offset for flowing route effect
    const DASH = 8;
    const GAP  = 6;
    const dashOffset = -(tick * 30) % (DASH + GAP);

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
        >
            <defs>
                <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#F59E0B" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                </radialGradient>
                <filter id="fGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="fSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#F59E0B" stopOpacity="0.1" />
                    <stop offset="50%"  stopColor="#FCD34D" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity="0.1" />
                </linearGradient>
            </defs>

            {/* Ocean background */}
            <rect x="0" y="0" width={W} height={H} fill="#0a0f1e" rx="0" />

            {/* Graticule grid lines (lat/lng lines) */}
            <g stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" fill="none">
                {[-60,-30,0,30,60].map(lat => {
                    const [,y] = projection([0, lat]) || [0,0];
                    return <line key={lat} x1={0} y1={y} x2={W} y2={y} />;
                })}
                {[-150,-120,-90,-60,-30,0,30,60,90,120,150].map(lng => {
                    const pts = [-80,-60,-40,-20,0,20,40,60,80].map(lat => projection([lng, lat])).filter(Boolean);
                    if (pts.length < 2) return null;
                    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
                    return <path key={lng} d={d} />;
                })}
            </g>

            {/* Country fills */}
            <g>
                {countries.map((feature, i) => (
                    <path
                        key={feature.id || i}
                        d={pathGenerator(feature) || ''}
                        fill="rgba(30,50,100,0.55)"
                        stroke="rgba(100,160,255,0.2)"
                        strokeWidth="0.5"
                    />
                ))}
            </g>

            {/* Animated trade routes */}
            {inView && routes.map((route, i) => (
                <g key={i}>
                    {/* Shadow / glow underlay */}
                    <path
                        d={route.d}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="2.5"
                        strokeOpacity="0.1"
                    />
                    {/* Flowing dashed line */}
                    <path
                        d={route.d}
                        fill="none"
                        stroke="url(#routeGrad)"
                        strokeWidth="1.5"
                        strokeDasharray={`${DASH} ${GAP}`}
                        strokeDashoffset={dashOffset + i * 10}
                        strokeLinecap="round"
                    />
                </g>
            ))}

            {/* City markers */}
            {inView && projected.map((city, i) => {
                const isHov = hovered === city.id;
                return (
                    <g
                        key={city.id}
                        transform={`translate(${city.px},${city.py})`}
                        style={{
                            cursor: 'pointer',
                            opacity: inView ? 1 : 0,
                            animation: `gdCityPop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.5 + i * 0.1}s both`,
                        }}
                        onMouseEnter={() => setHovered(city.id)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {/* Outer glow ring */}
                        <circle r="18" fill="url(#cityGlow)" opacity={isHov ? 1 : 0.6} />

                        {/* Animated pulse ring */}
                        <circle r="6" fill="none" stroke="#DC2626" strokeWidth="1"
                            style={{ animation: `gdPulseRing 2.5s ease-out ${i * 0.3}s infinite` }} />

                        {/* Core dot */}
                        <circle r="3.5" fill="#FCD34D" stroke="#fff" strokeWidth="1" filter="url(#fGlow)" />

                        {/* Label tooltip on hover */}
                        {isHov && (
                            <g transform="translate(8, -18)">
                                <rect
                                    x="0" y="0"
                                    width={city.label.length * 7.2 + 20}
                                    height="22"
                                    rx="11"
                                    fill="#1e1e3a"
                                    stroke="rgba(220,38,38,0.5)"
                                    strokeWidth="1"
                                />
                                <text x="10" y="15"
                                    fill="#FFF"
                                    fontSize="9.5"
                                    fontWeight="700"
                                    fontFamily="system-ui, sans-serif"
                                >
                                    {city.label}
                                </text>
                                <text x="10" y="34"
                                    fill="rgba(252,211,77,0.7)"
                                    fontSize="7.5"
                                    fontFamily="system-ui, sans-serif"
                                >
                                    {city.country}
                                </text>
                            </g>
                        )}
                    </g>
                );
            })}

            <style>{`
                @keyframes gdCityPop {
                    from { opacity:0; transform: scale(0) translate(0,0); }
                    to   { opacity:1; transform: scale(1) translate(0,0); }
                }
                @keyframes gdPulseRing {
                    0%   { r: 5;  opacity: 1; }
                    100% { r: 20; opacity: 0; }
                }
            `}</style>
        </svg>
    );
}

/* ─── Main Section ─── */
const Retailers = () => {
    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setInView(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    const c1 = useCounter(100,  1800, inView);
    const c2 = useCounter(5000, 2400, inView);
    const c3 = useCounter(28,   1600, inView);

    const handleFindNearMe = async () => {
        try {
            const res  = await fetch('/api/stores/nearby');
            const data = await res.json();
            alert(data.stores.map(s => `📍 ${s.name} — ${s.address}`).join('\n'));
        } catch { alert('Could not connect to the backend server.'); }
    };

    const handleOrderOnline = async () => {
        try {
            const res  = await fetch('/api/orders/checkout', { method: 'POST' });
            const data = await res.json();
            alert(data.message);
        } catch { alert('Could not connect to the backend server.'); }
    };

    const stores = [
        { name: 'Whole Foods',       icon: '🥬' },
        { name: 'Blinkit',           icon: '⚡' },
        { name: '7-Eleven',          icon: '🏪' },
        { name: 'Zepto',             icon: '🚀' },
        { name: 'Target',            icon: '🎯' },
        { name: 'Swiggy Instamart',  icon: '🛒' },
    ];

    return (
        <section id="store" ref={sectionRef} className="gd-section">
            {/* decorative orbs */}
            <div className="gd-orb gd-orb--1" />
            <div className="gd-orb gd-orb--2" />

            <div className={`gd-inner ${inView ? 'gd-vis' : ''}`}>

                {/* ── LEFT PANEL ── */}
                <div className="gd-left">
                    <p className="gd-eyebrow">
                        <span className="gd-eyebrow__line" />
                        Global Distribution
                    </p>

                    <h2 className="gd-heading">
                        Worldwide<br />
                        <span className="gd-heading__accent">Impact.</span>
                    </h2>

                    <p className="gd-body">
                        We deliver <strong>real value</strong> and uphold real <strong>society
                        standards</strong>. Every bag supports ethical fair-trade, sustainable
                        farming, and zero-waste production globally.
                    </p>

                    {/* Animated stats */}
                    <div className="gd-stats">
                        {[
                            { val: `${c1}%`,           sub: 'Fair Trade Certified', color: '#DC2626' },
                            { val: `${c2.toLocaleString()}+`, sub: 'Farmers Uplifted',   color: '#D97706' },
                            { val: `${c3}`,            sub: 'Countries Reached',   color: '#1D4ED8' },
                        ].map((s, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <div className="gd-stats__div" />}
                                <div className="gd-stat">
                                    <h4 className="gd-stat__val" style={{ color: s.color }}>{s.val}</h4>
                                    <p className="gd-stat__sub">{s.sub}</p>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Partners */}
                    <p className="gd-section-label">Retail Partners</p>
                    <div className="gd-stores">
                        {stores.map((s, i) => (
                            <div key={i} className="gd-store"
                                style={{ animationDelay: `${0.6 + i * 0.07}s` }}>
                                <span className="gd-store__icon">{s.icon}</span>
                                <span className="gd-store__name">{s.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="gd-ctas">
                        <button className="gd-btn gd-btn--red"     onClick={handleFindNearMe}>
                            📍&nbsp; Find Near Me
                        </button>
                        <button className="gd-btn gd-btn--outline"  onClick={handleOrderOnline}>
                            Order Online →
                        </button>
                    </div>
                </div>

                {/* ── RIGHT PANEL — Real World Map ── */}
                <div className="gd-right">
                    <div className="gd-map-shell">
                        {/* Title bar */}
                        <div className="gd-map-bar">
                            <div className="gd-map-bar__dots">
                                <span style={{ background: '#ff5f57' }} />
                                <span style={{ background: '#ffbd2e' }} />
                                <span style={{ background: '#28c840' }} />
                            </div>
                            <span className="gd-map-bar__label">Live Distribution Network</span>
                            <div className="gd-live">
                                <span className="gd-live__dot" />
                                LIVE
                            </div>
                        </div>

                        {/* The real rendered map */}
                        <div className="gd-map-viewport">
                            <WorldMap inView={inView} />
                        </div>

                        {/* Footer bar */}
                        <div className="gd-map-footer">
                            {[
                                ['8', 'Active Hubs'],
                                [ROUTE_PAIRS.length, 'Trade Routes'],
                                ['24/7', 'Logistics'],
                            ].map(([v, l]) => (
                                <div key={l} className="gd-map-stat">
                                    <span className="gd-map-stat__val">{v}</span>&nbsp;{l}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── All CSS ─── */}
            <style dangerouslySetInnerHTML={{ __html: `

/* ── Section ── */
.gd-section {
    background: linear-gradient(170deg,#FFFBEB 0%,#FEF3C7 50%,#FFF7ED 100%);
    color: #451A03;
    position: relative;
    overflow: hidden;
    padding: 100px 0 120px;
}
.gd-orb {
    position:absolute;border-radius:50%;pointer-events:none;filter:blur(90px);
}
.gd-orb--1 {
    width:700px;height:700px;
    background:radial-gradient(circle,rgba(220,38,38,0.05) 0%,transparent 70%);
    top:-250px;right:-200px;
}
.gd-orb--2 {
    width:500px;height:500px;
    background:radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 70%);
    bottom:-150px;left:-100px;
}

/* ── Layout ── */
.gd-inner {
    max-width:1380px;
    margin:0 auto;
    display:grid;
    grid-template-columns:420px 1fr;
    gap:3rem;
    align-items:center;
    padding:0 2rem;
    position:relative;
    z-index:1;
    opacity:0;
    transform:translateY(40px);
    transition:opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1);
}
.gd-inner.gd-vis {
    opacity:1;transform:translateY(0);
}

/* ── Left ── */
.gd-left { padding: 1rem 0; }

.gd-eyebrow {
    display:inline-flex;align-items:center;gap:0.8rem;
    color:#DC2626;font-weight:900;font-size:0.78rem;
    letter-spacing:0.2em;text-transform:uppercase;
    margin-bottom:1.2rem;
}
.gd-eyebrow__line {
    display:inline-block;width:36px;height:3px;
    background:#DC2626;border-radius:2px;
}

.gd-heading {
    font-family:var(--font-heading);
    font-size:clamp(2.8rem,4.5vw,4rem);
    font-weight:900;line-height:0.92;
    margin-bottom:1.4rem;color:var(--primary-dark);
}
.gd-heading__accent {
    background:linear-gradient(to right,#F59E0B,#DC2626);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    filter:drop-shadow(0 4px 8px rgba(220,38,38,0.2));
}

.gd-body {
    font-size:1rem;color:#78350F;opacity:0.8;
    margin-bottom:2rem;max-width:420px;line-height:1.75;
}
.gd-body strong { color:#451A03;opacity:1; }

/* ── Stats card ── */
.gd-stats {
    display:flex;align-items:center;gap:1.5rem;
    margin-bottom:2.5rem;padding:1.3rem 1.8rem;
    background:rgba(255,255,255,0.65);
    backdrop-filter:blur(16px);
    border-radius:18px;
    border:1px solid rgba(255,255,255,0.95);
    box-shadow:0 8px 32px rgba(69,26,3,0.07);
}
.gd-stat { flex:1;text-align:center; }
.gd-stat__val {
    font-family:var(--font-heading);
    font-size:1.8rem;font-weight:900;margin-bottom:0.1rem;
}
.gd-stat__sub {
    font-size:0.65rem;font-weight:800;
    text-transform:uppercase;letter-spacing:0.08em;
    color:#78350F;opacity:0.55;
}
.gd-stats__div {
    width:1px;height:38px;background:rgba(69,26,3,0.1);
}

/* ── Partners ── */
.gd-section-label {
    font-size:0.7rem;font-weight:900;letter-spacing:0.18em;
    text-transform:uppercase;color:var(--primary-dark);opacity:0.4;
    margin-bottom:0.9rem;
}
.gd-stores {
    display:grid;grid-template-columns:repeat(3,1fr);
    gap:0.7rem;margin-bottom:2.2rem;
}
.gd-store {
    display:flex;align-items:center;gap:0.55rem;
    padding:0.75rem 0.9rem;
    border:1.5px solid rgba(245,158,11,0.12);
    border-radius:12px;
    background:rgba(255,255,255,0.5);
    backdrop-filter:blur(6px);
    transition:all 0.3s cubic-bezier(0.2,0.8,0.2,1);
    cursor:default;
}
.gd-store:hover {
    background:#FFF;border-color:#DC2626;
    transform:translateY(-3px);
    box-shadow:0 8px 24px rgba(220,38,38,0.1);
}
.gd-store__icon { font-size:1rem; }
.gd-store__name { font-weight:800;font-size:0.8rem;color:#78350F; }

/* ── CTAs ── */
.gd-ctas { display:flex;gap:1rem;flex-wrap:wrap; }
.gd-btn {
    display:inline-flex;align-items:center;gap:0.4rem;
    padding:0.9rem 2rem;font-size:0.85rem;font-weight:800;
    letter-spacing:0.1em;border-radius:100px;cursor:pointer;
    transition:all 0.35s cubic-bezier(0.2,0.8,0.2,1);
    text-transform:uppercase;border:none;
}
.gd-btn--red {
    background:linear-gradient(135deg,#DC2626,#991b1b);
    color:#fff;
    box-shadow:0 12px 30px rgba(220,38,38,0.3),inset 0 1px 0 rgba(255,255,255,0.2);
}
.gd-btn--red:hover {
    transform:translateY(-4px) scale(1.02);
    box-shadow:0 20px 48px rgba(220,38,38,0.45);
}
.gd-btn--outline {
    background:transparent;color:#451A03;
    border:2.5px solid #451A03;
}
.gd-btn--outline:hover {
    background:#451A03;color:#FFF;
    transform:translateY(-4px);
    box-shadow:0 12px 32px rgba(69,26,3,0.2);
}

/* ── Map shell ── */
.gd-right { position:relative; }
.gd-map-shell {
    border-radius:20px;
    overflow:hidden;
    background:#0a0f1e;
    box-shadow:
        0 50px 100px rgba(0,0,0,0.3),
        0 0 0 1px rgba(255,255,255,0.06),
        inset 0 1px 0 rgba(255,255,255,0.04);
}

/* Title bar */
.gd-map-bar {
    display:flex;align-items:center;
    padding:12px 18px;
    border-bottom:1px solid rgba(255,255,255,0.05);
    gap:12px;
}
.gd-map-bar__dots {
    display:flex;gap:6px;
}
.gd-map-bar__dots span {
    width:10px;height:10px;border-radius:50%;display:block;
}
.gd-map-bar__label {
    flex:1;text-align:center;
    font-size:0.68rem;font-weight:700;
    letter-spacing:0.12em;text-transform:uppercase;
    color:rgba(255,255,255,0.3);
}
.gd-live {
    display:flex;align-items:center;gap:5px;
    font-size:0.62rem;font-weight:800;
    letter-spacing:0.12em;color:#28c840;
}
.gd-live__dot {
    width:7px;height:7px;border-radius:50%;
    background:#28c840;
    animation:gdLivePulse 1.8s ease-in-out infinite;
}
@keyframes gdLivePulse {
    0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(40,200,64,0.5);}
    50%{opacity:0.6;box-shadow:0 0 0 5px rgba(40,200,64,0);}
}

/* Map viewport */
.gd-map-viewport {
    padding: 0;
    line-height: 0;
}

/* Footer bar */
.gd-map-footer {
    display:flex;justify-content:space-around;
    padding:12px 20px;
    border-top:1px solid rgba(255,255,255,0.05);
}
.gd-map-stat {
    font-size:0.7rem;font-weight:600;
    color:rgba(255,255,255,0.3);letter-spacing:0.05em;
}
.gd-map-stat__val {
    color:#FCD34D;font-weight:900;
}

/* ── Responsive ── */
@media(max-width:1100px){
    .gd-inner{grid-template-columns:1fr;}
    .gd-left{order:2;}
    .gd-right{order:1;}
}
@media(max-width:600px){
    .gd-section{padding:60px 0;}
    .gd-stats{flex-direction:column;gap:1rem;}
    .gd-stats__div{width:40px;height:1px;}
    .gd-stores{grid-template-columns:repeat(2,1fr);}
    .gd-ctas{flex-direction:column;}
    .gd-btn{width:100%;justify-content:center;}
}
            `}} />
        </section>
    );
};

export default Retailers;
