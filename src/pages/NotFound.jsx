import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-page" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <div className="container-narrow">
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-mint-tint)',
            color: 'var(--color-leaf)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}
        >
          <Sprout size={32} />
        </div>
        <span className="section-kicker">Page Not Found · 404</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-forest-darkest)', marginBottom: 12 }}>
          Off the Farm Trail
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.6 }}>
          The path you navigated to doesn't exist in our regional farmers market registry. Let’s guide you back to fresh discoveries.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <Link to="/" className="btn btn-primary" style={{ gap: 8 }}>
            <ArrowLeft size={16} />
            <span>Return to Home Showcase</span>
          </Link>
          <Link to="/markets" className="btn btn-outline" style={{ gap: 8 }}>
            <Compass size={16} />
            <span>Browse All Markets</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
