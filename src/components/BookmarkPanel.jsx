import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, Download, Share2, Trash2, MapPin, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';

export default function BookmarkPanel() {
  const {
    isBookmarkDrawerOpen,
    setIsBookmarkDrawerOpen,
    favoriteMarkets,
    favoriteProduce,
    sessionNotes,
    toggleFavoriteMarket,
    toggleFavoriteProduce,
    updateSessionNote,
    exportBookmarks,
    shareMarketOrPage
  } = useApp();

  if (!isBookmarkDrawerOpen) return null;

  const savedMarketsList = marketsData.filter((m) => favoriteMarkets.includes(m.id));
  const savedProduceList = produceData.filter((p) => favoriteProduce.includes(p.id));
  const totalSaved = savedMarketsList.length + savedProduceList.length;

  return (
    <>
      <div className="drawer-backdrop premium-bookmark-backdrop" onClick={() => setIsBookmarkDrawerOpen(false)} />
      <div className="drawer-panel premium-bookmark-drawer" role="dialog" aria-modal="true" aria-label="My Saved Fresh Finds">
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--color-mint-tint)',
                color: 'var(--color-leaf)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Heart size={16} fill="var(--color-leaf)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-forest-darkest)' }}>
                My Fresh Finds
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {totalSaved} items in your harvest basket
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsBookmarkDrawerOpen(false)}
            style={{ color: 'var(--text-secondary)', padding: 4 }}
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bookmark-drawer-summary" aria-label="Basket summary">
          <span><strong>{savedMarketsList.length}</strong> markets</span>
          <span><strong>{savedProduceList.length}</strong> produce</span>
          <span><strong>{totalSaved}</strong> saved</span>
        </div>

        <div className="drawer-body">
          {totalSaved === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Sparkles size={40} style={{ color: 'var(--color-leaf-bright)', margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 8 }}>Your basket is empty</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
                Heart any local farmers market or produce item to create your personalized visit itinerary.
              </p>
              <Link
                to="/markets"
                onClick={() => setIsBookmarkDrawerOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Explore Farmers Markets
              </Link>
            </div>
          ) : (
            <>
              {/* Markets section */}
              {savedMarketsList.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-leaf)', marginBottom: 12 }}>
                    Saved Markets ({savedMarketsList.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {savedMarketsList.map((m) => (
                      <div
                        key={m.id}
                        className="bookmark-drawer-card bookmark-market-mini-card"
                        style={{
                          background: 'var(--color-cream)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: 14
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                          <Link
                            to={`/market/${m.slug}`}
                            onClick={() => setIsBookmarkDrawerOpen(false)}
                            style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-forest)' }}
                          >
                            {m.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleFavoriteMarket(m.id)}
                            style={{ color: 'var(--text-muted)' }}
                            title="Remove"
                            aria-label={`Remove ${m.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                          <MapPin size={11} />
                          <span>{m.address}</span>
                        </div>

                        {/* Session note input */}
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed var(--border-subtle)' }}>
                          <label style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-leaf-deep)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                            <FileText size={10} />
                            <span>Session Note:</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Add reminder (e.g. check tomato stall)..."
                            value={sessionNotes[m.id] || ''}
                            onChange={(e) => updateSessionNote(m.id, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px 10px',
                              fontSize: '0.75rem',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              background: '#FFFFFF'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Produce section */}
              {savedProduceList.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-leaf)', marginBottom: 12 }}>
                    Saved Produce ({savedProduceList.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {savedProduceList.map((p) => (
                      <div
                        key={p.id}
                        className="bookmark-drawer-card bookmark-produce-mini-card"
                        style={{
                          background: 'var(--color-cream)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: 14
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                              {p.name}
                            </span>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-leaf)', fontWeight: 600 }}>
                              {p.priceRange} · {p.category}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleFavoriteProduce(p.id)}
                            style={{ color: 'var(--text-muted)' }}
                            title="Remove"
                            aria-label={`Remove ${p.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {/* Session note input */}
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed var(--border-subtle)' }}>
                          <input
                            type="text"
                            placeholder="Add produce note (e.g. 2 lbs ripe)..."
                            value={sessionNotes[p.id] || ''}
                            onChange={(e) => updateSessionNote(p.id, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px 10px',
                              fontSize: '0.75rem',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              background: '#FFFFFF'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {totalSaved > 0 && (
          <div className="drawer-footer">
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={exportBookmarks}
            >
              <Download size={15} />
              <span>Export Itinerary (.txt)</span>
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => shareMarketOrPage('FreshFind Harvest Basket', 'Check out my local market basket on FreshFind!')}
              title="Share Basket"
              aria-label="Share Basket"
            >
              <Share2 size={15} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
