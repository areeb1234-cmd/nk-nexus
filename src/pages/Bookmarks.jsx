import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Download, Share2, Trash2, MapPin, Sparkles, FileText, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import MarketStatus from '../components/MarketStatus';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';

export default function Bookmarks() {
  const {
    favoriteMarkets,
    favoriteProduce,
    sessionNotes,
    toggleFavoriteMarket,
    toggleFavoriteProduce,
    updateSessionNote,
    exportBookmarks,
    shareMarketOrPage
  } = useApp();

  const savedMarketsList = marketsData.filter((m) => favoriteMarkets.includes(m.id));
  const savedProduceList = produceData.filter((p) => favoriteProduce.includes(p.id));
  const totalItems = savedMarketsList.length + savedProduceList.length;

  return (
    <div className="bookmarks-page bookmarks-premium-page" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'My Fresh Finds' }]} />

        <div className="bookmarks-premium-hero" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="section-kicker">Harvest Basket</span>
            <h1 className="section-title">My Saved Fresh Finds</h1>
            <p className="section-subtitle">
              Your personalized itinerary of weekly farmers markets, seasonal produce, and private session reminders.
            </p>
            <div className="bookmarks-hero-meta" aria-label="Saved basket summary">
              <span><strong>{savedMarketsList.length}</strong> markets saved</span>
              <span><strong>{savedProduceList.length}</strong> produce picks</span>
              <span><strong>{totalItems}</strong> total finds</span>
            </div>
          </div>

          {totalItems > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={exportBookmarks}
                style={{ gap: 8 }}
              >
                <Download size={16} />
                <span>Export Itinerary (.txt)</span>
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => shareMarketOrPage('FreshFind Harvest Basket', 'Here are my saved local markets on FreshFind!')}
                style={{ gap: 8 }}
              >
                <Share2 size={16} />
                <span>Share Basket</span>
              </button>
            </div>
          )}
        </div>

        {totalItems === 0 ? (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '80px 24px',
              textAlign: 'center',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Heart size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--color-forest-darkest)' }}>
              Your basket is currently empty
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Click the heart icon on any farmers market or seasonal crop to assemble your customized shopping route.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <Link to="/markets" className="btn btn-primary">
                Explore Markets
              </Link>
              <Link to="/produce" className="btn btn-outline">
                Browse Produce
              </Link>
            </div>
          </div>
        ) : (
          <div className="bookmarks-content-stack" style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {/* Markets Section */}
            {savedMarketsList.length > 0 && (
              <div className="saved-section saved-markets-section">
                <h3 className="saved-section-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-forest-darkest)', marginBottom: 20 }}>
                  Saved Farmers Markets ({savedMarketsList.length})
                </h3>

                <div className="grid-3">
                  {savedMarketsList.map((m) => (
                    <div
                      key={m.id}
                      className="saved-item-card saved-market-card"
                      style={{
                        background: '#FFFFFF',
                        borderRadius: 'var(--radius-lg)',
                        padding: 24,
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div className="saved-item-media saved-market-media" aria-hidden="true">
                        <span className="saved-item-media-badge">LOCAL MARKET</span>
                        <span className="saved-item-media-label">FreshFind destination</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {m.area}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleFavoriteMarket(m.id)}
                          style={{ color: '#DC2626' }}
                          title="Remove from basket"
                          aria-label={`Remove ${m.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <h4 style={{ fontSize: '1.1875rem', fontWeight: 800, color: 'var(--color-forest-darkest)', marginBottom: 6 }}>
                        <Link to={`/market/${m.slug}`}>{m.name}</Link>
                      </h4>

                      <div style={{ marginBottom: 12 }}>
                        <MarketStatus market={m} />
                      </div>

                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                        {m.address}
                      </p>

                      {/* Session Note */}
                      <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                        <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-leaf-deep)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                          <FileText size={11} />
                          <span>Session Note:</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Add note for this market..."
                          value={sessionNotes[m.id] || ''}
                          onChange={(e) => updateSessionNote(m.id, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            fontSize: '0.8125rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--color-cream)'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Produce Section */}
            {savedProduceList.length > 0 && (
              <div className="saved-section saved-produce-section">
                <h3 className="saved-section-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-forest-darkest)', marginBottom: 20 }}>
                  Saved Produce Items ({savedProduceList.length})
                </h3>

                <div className="grid-3">
                  {savedProduceList.map((p) => (
                    <div
                      key={p.id}
                      className="saved-item-card saved-produce-card"
                      style={{
                        background: '#FFFFFF',
                        borderRadius: 'var(--radius-lg)',
                        padding: 24,
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div className="saved-item-media saved-produce-media" aria-hidden="true">
                        <span className="saved-item-media-badge">SEASONAL PICK</span>
                        <span className="saved-item-media-label">Harvest guide ready</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {p.category} · {p.season}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleFavoriteProduce(p.id)}
                          style={{ color: '#DC2626' }}
                          title="Remove from basket"
                          aria-label={`Remove ${p.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <h4 style={{ fontSize: '1.1875rem', fontWeight: 800, color: 'var(--color-forest-darkest)', marginBottom: 6 }}>
                        {p.name}
                      </h4>

                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-leaf)', marginBottom: 12 }}>
                        {p.priceRange}
                      </div>

                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                        Storage Tip: {p.storageTip}
                      </p>

                      {/* Session Note */}
                      <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                        <input
                          type="text"
                          placeholder="Add harvest note..."
                          value={sessionNotes[p.id] || ''}
                          onChange={(e) => updateSessionNote(p.id, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            fontSize: '0.8125rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--color-cream)'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
