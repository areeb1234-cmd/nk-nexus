import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast-item">
          {t.type === 'success' ? (
            <CheckCircle2 size={16} style={{ color: 'var(--color-mint-bright)', flexShrink: 0 }} />
          ) : t.type === 'warning' ? (
            <AlertTriangle size={16} style={{ color: 'var(--color-accent-amber)', flexShrink: 0 }} />
          ) : (
            <Info size={16} style={{ color: 'var(--color-mint-bright)', flexShrink: 0 }} />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
