import React, { useRef } from 'react';

/** Lightweight SpotlightCard pattern inspired by React Bits. */
export default function SpotlightCard({ children, className = '', spotlight = 'rgba(82, 183, 136, 0.16)' }) {
  const ref = useRef(null);

  const handleMove = (event) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      className={`rb-spotlight ${className}`.trim()}
      onMouseMove={handleMove}
      style={{ '--spot-color': spotlight }}
    >
      {children}
    </div>
  );
}
