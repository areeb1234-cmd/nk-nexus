import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({ value, suffix = '' }) {
  const target = Number(String(value).replace(/,/g, ''));
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = counterRef.current;
    if (!node) return undefined;

    let frameId = 0;

    const runAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const startTime = performance.now();
      const duration = 1500;

      const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3);

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        setCount(Math.round(target * easeOutCubic(progress)));

        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        } else {
          setCount(target);
        }
      };

      frameId = requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      runAnimation();
      return () => cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
          observer.unobserve(node);
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [target]);

  return (
    <span ref={counterRef} className="animated-counter-value">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
