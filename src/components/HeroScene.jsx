import React, { useState } from 'react';
import { ExternalLink, Sparkles, RotateCw, Maximize2, Move3d, CheckCircle2, Apple } from 'lucide-react';

/**
 * HeroScene - Showcase Controller for the 3D Fruit Basket
 * Model: "fruit basket" by katrin.kor
 * URL: https://sketchfab.com/3d-models/fruit-basket-b3528a6183e3450dbdc4c61284be4d60
 */
export default function HeroScene() {
  const [activeFruit, setActiveFruit] = useState('All');

  const produceItems = [
    { name: 'Apples', icon: '🍎', note: 'Crisp Orchard Honeycrisp' },
    { name: 'Grapes', icon: '🍇', note: 'Sweet Concord Clusters' },
    { name: 'Oranges', icon: '🍊', note: 'Sun-kissed Citrus' },
    { name: 'Bananas', icon: '🍌', note: 'Golden Cavendish Ripe' },
  ];

  return (
    <div
      className="hero-3d-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(82, 183, 136, 0.3)',
        boxShadow: '0 16px 40px rgba(4, 16, 9, 0.06)',
        pointerEvents: 'auto',
      }}
    >
      {/* Top Header Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(82, 183, 136, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-status-open)',
              boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)',
            }}
          />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-forest)' }}>
            Real 3D Fruit Basket · In View
          </span>
        </div>

        <a
          href="https://sketchfab.com/3d-models/fruit-basket-b3528a6183e3450dbdc4c61284be4d60"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-leaf)',
            textDecoration: 'none',
          }}
          title="View Original Model on Sketchfab"
        >
          <span>Model by katrin.kor</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Center Visual Callout */}
      <div
        style={{
          textAlign: 'center',
          padding: '30px 10px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.75)',
            border: '1px solid rgba(82, 183, 136, 0.25)',
            color: 'var(--color-leaf-deep)',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          <Sparkles size={13} color="var(--color-leaf-bright)" />
          <span>Full Screen 3D Motion Follows Your Scroll</span>
        </div>
        <h3
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--color-forest-darkest)',
            margin: '0 0 6px 0',
          }}
        >
          Fresh Orchard Harvest
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            maxWidth: 320,
            margin: '0 auto',
          }}
        >
          Scroll down the page to see the 3D fruit basket glide, turn, and showcase produce across every market section!
        </p>
      </div>

      {/* Bottom Produce Quick Highlights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8,
          background: 'rgba(255, 255, 255, 0.85)',
          padding: '12px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(82, 183, 136, 0.2)',
        }}
      >
        {produceItems.map((item) => (
          <div
            key={item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 8px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(250, 247, 242, 0.6)',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-forest)' }}>{item.name}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{item.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
