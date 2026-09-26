import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
      <Link to="/" className="breadcrumb-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Home size={14} />
        <span>Home</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          {item.link ? (
            <Link to={item.link} className="breadcrumb-link">
              {item.label}
            </Link>
          ) : (
            <span className="breadcrumb-current" aria-current="page">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
