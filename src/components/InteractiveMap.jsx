import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ExternalLink, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MarketStatus from './MarketStatus';
import { calculateDistanceKm } from '../utils/marketStatus';

export default function InteractiveMap({ markets = [] }) {
  const { userLocation, requestLocation } = useApp();
  const [selectedMarket, setSelectedMarket] = useState(markets[0] || null);
  const [activeArea, setActiveArea] = useState('All');

  const areas = ['All', ...new Set(markets.map((m) => m.area))];

  const filteredMarkets =
    activeArea === 'All'
      ? markets
      : markets.filter((m) => m.area === activeArea);

  // Normalize coordinates across regional bounding box for visual SVG radar projection
  // Lat: ~37.72 to 37.83, Lng: -122.52 to -122.39
  const minLat = 37.71;
  const maxLat = 37.84;
  const minLng = -122.53;
  const maxLng = -122.38;

  const getCoordinatesPct = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(8, Math.min(92, y))
    };
  };

  return (
    <div
      style={{
        background: 'rgba(8, 27, 18, 0.92)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(82, 183, 136, 0.4)',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(82, 183, 136, 0.15)',
        backdropFilter: 'blur(16px)',
        color: '#FFFFFF'
      }}
    >
      {/* Control bar */}
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', maxWidth: '100%' }}>
          <Compass size={16} style={{ color: '#4ADE80' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#4ADE80', textTransform: 'uppercase', marginRight: 4 }}>
            Area:
          </span>
          {areas.map((area) => (
            <button
              key={area}
              type="button"
              className={`filter-tab-btn ${activeArea === area ? 'active' : ''}`}
              style={{ padding: '4px 12px', fontSize: '0.75rem', background: activeArea === area ? '#1B4D31' : 'rgba(255,255,255,0.08)', color: '#FFFFFF', border: '1px solid rgba(82,183,136,0.3)' }}
              onClick={() => setActiveArea(area)}
            >
              {area}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={requestLocation}
          className="btn btn-sm btn-secondary"
          style={{ gap: 6 }}
        >
          <Navigation size={13} />
          <span>{userLocation.coords ? 'GPS Location Active' : 'Use My Location'}</span>
        </button>
      </div>

      <div
        className="split-grid-wide"
        style={{
          minHeight: '440px'
        }}
      >
        {/* Visual Map Surface */}
        <div
          style={{
            position: 'relative',
            background: 'radial-gradient(ellipse at center, #E8F4EC 0%, #D8EADF 100%)',
            overflow: 'hidden',
            borderRight: '1px solid var(--border-subtle)',
            minHeight: '360px'
          }}
        >
          {/* Subtle grid lines */}
          <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' }}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2D6A4F" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* User Location Marker if active */}
          {userLocation.coords && (
            (() => {
              const userPct = getCoordinatesPct(userLocation.coords.lat, userLocation.coords.lng);
              return (
                <div
                  style={{
                    position: 'absolute',
                    left: `${userPct.x}%`,
                    top: `${userPct.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20,
                    pointerEvents: 'none'
                  }}
                  title="Your Current Location"
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#2563EB',
                      border: '3px solid #FFFFFF',
                      boxShadow: '0 0 14px rgba(37, 99, 235, 0.7)'
                    }}
                  />
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: '#1E3A8A',
                      background: 'rgba(255,255,255,0.9)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      marginTop: 2,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    You are here
                  </div>
                </div>
              );
            })()
          )}

          {/* Market Beacons */}
          {filteredMarkets.map((market) => {
            const { x, y } = getCoordinatesPct(market.coordinates.lat, market.coordinates.lng);
            const isSelected = selectedMarket && selectedMarket.id === market.id;

            return (
              <button
                key={market.id}
                type="button"
                onClick={() => setSelectedMarket(market)}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 8,
                  zIndex: isSelected ? 15 : 10,
                  transition: 'transform var(--transition-fast)'
                }}
                aria-label={`Select ${market.name}`}
              >
                <div
                  style={{
                    position: 'relative',
                    width: isSelected ? 32 : 24,
                    height: isSelected ? 32 : 24,
                    borderRadius: '50%',
                    background: isSelected ? 'var(--color-forest-darkest)' : 'var(--color-forest)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isSelected ? '0 0 16px rgba(13, 40, 24, 0.5)' : 'var(--shadow-subtle)',
                    border: '2px solid #FFFFFF',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <MapPin size={isSelected ? 16 : 12} />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 0.94)',
                    backdropFilter: 'blur(4px)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: isSelected ? 'var(--color-forest)' : 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    marginTop: 2,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  {market.name.split(' ')[0]}
                </div>
              </button>
            );
          })}

          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              background: 'rgba(255, 255, 255, 0.85)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.6875rem',
              color: 'var(--text-muted)'
            }}
          >
            Regional Coordinate Grid · Click any pin
          </div>
        </div>

        {/* Selected Market Info Panel */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', background: 'rgba(8, 27, 18, 0.95)' }}>
          {selectedMarket ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {selectedMarket.area} · {selectedMarket.neighborhood}
                </span>
                <MarketStatus market={selectedMarket} />
              </div>

              <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
                {selectedMarket.name}
              </h4>

              <p style={{ fontSize: '0.875rem', color: '#D8F3DC', lineHeight: 1.55, marginBottom: 16, opacity: 0.95 }}>
                {selectedMarket.description}
              </p>

              <div style={{ background: 'rgba(4, 16, 9, 0.7)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid rgba(82, 183, 136, 0.25)', marginBottom: 16, fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontWeight: 700, color: '#4ADE80' }}>
                  <Clock size={13} style={{ color: '#4ADE80' }} />
                  <span>Market Schedule:</span>
                </div>
                <div style={{ color: '#D8F3DC', fontWeight: 600 }}>
                  {selectedMarket.days.join(', ')} ·{' '}
                  {selectedMarket.days[0] && selectedMarket.hours[selectedMarket.days[0]]
                    ? selectedMarket.hours[selectedMarket.days[0]]
                    : 'See details'}
                </div>
                <div style={{ color: '#A7F3D0', marginTop: 4, opacity: 0.85 }}>
                  Address: {selectedMarket.address}
                </div>
              </div>

              {/* Distance from GPS */}
              {userLocation.coords && (
                <div style={{ fontSize: '0.8125rem', color: '#4ADE80', fontWeight: 700, marginBottom: 16 }}>
                  📍 Estimated distance: {calculateDistanceKm(userLocation.coords.lat, userLocation.coords.lng, selectedMarket.coordinates.lat, selectedMarket.coordinates.lng)} km from you
                </div>
              )}

              <div style={{ marginTop: 'auto' }}>
                <Link
                  to={`/market/${selectedMarket.slug}`}
                  className="btn btn-primary"
                  style={{ width: '100%', gap: 6 }}
                >
                  <span>Open Full Market Guide</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              Select a market pin to view full details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
