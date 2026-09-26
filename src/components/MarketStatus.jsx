import React from 'react';
import { getMarketStatus } from '../utils/marketStatus';

export default function MarketStatus({ market, showDetail = true }) {
  const status = getMarketStatus(market);

  const statusClass =
    status.code === 'open'
      ? 'status-open'
      : status.code === 'soon'
      ? 'status-soon'
      : 'status-closed';

  const beaconClass =
    status.code === 'open'
      ? 'animate-beacon-open'
      : status.code === 'soon'
      ? 'animate-beacon-soon'
      : '';

  return (
    <div className={`market-status-badge ${statusClass}`}>
      <span className={`market-status-dot ${beaconClass}`} />
      <span>{status.label}</span>
      {showDetail && status.detail && (
        <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
          · {status.detail}
        </span>
      )}
    </div>
  );
}
