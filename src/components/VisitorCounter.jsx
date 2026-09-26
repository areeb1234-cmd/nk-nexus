import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(14842);

  useEffect(() => {
    // Simulated increment every 7-12 seconds
    const interval = setInterval(() => {
      setVisitorCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 8500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.8125rem',
        fontWeight: 600,
        color: 'var(--color-forest)',
        background: 'var(--color-mint-tint)',
        border: '1px solid rgba(82, 183, 136, 0.3)',
        padding: '6px 14px',
        borderRadius: 'var(--radius-full)'
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--color-status-open)',
          boxShadow: '0 0 6px var(--color-status-open)'
        }}
      />
      <Users size={14} style={{ color: 'var(--color-leaf)' }} />
      <span className="tabular-nums">
        {visitorCount.toLocaleString()} Community Explorers Active
      </span>
    </div>
  );
}
