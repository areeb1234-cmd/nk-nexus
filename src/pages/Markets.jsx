import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, LayoutGrid, List, SlidersHorizontal, RotateCcw, Navigation } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import MarketCard from '../components/MarketCard';
import MarketStatus from '../components/MarketStatus';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';
import { calculateDistanceKm, getMarketStatus } from '../utils/marketStatus';

export default function Markets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userLocation, requestLocation } = useApp();

  // Search & Filter State
  const initialArea = searchParams.get('area') || 'All';
  const initialDay = searchParams.get('day') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedProduce, setSelectedProduce] = useState('All');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'name', 'distance', 'rating'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const areas = ['All', 'Downtown', 'Harbor District', 'North Hills', 'Midtown', 'West End', 'Suburban Valley', 'Historic Core'];
  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // All unique produce options for dropdown filter
  const allProduceNames = useMemo(() => {
    const set = new Set();
    marketsData.forEach((m) => m.produce.forEach((p) => set.add(p)));
    return ['All', ...Array.from(set).sort()];
  }, []);

  // Filtered and sorted markets
  const processedMarkets = useMemo(() => {
    return marketsData
      .filter((m) => {
        // Query match
        const matchesQuery =
          !searchQuery ||
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.produce.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

        // Area match
        const matchesArea = selectedArea === 'All' || m.area === selectedArea;

        // Day match
        const matchesDay = selectedDay === 'All' || m.days.includes(selectedDay);

        // Produce match
        const matchesProduce =
          selectedProduce === 'All' || m.produce.includes(selectedProduce);

        // Open now filter
        const status = getMarketStatus(m);
        const matchesOpen = !onlyOpenNow || status.code === 'open';

        return matchesQuery && matchesArea && matchesDay && matchesProduce && matchesOpen;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'distance' && userLocation.coords) {
          const distA = calculateDistanceKm(
            userLocation.coords.lat,
            userLocation.coords.lng,
            a.coordinates.lat,
            a.coordinates.lng
          ) || 9999;
          const distB = calculateDistanceKm(
            userLocation.coords.lat,
            userLocation.coords.lng,
            b.coordinates.lat,
            b.coordinates.lng
          ) || 9999;
          return distA - distB;
        }
        // Default featured
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [searchQuery, selectedArea, selectedDay, selectedProduce, onlyOpenNow, sortBy, userLocation.coords]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedArea('All');
    setSelectedDay('All');
    setSelectedProduce('All');
    setOnlyOpenNow(false);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="markets-page" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Farmers Markets' }]} />

        <div style={{ marginBottom: 36 }}>
          <span className="section-kicker">Regional Directory</span>
          <h1 className="section-title">Farmers Markets Directory</h1>
          <p className="section-subtitle">
            Browse certified organic and regenerative farmers markets across the region. Check live operating hours, specialty stalls, and real-time proximity.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            background: 'var(--surface-card)',
            borderRadius: 'var(--radius-xl)',
            padding: 24,
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: 36
          }}
        >
          {/* Main search input */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by market name, neighborhood, address, or produce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: 48,
                padding: '0 16px 0 46px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--color-cream)',
                fontSize: '0.9375rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Secondary filter selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Area / District
              </label>
              <select
                className="discovery-select"
                style={{ paddingLeft: 12 }}
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a === 'All' ? 'All Areas' : a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Day of Week
              </label>
              <select
                className="discovery-select"
                style={{ paddingLeft: 12 }}
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'Any Day' : d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Specific Produce
              </label>
              <select
                className="discovery-select"
                style={{ paddingLeft: 12 }}
                value={selectedProduce}
                onChange={(e) => setSelectedProduce(e.target.value)}
              >
                {allProduceNames.map((p) => (
                  <option key={p} value={p}>
                    {p === 'All' ? 'All Produce' : p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Sort By
              </label>
              <select
                className="discovery-select"
                style={{ paddingLeft: 12 }}
                value={sortBy}
                onChange={(e) => {
                  if (e.target.value === 'distance' && !userLocation.coords) {
                    requestLocation();
                  }
                  setSortBy(e.target.value);
                }}
              >
                <option value="featured">Featured First</option>
                <option value="name">Alphabetical (A - Z)</option>
                <option value="distance">Proximity (Closest First)</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Toggle options & reset bar */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-forest)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={onlyOpenNow}
                  onChange={(e) => setOnlyOpenNow(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--color-leaf)' }}
                />
                <span>Open Right Now Only</span>
              </label>

              {!userLocation.coords && (
                <button
                  type="button"
                  onClick={requestLocation}
                  className="btn btn-sm btn-ghost"
                  style={{ fontSize: '0.75rem', gap: 4 }}
                >
                  <Navigation size={12} />
                  <span>Enable Proximity Sorting</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* View Mode Toggle */}
              <div style={{ display: 'flex', background: 'var(--color-cream-muted)', borderRadius: 'var(--radius-sm)', padding: 2 }}>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--color-forest)' : 'var(--text-muted)'
                  }}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                    color: viewMode === 'list' ? 'var(--color-forest)' : 'var(--text-muted)'
                  }}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-sm btn-outline"
                style={{ gap: 6 }}
              >
                <RotateCcw size={12} />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <div>
            Showing <strong>{processedMarkets.length}</strong> of {marketsData.length} Farmers Markets
          </div>
          {userLocation.coords && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-leaf)', fontWeight: 600 }}>
              ✓ Distances calculated from your device GPS
            </div>
          )}
        </div>

        {/* Empty State */}
        {processedMarkets.length === 0 ? (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '64px 20px',
              textAlign: 'center',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <SlidersHorizontal size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8, color: 'var(--color-forest-darkest)' }}>
              No markets match your criteria
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 24px' }}>
              We couldn't find any markets matching your current combination of area, day, or produce filters.
            </p>
            <button type="button" onClick={handleResetFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Grid or List View */
          <div className={viewMode === 'grid' ? 'grid-3' : 'grid-2'}>
            {processedMarkets.map((market, idx) => (
              <MarketCard key={market.id} market={market} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
