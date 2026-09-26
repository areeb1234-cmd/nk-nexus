import React, { useEffect, useRef, useState } from 'react';

/**
 * FreshFind Scroll Reveal
 * Visual pattern inspired by the open-source React Bits animation catalogue.
 * Kept dependency-free so the app stays fast and easy to maintain.
 */
export default function Reveal({ children, className = '', delay = 0, distance = 28, scale = 0.97, once = true }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`rb-reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{
        '--rb-delay': `${delay}ms`,
        '--rb-distance': `${distance}px`,
        '--rb-scale': scale,
      }}
    >
      {children}
    </div>
  );
}
