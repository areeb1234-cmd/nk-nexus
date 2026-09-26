import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCw, ExternalLink, Maximize2, Minimize2, Eye } from 'lucide-react';

/**
 * Sketchfab 3D Fruit Basket Model Viewer
 * Model: "fruit basket" by katrin.kor
 * URL: https://sketchfab.com/3d-models/fruit-basket-b3528a6183e3450dbdc4c61284be4d60
 * Model ID: b3528a6183e3450dbdc4c61284be4d60
 */
export default function SketchfabFruitBasket({
  isScrollChoreographed = false,
  className = '',
  style = {},
  showControls = true,
}) {
  const [autospin, setAutospin] = useState(0.2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  // Track page scroll for scrollytelling transforms when enabled
  const [scrollTransform, setScrollTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotateY: 0,
    rotateX: 0,
  });

  useEffect(() => {
    if (!isScrollChoreographed) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // Calculate scrollytelling path across page sections
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Mobile subtle breathing float
        setScrollTransform({
          x: 0,
          y: Math.sin(progress * Math.PI * 2) * 15,
          scale: 0.95 + Math.sin(progress * Math.PI) * 0.08,
          rotateY: progress * 60,
          rotateX: Math.sin(progress * Math.PI) * 5,
        });
      } else {
        // Desktop scrollytelling path:
        // 0.0 - 0.2: Right side (Hero)
        // 0.2 - 0.5: Glides to Left (Discovery)
        // 0.5 - 0.75: Sweeps to Right (Market Explorer)
        // 0.75 - 1.0: Centers and zooms in (Produce Showcase)
        let targetX = 0;
        let targetY = 0;
        let targetScale = 1;
        let targetRotY = 0;

        if (progress < 0.25) {
          // Hero right zone
          const p = progress / 0.25;
          targetX = p * -10;
          targetY = p * 15;
          targetRotY = p * -25;
        } else if (progress < 0.55) {
          // Discovery left zone
          const p = (progress - 0.25) / 0.3;
          targetX = -10 + p * -180;
          targetY = 15 + p * 20;
          targetScale = 1.05;
          targetRotY = -25 + p * 60;
        } else if (progress < 0.8) {
          // Map right zone
          const p = (progress - 0.55) / 0.25;
          targetX = -190 + p * 240;
          targetY = 35 + p * -15;
          targetScale = 0.98;
          targetRotY = 35 + p * -50;
        } else {
          // Bottom showcase center
          const p = (progress - 0.8) / 0.2;
          targetX = 50 + p * -50;
          targetY = 20 + p * 10;
          targetScale = 1.08;
          targetRotY = -15 + p * 40;
        }

        setScrollTransform({
          x: targetX,
          y: targetY,
          scale: targetScale,
          rotateY: targetRotY,
          rotateX: 4,
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrollChoreographed]);

  // Construct official Sketchfab embed URL with optimal parameters:
  // - autostart=1: auto-load scene
  // - transparent=1: transparent backdrop blending with our organic palette
  // - scrollwheel=0: does NOT hijack page scrolling!
  // - autospin: controlled rotation speed
  // - ui_theme=dark, ui_infos=0, ui_watermark=0: minimal clean interface
  const embedUrl = `https://sketchfab.com/models/b3528a6183e3450dbdc4c61284be4d60/embed?autostart=1&transparent=1&ui_controls=1&ui_infos=0&ui_watermark=0&ui_hint=0&scrollwheel=0&autospin=${autospin}`;

  return (
    <div
      ref={containerRef}
      className={`sketchfab-fruit-basket-container ${isFullscreen ? 'fullscreen-mode' : ''} ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '100vh' : '100%',
        minHeight: isFullscreen ? '100vh' : '480px',
        borderRadius: isFullscreen ? '0' : 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, rgba(116, 198, 157, 0.18) 0%, rgba(250, 247, 242, 0.4) 70%)',
        border: isFullscreen ? 'none' : '1px solid rgba(82, 183, 136, 0.25)',
        boxShadow: isFullscreen ? 'none' : '0 14px 40px rgba(8, 27, 18, 0.08)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        transform: isScrollChoreographed
          ? `translate3d(${scrollTransform.x}px, ${scrollTransform.y}px, 0) scale(${scrollTransform.scale}) rotateY(${scrollTransform.rotateY}deg)`
          : 'none',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {/* Loading Shimmer Indicator */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(250, 247, 242, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
            gap: 12,
            transition: 'opacity 0.4s ease',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '3px solid rgba(82, 183, 136, 0.25)',
              borderTopColor: 'var(--color-leaf)',
              animation: 'spin 1s linear infinite',
            }}
          />
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-forest)' }}>
            Loading 3D Fruit Basket Model...
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Model by katrin.kor · Sketchfab 3D
          </div>
        </div>
      )}

      {/* Official Sketchfab 3D WebGL Embed */}
      <iframe
        title="Fruit Basket 3D Model by katrin.kor"
        src={embedUrl}
        onLoad={() => setIsLoading(false)}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          position: 'relative',
          zIndex: 1,
        }}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
      />

      {/* Floating HUD & Controls Overlay */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 12,
            pointerEvents: 'auto',
            gap: 10,
          }}
        >
          {/* Model Tag Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(12px)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(82, 183, 136, 0.3)',
              boxShadow: '0 4px 14px rgba(8, 27, 18, 0.08)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--color-forest)',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--color-status-open)',
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)',
              }}
            />
            <span>Fruit Basket · katrin.kor</span>
            <a
              href="https://sketchfab.com/3d-models/fruit-basket-b3528a6183e3450dbdc4c61284be4d60"
              target="_blank"
              rel="noopener noreferrer"
              title="Open on Sketchfab"
              style={{
                color: 'var(--color-leaf)',
                display: 'inline-flex',
                alignItems: 'center',
                marginLeft: 2,
              }}
            >
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Interactive Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Toggle Auto Spin */}
            <button
              type="button"
              onClick={() => setAutospin((prev) => (prev > 0 ? 0 : 0.25))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: autospin > 0 ? 'var(--color-leaf)' : 'rgba(255, 255, 255, 0.88)',
                color: autospin > 0 ? '#ffffff' : 'var(--color-forest)',
                border: '1px solid rgba(82, 183, 136, 0.3)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
              }}
              title="Toggle Auto Spin"
            >
              <RotateCw size={13} className={autospin > 0 ? 'spin-slow' : ''} />
              <span>{autospin > 0 ? 'Spinning' : 'Spin 360°'}</span>
            </button>

            {/* Toggle Fullscreen / Expand */}
            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.88)',
                color: 'var(--color-forest)',
                border: '1px solid rgba(82, 183, 136, 0.3)',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
              }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D View'}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>
      )}

      {/* Interaction Hint Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(82, 183, 136, 0.2)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          pointerEvents: 'none',
          zIndex: 12,
        }}
      >
        <Eye size={12} color="var(--color-leaf)" />
        <span>Click &amp; Drag to Orbit · Scroll down to animate</span>
      </div>
    </div>
  );
}
