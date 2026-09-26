import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Sparkles, Filter, RotateCcw, Box } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import ProduceCard from '../components/ProduceCard';
import produceData from '../data/produce.json';
import categoriesData from '../data/categories.json';

export default function Produce() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSeason, setSelectedSeason] = useState('All');

  const seasons = ['All', 'Spring', 'Summer', 'Autumn', 'Winter', 'Year-Round'];

  const filteredProduce = useMemo(() => {
    return produceData.filter((p) => {
      const matchQuery =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        selectedCategory === 'All' || p.category === selectedCategory;

      const matchSeason =
        selectedSeason === 'All' || p.season === selectedSeason;

      return matchQuery && matchCat && matchSeason;
    });
  }, [searchQuery, selectedCategory, selectedSeason]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSeason('All');
  };

  return (
    <div className="produce-page" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Produce Guide' }]} />

        <div style={{ marginBottom: 36 }}>
          <span className="section-kicker">Heirloom Catalog</span>
          <h1 className="section-title">Fresh Produce Guide</h1>
          <p className="section-subtitle">
            Explore 32+ certified seasonal fruits, vegetables, culinary botanicals, and farmstead staples harvested locally by our regional grower network.
          </p>
        </div>

        {/* Filter controls */}
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
          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by vegetable, fruit, herb name or nutrient..."
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

          {/* Category Tabs */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
              Category
            </label>
            <div className="filter-tabs">
              <button
                type="button"
                className={`filter-tab-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('All')}
              >
                All Produce
              </button>
              {categoriesData.filter((c) => c.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`filter-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Season Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 4 }}>
                Season:
              </span>
              {seasons.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`filter-tab-btn ${selectedSeason === s ? 'active' : ''}`}
                  style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                  onClick={() => setSelectedSeason(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            {(searchQuery || selectedCategory !== 'All' || selectedSeason !== 'All') && (
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-sm btn-outline"
                style={{ gap: 6 }}
              >
                <RotateCcw size={12} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Counter */}
        <div style={{ marginBottom: 24, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredProduce.length}</strong> items in season
        </div>

        {/* Produce Grid */}
        {filteredProduce.length === 0 ? (
          <div style={{ background: '#FFFFFF', padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
            <Sparkles size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>No produce items found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              Try clearing your search query or switching to 'All Produce'.
            </p>
            <button onClick={handleReset} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid-4">
            {filteredProduce.map((item, index) => (
              <ProduceCard
                key={item.id}
                produce={item}
                revealDelay={Math.min(index * 45, 360)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
