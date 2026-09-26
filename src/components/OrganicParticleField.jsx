import React, { useEffect, useMemo, useRef } from 'react';

const PARTICLES = [
  { x: 7, y: 18, s: 5, r: 0.8, d: 0 },
  { x: 15, y: 42, s: 3, r: 1.15, d: 1 },
  { x: 24, y: 14, s: 4, r: 0.9, d: 2 },
  { x: 31, y: 71, s: 3, r: 1.2, d: 3 },
  { x: 39, y: 24, s: 5, r: 0.75, d: 4 },
  { x: 46, y: 58, s: 4, r: 1.05, d: 5 },
  { x: 54, y: 12, s: 3, r: 1.3, d: 6 },
  { x: 61, y: 76, s: 5, r: 0.85, d: 7 },
  { x: 68, y: 35, s: 3, r: 1.1, d: 8 },
  { x: 74, y: 66, s: 4, r: 0.9, d: 9 },
  { x: 81, y: 19, s: 5, r: 1.2, d: 10 },
  { x: 88, y: 48, s: 3, r: 0.95, d: 11 },
  { x: 95, y: 30, s: 4, r: 1.05, d: 12 },
  { x: 12, y: 82, s: 4, r: 0.85, d: 13 },
  { x: 20, y: 62, s: 3, r: 1.3, d: 14 },
  { x: 28, y: 88, s: 5, r: 0.75, d: 15 },
  { x: 57, y: 91, s: 3, r: 1.1, d: 16 },
  { x: 72, y: 86, s: 4, r: 0.9, d: 17 },
  { x: 84, y: 73, s: 3, r: 1.15, d: 18 },
  { x: 92, y: 90, s: 5, r: 0.8, d: 19 },
];

function OrganicParticle({ item, index, nodeRef }) {
  const shape = index % 6 === 0 ? 'leaf' : index % 5 === 0 ? 'seed' : 'dot';
  return (
    <span
      ref={(node) => {
        if (node) nodeRef.current[index] = node;
      }}
      className={`organic-particle organic-particle-${shape}`}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: item.s,
        height: item.s,
        animationDelay: `${item.d * -0.7}s`,
        animationDuration: `${7 + item.r * 2.2}s`
      }}
      aria-hidden="true"
    />
  );
}

export default function OrganicParticleField() {
  const fieldRef = useRef(null);
  const nodeRefs = useRef([]);
  const pointer = useRef({ x: 0.5, y: 0.5, active: false });
  const frameRef = useRef(0);

  const particles = useMemo(() => PARTICLES, []);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return undefined;

    const onMove = (event) => {
      pointer.current = {
        x: event.clientX / Math.max(window.innerWidth, 1),
        y: event.clientY / Math.max(window.innerHeight, 1),
        active: true
      };
    };

    const onLeave = () => {
      pointer.current.active = false;
    };

    const tick = () => {
      const p = pointer.current;
      const px = p.x * window.innerWidth;
      const py = p.y * window.innerHeight;

      nodeRefs.current.forEach((node, index) => {
        if (!node) return;
        const item = PARTICLES[index];
        const baseX = (item.x / 100) * window.innerWidth;
        const baseY = (item.y / 100) * window.innerHeight;

        let dx = 0;
        let dy = 0;
        if (p.active) {
          const vx = baseX - px;
          const vy = baseY - py;
          const distance = Math.max(70, Math.hypot(vx, vy));
          const influence = Math.max(0, 1 - distance / 190);
          dx = (vx / distance) * influence * 16;
          dy = (vy / distance) * influence * 16;
        }

        node.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div ref={fieldRef} className="organic-particle-field" aria-hidden="true">
      {particles.map((item, index) => (
        <OrganicParticle key={index} item={item} index={index} nodeRef={nodeRefs} />
      ))}
    </div>
  );
}
