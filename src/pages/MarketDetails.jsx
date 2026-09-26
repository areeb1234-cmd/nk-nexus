import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Heart,
  Share2,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Navigation,
  FileText,
  ShieldCheck
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import MarketStatus from '../components/MarketStatus';
import MarketCard from '../components/MarketCard';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';
import { getMarketStatus, calculateDistanceKm } from '../utils/marketStatus';

// Images
import heroFarmersMarket from '../assets/images/hero_farmers_market_1790278803277.jpg';
import marketPavilion from '../assets/images/market_pavilion_scene_1790278821669.jpg';
import harvestBasket from '../assets/images/seasonal_harvest_basket_1790278834057.jpg';
import farmLandscape from '../assets/images/sustainable_farm_landscape_1790278849275.jpg';

const imagePool = [heroFarmersMarket, marketPavilion, harvestBasket, farmLandscape];

export default function MarketDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    favoriteMarkets,
    toggleFavoriteMarket,
    sessionNotes,
    updateSessionNote,
    shareMarketOrPage,
    userLocation
  } = useApp();

  const marketIndex = marketsData.findIndex((m) => m.slug === slug);
  const market = marketsData[marketIndex];

  if (!market) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>Market Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          We could not locate the farmers market you requested.
        </p>
        <Link to="/markets" className="btn btn-primary">
          Return to Market Directory
        </Link>
      </div>
    );
  }

  const isFavorite = favoriteMarkets.includes(market.id);
  const status = getMarketStatus(market);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDayName = new Date().toLocaleDateString(undefined, { weekday: 'long' });

  const heroImg = imagePool[marketIndex % imagePool.length];

  // Related markets in same area or overall
  const relatedMarkets = marketsData
    .filter((m) => m.id !== market.id && (m.area === market.area || m.featured))
    .slice(0, 3);

  // Proximity
  const distance =
    userLocation.coords && market.coordinates
      ? calculateDistanceKm(
          userLocation.coords.lat,
          userLocation.coords.lng,
          market.coordinates.lat,
          market.coordinates.lng
        )
      : null;

  return (
    <div className="market-details-page" style={{ paddingTop: 28, paddingBottom: 80 }}>
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'Markets', link: '/markets' },
            { label: market.name }
          ]}
        />

        {/* Hero Media Banner */}
        <div
          className="market-hero-banner"
          style={{
            position: 'relative',
            height: '420px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: 36,
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <img
            src={heroImg}
            alt={market.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            referrerPolicy="no-referrer"
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(4, 16, 9, 0.85) 0%, rgba(4, 16, 9, 0.2) 60%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '36px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <MarketStatus market={market} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem' }}>·</span>
              <span style={{ color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600 }}>
                {market.area} · {market.neighborhood}
              </span>
              {distance !== null && (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem' }}>·</span>
                  <span style={{ color: 'var(--color-mint-bright)', fontSize: '0.8125rem', fontWeight: 700 }}>
                    {distance} km away from your location
                  </span>
                </>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 10 }}>
              {market.name}
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.85)', maxWidth: 640 }}>
              {market.tagline}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-card)',
            padding: '16px 24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            marginBottom: 36,
            flexWrap: 'wrap',
            gap: 16
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <MapPin size={16} style={{ color: 'var(--color-leaf)' }} />
            <span>{market.address}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className={`btn btn-sm ${isFavorite ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => toggleFavoriteMarket(market.id)}
              style={{ gap: 6 }}
            >
              <Heart size={15} fill={isFavorite ? '#FFFFFF' : 'none'} />
              <span>{isFavorite ? 'Saved in Basket' : 'Save to Basket'}</span>
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => shareMarketOrPage(market.name, `Discover fresh produce at ${market.name} on FreshFind!`)}
              style={{ gap: 6 }}
            >
              <Share2 size={15} />
              <span>Share Market</span>
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Details Left, Schedule & Notes Right */}
        <div className="split-grid-wide" style={{ gap: 36, marginBottom: 64 }}>
          {/* Left Column */}
          <div>
            {/* About Market */}
            <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', marginBottom: 28 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-forest-darkest)', marginBottom: 16 }}>
                About the Market
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
                {market.description}
              </p>

              {/* Verified Market Amenities */}
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 12 }}>
                Amenities & Eco-Features
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {market.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.8125rem',
                      color: 'var(--color-forest)',
                      background: 'var(--color-mint-tint)',
                      border: '1px solid rgba(82, 183, 136, 0.25)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    <CheckCircle2 size={13} style={{ color: 'var(--color-leaf)' }} />
                    <span>{item}</span>
                  </span>
                ))}
              </div>

              {/* Contact & Management */}
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 12 }}>
                Market Coordinator
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={15} style={{ color: 'var(--color-leaf)' }} />
                  <span>{market.contact.manager}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={15} style={{ color: 'var(--color-leaf)' }} />
                  <span>{market.contact.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mail size={15} style={{ color: 'var(--color-leaf)' }} />
                  <span>{market.contact.email}</span>
                </div>
              </div>
            </div>

            {/* Specialty Produce Available */}
            <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-forest-darkest)', marginBottom: 16 }}>
                Fresh Produce Stocked at this Market
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                Vendors at {market.name} specialize in these seasonal items. Click any crop to learn more in our Produce Guide.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {market.produce.map((crop, idx) => (
                  <Link
                    key={idx}
                    to="/produce"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 14px',
                      background: 'var(--color-cream)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--color-forest)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <Sparkles size={14} style={{ color: 'var(--color-leaf)' }} />
                    <span>{crop}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Weekly Schedule & Notes */}
          <div>
            {/* Weekly Timetable */}
            <div style={{ background: '#FFFFFF', padding: 28, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-forest-darkest)' }}>
                  Weekly Timetable
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Today: {todayDayName}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {daysOfWeek.map((day) => {
                  const isToday = day === todayDayName;
                  const hours = market.hours[day] || 'Closed';
                  const isOpenToday = isToday && !hours.toLowerCase().includes('closed');

                  return (
                    <div
                      key={day}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: isToday ? 'var(--color-mint-tint)' : 'var(--color-cream)',
                        border: isToday ? '1px solid rgba(82, 183, 136, 0.4)' : '1px solid transparent',
                        fontSize: '0.84375rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--color-forest)' : 'var(--text-primary)' }}>
                          {day}
                        </span>
                        {isToday && (
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-leaf)', textTransform: 'uppercase' }}>
                            (Today)
                          </span>
                        )}
                      </div>
                      <span
                        className="tabular-nums"
                        style={{
                          fontWeight: 600,
                          color: hours.toLowerCase().includes('closed') ? 'var(--text-muted)' : 'var(--color-forest)'
                        }}
                      >
                        {hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Session Notes Panel (SRS strictly requires session-only notes) */}
            <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <FileText size={18} style={{ color: 'var(--color-leaf)' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest-darkest)' }}>
                  Session Shopping Note
                </h4>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                Private note for this visit. Stored only in your active browser session.
              </p>
              <textarea
                rows={4}
                placeholder="e.g. Ask for Elena's heirloom tomatoes; bring 3 canvas tote bags..."
                value={sessionNotes[market.id] || ''}
                onChange={(e) => updateSessionNote(market.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--color-cream)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>✓ Automatically saved to browser session</span>
                <Link to="/bookmarks" style={{ color: 'var(--color-leaf)', fontWeight: 600 }}>
                  View All Saved Notes
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Markets */}
        {relatedMarkets.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-forest-darkest)' }}>
                More Markets in {market.area}
              </h3>
              <Link to="/markets" className="btn btn-sm btn-ghost">
                Browse Directory
              </Link>
            </div>
            <div className="grid-3">
              {relatedMarkets.map((rm, idx) => (
                <MarketCard key={rm.id} market={rm} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
