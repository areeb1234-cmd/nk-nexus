import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCw, ExternalLink, Maximize2, Minimize2, Move3d, Compass, Eye, ShieldCheck } from 'lucide-react';

/**
 * FullScreenSketchfabBackground
 * Official 3D Fruit Basket Model by katrin.kor on Sketchfab
 * URL: https://sketchfab.com/3d-models/fruit-basket-b3528a6183e3450dbdc4c61284be4d60
 *
 * Provides:
 * 1. Full-screen fixed 3D backdrop on the website
 * 2. Real-time scrollytelling transforms (movement, tilt, and zoom as website scrolls)
 * 3. Mobile responsiveness (automatic scaling and safe viewport margins)
 * 4. Interactive Orbit toggle (switch between scroll-through and direct 3D drag/touch interaction)
 * 5. Full-viewport immersive mode
 */
export default function FullScreenSketchfabBackground({ isEnabled = true }) {
  const [isInteractive, setIsInteractive] = useState(false);
  const [autospin, setAutospin] = useState(0.25);
  const [isFullImmersion, setIsFullImmersion] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionName, setActiveSectionName] = useState('Hero Harvest');

  // Transform states calculated on scroll
  const [transform, setTransform] = useState({
    x: '22vw',
    y: '4vh',
    scale: 1.1,
    rotateY: -15,
    rotateX: 5,
  });

  useEffect(() => {
    if (!isEnabled) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
          const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
          const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
          setScrollProgress(progress);

          const isMobile = window.innerWidth < 768;
          const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

          if (isMobile) {
            // Mobile Choreography: Subtle float & breathing centered
            if (progress < 0.25) {
              setActiveSectionName('01 · Morning Harvest');
              setTransform({
                x: '0vw',
                y: '10vh',
                scale: 0.82,
                rotateY: progress * 80,
                rotateX: 4,
              });
            } else if (progress < 0.6) {
              setActiveSectionName('02 · Fresh Radar');
              setTransform({
                x: '0vw',
                y: '4vh',
                scale: 0.88,
                rotateY: 20 + (progress - 0.25) * 120,
                rotateX: 6,
              });
            } else if (progress < 0.85) {
              setActiveSectionName('03 · Local Markets');
              setTransform({
                x: '0vw',
                y: '-2vh',
                scale: 0.84,
                rotateY: 60 + (progress - 0.6) * 100,
                rotateX: 3,
              });
            } else {
              setActiveSectionName('04 · Seasonal Harvest');
              setTransform({
                x: '0vw',
                y: '6vh',
                scale: 0.9,
                rotateY: 120 + (progress - 0.85) * 80,
                rotateX: 8,
              });
            }
          } else {
            // Desktop & Tablet Choreography
            if (progress < 0.22) {
              // Hero section: Right side, framed with headline
              setActiveSectionName('01 · Cinematic Hero');
              const p = progress / 0.22;
              setTransform({
                x: isTablet ? '16vw' : '22vw',
                y: `${4 + p * 4}vh`,
                scale: isTablet ? 1.0 : 1.12,
                rotateY: -15 + p * 20,
                rotateX: 6 - p * 2,
              });
            } else if (progress < 0.52) {
              // Discovery & Live Radar: Sweeps smoothly to Left side
              setActiveSectionName('02 · Fresh Produce Radar');
              const p = (progress - 0.22) / 0.3;
              setTransform({
                x: `${(isTablet ? 16 : 22) - p * (isTablet ? 38 : 46)}vw`,
                y: `${8 - p * 12}vh`,
                scale: isTablet ? 1.05 : 1.2,
                rotateY: 5 + p * 55,
                rotateX: 4 + p * 6,
              });
            } else if (progress < 0.78) {
              // Market Explorer / Map: Sweeps to the Right side
              setActiveSectionName('03 · Regional Market Atlas');
              const p = (progress - 0.52) / 0.26;
              setTransform({
                x: `${(isTablet ? -22 : -24) + p * (isTablet ? 42 : 50)}vw`,
                y: `${-4 + p * 10}vh`,
                scale: isTablet ? 1.0 : 1.1,
                rotateY: 60 - p * 80,
                rotateX: 10 - p * 12,
              });
            } else {
              // Seasonal Produce & Harvest: Centers for a grand close-up view
              setActiveSectionName('04 · Harvest Commitment');
              const p = (progress - 0.78) / 0.22;
              setTransform({
                x: `${(isTablet ? 20 : 26) - p * (isTablet ? 20 : 26)}vw`,
                y: `${6 + p * 8}vh`,
                scale: isTablet ? 1.15 : 1.28,
                rotateY: -20 + p * 45,
                rotateX: -2 + p * 10,
              });
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  const embedUrl = `https://sketchfab.com/models/b3528a6183e3450dbdc4c61284be4d60/embed?autostart=1&transparent=1&ui_controls=0&ui_infos=0&ui_watermark=0&ui_hint=0&scrollwheel=0&autospin=${autospin}`;

  return (
    <>
      {/* -----------------------------------------------------------------
          FULL SCREEN FIXED BACKGROUND CONTAINER
          ----------------------------------------------------------------- */}
      <div
        className={`fullscreen-3d-bg-root ${isFullImmersion ? 'immersion-active' : ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: isFullImmersion ? 9999 : 0,
          pointerEvents: isFullImmersion || isInteractive ? 'auto' : 'none',
          overflow: 'hidden',
          transition: 'background 0.5s ease',
          background: isFullImmersion
            ? 'radial-gradient(circle at center, #0F2E1B 0%, #041009 85%)'
            : 'radial-gradient(ellipse 90% 80% at 75% 35%, rgba(116, 198, 157, 0.14) 0%, rgba(250, 247, 242, 0) 70%)',
        }}
      >
        {/* Loading Spinner */}
        {!isLoaded && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '3px solid rgba(82, 183, 136, 0.25)',
                borderTopColor: 'var(--color-leaf-bright)',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-forest)' }}>
              Loading 3D Fruit Basket...
            </span>
          </div>
        )}

        {/* Ambient Ground Glow behind 3D Model */}
        <div
          style={{
            position: 'absolute',
            width: '60vw',
            height: '60vw',
            maxWidth: 700,
            maxHeight: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(116, 198, 157, 0.18) 0%, rgba(244, 162, 97, 0.08) 50%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${transform.x}), calc(-50% + ${transform.y}))`,
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Dynamic 3D Fruit Basket Viewport (Moves with Scroll) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isFullImmersion
              ? 'none'
              : `translate3d(${transform.x}, ${transform.y}, 0) scale(${transform.scale}) rotateY(${transform.rotateY}deg) rotateX(${transform.rotateX}deg)`,
            transformStyle: 'preserve-3d',
            perspective: 1200,
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 2,
          }}
        >
          <iframe
            title="Fruit Basket 3D Model - katrin.kor"
            src={embedUrl}
            onLoad={() => setIsLoaded(true)}
            style={{
              width: isFullImmersion ? '100%' : '100vw',
              height: isFullImmersion ? '100%' : '100vh',
              minWidth: 500,
              minHeight: 500,
              border: 'none',
              display: 'block',
              background: 'transparent',
              pointerEvents: isFullImmersion || isInteractive ? 'auto' : 'none',
            }}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
        </div>

        {/* Orbit Interaction Active Warning Banner */}
        {isInteractive && !isFullImmersion && (
          <div
            style={{
              position: 'absolute',
              top: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(15, 46, 27, 0.92)',
              color: '#ffffff',
              boxShadow: '0 8px 30px rgba(4, 16, 9, 0.25)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              zIndex: 25,
              pointerEvents: 'auto',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(82, 183, 136, 0.3)',
            }}
          >
            <Compass size={16} className="spin-slow" color="#74C69D" />
            <span>3D Orbit Mode Active — Drag to rotate or pinch to zoom</span>
            <button
              type="button"
              onClick={() => setIsInteractive(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginLeft: 4,
              }}
            >
              Done
            </button>
          </div>
        )}

        {/* Exit Immersion Mode Button */}
        {isFullImmersion && (
          <div
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.875rem',
                fontWeight: 700,
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Fruit Basket 3D · Full Immersion
            </div>
            <button
              type="button"
              onClick={() => {
                setIsFullImmersion(false);
                setIsInteractive(false);
              }}
              className="btn btn-sm"
              style={{
                background: 'var(--color-leaf-vibrant)',
                color: '#041009',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                padding: '8px 18px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              <Minimize2 size={15} style={{ marginRight: 6 }} />
              <span>Back to Website</span>
            </button>
          </div>
        )}
      </div>

      {/* -----------------------------------------------------------------
          FLOATING 3D HUD & CONTROLS PILL (Bottom Dock)
          ----------------------------------------------------------------- */}
      {!isFullImmersion && (
        <aside
          className="fullscreen-3d-dock"
          aria-label="3D Model Controls"
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 12px',
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(82, 183, 136, 0.35)',
            boxShadow: '0 10px 32px rgba(8, 27, 18, 0.12)',
          }}
        >
          {/* Scroll Section Milestone Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              paddingRight: 8,
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--color-forest)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--color-status-open)',
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.7)',
                animation: 'pulse 2s infinite',
              }}
            />
            <span className="hide-on-mobile">{activeSectionName}</span>
            <span style={{ color: 'var(--color-leaf)', fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>

          {/* Interactive Orbit Toggle Button */}
          <button
            type="button"
            onClick={() => setIsInteractive((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: isInteractive ? 'var(--color-forest)' : 'rgba(82, 183, 136, 0.14)',
              color: isInteractive ? '#ffffff' : 'var(--color-forest)',
              border: isInteractive ? 'none' : '1px solid rgba(82, 183, 136, 0.25)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title={isInteractive ? 'Disable 3D Orbit' : 'Enable 3D Orbit (drag with mouse/touch)'}
          >
            <Move3d size={13} />
            <span>{isInteractive ? 'Orbiting' : 'Interact 3D'}</span>
          </button>

          {/* 360° Spin Toggle */}
          <button
            type="button"
            onClick={() => setAutospin((prev) => (prev > 0 ? 0 : 0.3))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              background: autospin > 0 ? 'rgba(82, 183, 136, 0.18)' : 'transparent',
              color: 'var(--color-forest)',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Toggle 360 Auto-spin"
          >
            <RotateCw size={12} className={autospin > 0 ? 'spin-slow' : ''} />
            <span className="hide-on-mobile">{autospin > 0 ? 'Spinning' : 'Spin'}</span>
          </button>

          {/* Full Immersion Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsFullImmersion(true);
              setIsInteractive(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'rgba(82, 183, 136, 0.14)',
              color: 'var(--color-forest)',
              border: 'none',
              cursor: 'pointer',
            }}
            title="View Fullscreen 3D"
          >
            <Maximize2 size={13} />
          </button>

          {/* Sketchfab Link */}
          <a
            href="https://sketchfab.com/3d-models/fruit-basket-b3528a6183e3450dbdc4c61284be4d60"
            target="_blank"
            rel="noopener noreferrer"
            title="Official Sketchfab Model by katrin.kor"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color-leaf)',
              padding: '4px',
              opacity: 0.8,
            }}
          >
            <ExternalLink size={13} />
          </a>
        </aside>
      )}
    </>
  );
}
