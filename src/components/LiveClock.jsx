import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function LiveClock({ showSeconds = true }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dayName = time.toLocaleDateString(undefined, { weekday: 'short' });
  const dateFormatted = time.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const timeFormatted = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: true
  });

  return (
    <div
      className="live-clock"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.8125rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        background: 'rgba(13, 40, 24, 0.04)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <Clock size={14} style={{ color: 'var(--color-leaf)' }} />
      <span className="tabular-nums">
        {dayName}, {dateFormatted} · {timeFormatted}
      </span>
    </div>
  );
}
