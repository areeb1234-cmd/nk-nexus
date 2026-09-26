import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Compass,
  Navigation,
  CheckCircle2,
  TreeDeciduous,
  Leaf,
  Globe,
  Clock,
  Download,
  MessageSquare
} from 'lucide-react';
import HeroVideoShowcase from '../components/HeroVideoShowcase';
import ScrollVideoBackground from '../components/video/ScrollVideoBackground';
import LiveClock from '../components/LiveClock';
import VisitorCounter from '../components/VisitorCounter';
import AnimatedCounter from '../components/AnimatedCounter';
import MarketCard from '../components/MarketCard';
import ProduceCard from '../components/ProduceCard';
import InteractiveMap from '../components/InteractiveMap';
import MarketStatus from '../components/MarketStatus';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';
import seasonsData from '../data/seasons.json';
import categoriesData from '../data/categories.json';

// High-fidelity image assets
import marketScene from '../assets/images/market_pavilion_scene_1790278821669.jpg';
import harvestBasket from '../assets/images/seasonal_harvest_basket_1790278834057.jpg';
import farmLandscape from '../assets/images/sustainable_farm_landscape_1790278849275.jpg';
import fruitsBasket from '../assets/images/fruits_basket_cinematic_1790321893623.jpg';

export default function Home() {
  const { userLocation, requestLocation, setIsChatOpen, setIsBookmarkDrawerOpen } = useApp();

  // Scroll Video Background Active State
  const [isVideoScrollActive, setIsVideoScrollActive] = useState(true);

  // Discovery Filter States
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedProduce, setSelectedProduce] = useState('All');

  // Produce Section Filter State
  const [activeProduceCategory, setActiveProduceCategory] = useState('All');

  // Weekly Schedule Active Day Tab
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDayName = new Date().toLocaleDateString(undefined, { weekday: 'long' });
  const [scheduleDay, setScheduleDay] = useState(todayDayName);

  // Filter discovery markets
  const discoveryMarkets = marketsData.filter((m) => {
    const matchArea = selectedArea === 'All' || m.area === selectedArea;
    const matchDay = selectedDay === 'All' || m.days.includes(selectedDay);
    const matchProduce = selectedProduce === 'All' || m.produce.some((p) => p.toLowerCase().includes(selectedProduce.toLowerCase()));
    return matchArea && matchDay && matchProduce;
  });

  // Filter produce items for guide section
  const filteredProduce =
    activeProduceCategory === 'All'
      ? produceData.slice(0, 8)
      : produceData.filter((p) => p.category === activeProduceCategory).slice(0, 8);

  // Markets open on the selected schedule day
  const scheduleMarkets = marketsData.filter((m) => m.days.includes(scheduleDay));

  const handleHeroPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--hero-spot-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--hero-spot-y', `${event.clientY - rect.top}px`);
  };

  const handleMagneticMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const strength = 0.10;
    event.currentTarget.style.transform = `translate3d(${Math.max(-7, Math.min(7, dx * strength)).toFixed(2)}px, ${Math.max(-7, Math.min(7, dy * strength)).toFixed(2)}px, 0)`;
  };

  const handleMagneticLeave = (event) => {
    event.currentTarget.style.transform = '';
  };

  return (
    <div className="home-page" style={{ position: 'relative' }}>
      {/* Full-Screen Cinematic Harvest Video Moving & Scrubbing on Scroll */}
      <ScrollVideoBackground isEnabled={isVideoScrollActive} />

      {/* --------------------------------------------------------------------
          SECTION 01: CINEMATIC HERO
          -------------------------------------------------------------------- */}
      <section className="hero-section section-subtle" onPointerMove={handleHeroPointerMove}>
        {/* Hero background video: full-section cinematic layer, not a card/div video. */}
        <video
          className="hero-section-background-video"
          src="/freshfind-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="hero-section-background-overlay" aria-hidden="true" />
        <div className="container hero-section-content">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-headline">
                Fresh <span className="gradient-text">All Along.</span>
              </h1>

              <p className="hero-subhead">
                Discover local farmers markets. Find what is freshly harvested today. Plan your next regenerative food journey.
              </p>

              <div className="hero-actions">
                <Link
                  to="/markets"
                  className="btn btn-lg btn-primary hero-magnetic-cta"
                  onPointerMove={handleMagneticMove}
                  onPointerLeave={handleMagneticLeave}
                >
                  <span>Find a Market</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/produce"
                  className="btn btn-lg btn-secondary hero-magnetic-cta"
                  onPointerMove={handleMagneticMove}
                  onPointerLeave={handleMagneticLeave}
                >
                  <span>Explore Produce</span>
                </Link>
              </div>

              {/* Verified Metrics */}
              <div className="hero-metrics">
                <div className="hero-metric-item">
                  <span className="hero-metric-number tabular-nums"><AnimatedCounter value={14} suffix="+" /></span>
                  <span className="hero-metric-label">Regional Markets</span>
                </div>
                <div className="hero-metric-item">
                  <span className="hero-metric-number tabular-nums"><AnimatedCounter value={32} suffix="+" /></span>
                  <span className="hero-metric-label">Heirloom Crops</span>
                </div>
                {/* <div className="hero-metric-item">
                  <span className="hero-metric-number tabular-nums"><AnimatedCounter value={100} suffix="%" /></span>
                  <span className="hero-metric-label">Zero Backend Storage</span>
                </div> */}
              </div>
            </div>

            {/* Interactive Harvest Video Scroll Scene & Brand Showcase */}
            <div className="hero-visual">
              <HeroVideoShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 02: LIVE MARKET DISCOVERY & CLOCK
          -------------------------------------------------------------------- */}
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="discovery-bar">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span className="section-kicker">Real-Time Radar</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-forest-darkest)' }}>
                  What’s Fresh Near You?
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <LiveClock />
                <button
                  type="button"
                  onClick={requestLocation}
                  className="btn btn-sm btn-secondary"
                  style={{ gap: 6 }}
                >
                  <Navigation size={13} />
                  <span>{userLocation.coords ? 'GPS Proximity Active' : 'Use My Location'}</span>
                </button>
              </div>
            </div>

            {/* Discovery search form */}
            <div className="discovery-grid">
              <div className="discovery-field">
                <label className="discovery-label">Search Area</label>
                <div className="discovery-input-wrapper">
                  <MapPin size={16} className="discovery-input-icon" />
                  <select
                    className="discovery-select"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                  >
                    <option value="All">All Neighborhoods</option>
                    <option value="Downtown">Downtown District</option>
                    <option value="Harbor District">Harbor District</option>
                    <option value="North Hills">North Hills</option>
                    <option value="Midtown">Midtown</option>
                    <option value="West End">West End</option>
                    <option value="Suburban Valley">Suburban Valley</option>
                    <option value="Historic Core">Historic Core</option>
                  </select>
                </div>
              </div>

              <div className="discovery-field">
                <label className="discovery-label">Day of Week</label>
                <div className="discovery-input-wrapper">
                  <Calendar size={16} className="discovery-input-icon" />
                  <select
                    className="discovery-select"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                  >
                    <option value="All">Any Day</option>
                    <option value="Saturday">Saturday (Peak Markets)</option>
                    <option value="Sunday">Sunday Markets</option>
                    <option value="Wednesday">Wednesday Midweek</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday Afternoon</option>
                    <option value="Monday">Monday Morning</option>
                  </select>
                </div>
              </div>

              <div className="discovery-field">
                <label className="discovery-label">Produce Specialty</label>
                <div className="discovery-input-wrapper">
                  <Sparkles size={16} className="discovery-input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Tomatoes, Apples, Honey..."
                    className="discovery-input"
                    value={selectedProduce === 'All' ? '' : selectedProduce}
                    onChange={(e) => setSelectedProduce(e.target.value || 'All')}
                  />
                </div>
              </div>

              <div style={{ alignSelf: 'flex-end' }}>
                <Link
                  to={`/markets?area=${selectedArea}&day=${selectedDay}`}
                  className="btn btn-primary"
                  style={{ height: 44, width: '100%', gap: 8 }}
                >
                  <Search size={16} />
                  <span>Explore {discoveryMarkets.length} Markets</span>
                </Link>
              </div>
            </div>

            {/* Quick summary of results */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-on-dark-muted)' }}>
              <span>
                Showing {discoveryMarkets.length} matching farmers markets across the region
              </span>
              {(selectedArea !== 'All' || selectedDay !== 'All' || selectedProduce !== 'All') && (
                <button
                  onClick={() => {
                    setSelectedArea('All');
                    setSelectedDay('All');
                    setSelectedProduce('All');
                  }}
                  style={{ color: 'var(--color-leaf)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Reset Discovery Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 03: MARKET EXPLORER (Interactive Map Radar)
          -------------------------------------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-kicker">Spatial Navigation</span>
            <h2 className="section-title">Interactive Market Explorer</h2>
            <p className="section-subtitle">
              Locate markets geographically across the valley, inspect live operating hours, and calculate your exact travel distance with browser geolocation.
            </p>
          </div>

          <InteractiveMap markets={marketsData} />
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 04: FEATURED MARKETS SHOWCASE
          -------------------------------------------------------------------- */}
      <section id="featured-markets-section" className="section section-subtle featured-markets-section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="section-kicker">Curated Destinations</span>
              <h2 className="section-title" style={{ margin: 0 }}>Featured Farmers Markets</h2>
            </div>
            <Link to="/markets" className="btn btn-outline" style={{ gap: 6 }}>
              <span>View All 14 Markets</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-3">
            {marketsData.filter((m) => m.featured).slice(0, 6).map((market, idx) => (
              <MarketCard key={market.id} market={market} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 05: WHY FRESHFIND (Storytelling Pillars)
          -------------------------------------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-kicker">The Regenerative Difference</span>
            <h2 className="section-title">Built for Conscious Marketgoers</h2>
            <p className="section-subtitle">
              Bridging the gap between small family farmsteads and modern urban tables through transparent, open data.
            </p>
          </div>

          <div className="grid-4" style={{ gap: 28 }}>
            <div style={{ 
              background: 'rgba(8, 27, 18, 0.88)', 
              padding: 32, 
              minHeight: 250, 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid rgba(82, 183, 136, 0.35)', 
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)', 
              backdropFilter: 'blur(16px)' 
              }}>
              <div style={{ 
                width: 52, 
                height: 52, 
                borderRadius: 'var(--radius-md)', 
                background: 'rgba(82, 183, 136, 0.2)', 
                color: '#4ADE80', display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: 20, 
                border: '1px solid rgba(82, 183, 136, 0.35)' 
                }}>
                <Compass size={25} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 10, color: '#FFFFFF' }}>
                Discover Local
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#D8F3DC', lineHeight: 1.6, opacity: 0.95 }}>
                Instant GPS proximity calculations connecting you directly with certified growers within a 15-mile regional radius.
              </p>
            </div>

            <div style={{ background: 'rgba(8, 27, 18, 0.88)', padding: 32, minHeight: 250, borderRadius: 'var(--radius-lg)', border: '1px solid rgba(82, 183, 136, 0.35)', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(16px)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'rgba(82, 183, 136, 0.2)', color: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '1px solid rgba(82, 183, 136, 0.35)' }}>
                <Leaf size={25} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 10, color: '#FFFFFF' }}>
                Know What’s Fresh
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#D8F3DC', lineHeight: 1.6, opacity: 0.95 }}>
                Track peak harvest calendars across Spring, Summer, Autumn, and Winter with zero cold-storage mystery.
              </p>
            </div>

            <div style={{ background: 'rgba(8, 27, 18, 0.88)', padding: 32, minHeight: 250, borderRadius: 'var(--radius-lg)', border: '1px solid rgba(82, 183, 136, 0.35)', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(16px)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'rgba(82, 183, 136, 0.2)', color: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '1px solid rgba(82, 183, 136, 0.35)' }}>
                <Clock size={25} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 10, color: '#FFFFFF' }}>
                Plan Smarter
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#D8F3DC', lineHeight: 1.6, opacity: 0.95 }}>
                Live clock synchronization warns you whether stalls are OPEN NOW, closing soon, or preparing for the weekend.
              </p>
            </div>

            <div style={{ background: 'rgba(8, 27, 18, 0.88)', padding: 32, minHeight: 250, borderRadius: 'var(--radius-lg)', border: '1px solid rgba(82, 183, 136, 0.35)', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(16px)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'rgba(82, 183, 136, 0.2)', color: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '1px solid rgba(82, 183, 136, 0.35)' }}>
                <TreeDeciduous size={25} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 10, color: '#FFFFFF' }}>
                Support Ecosystems
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#D8F3DC', lineHeight: 1.6, opacity: 0.95 }}>
                100% of stall dollars stay within regional family farms, eliminating multi-thousand mile container logistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 06: SEASONAL PICKS HORIZONTAL SHOWCASE
          -------------------------------------------------------------------- */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="section-kicker" style={{ color: 'var(--color-mint-bright)' }}>Harvest Almanac</span>
              <h2 className="section-title">This Week’s Seasonal Picks</h2>
              <p className="section-subtitle">
                Produce harvested at genuine biological maturity—bursting with aroma, enzymes, and nutrient density.
              </p>
            </div>
            <Link to="/seasonal" className="btn btn-outline-light" style={{ gap: 6 }}>
              <span>View Full Seasonal Calendar</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-4">
            {produceData.filter((p) => p.seasonStatus === 'peak').slice(0, 4).map((item) => (
              <div
                key={item.id}
                style={{
                background: 'rgba(20, 35, 30, 0.45)',
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(6px)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                border: '1px solid rgba(82, 183, 136, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.18)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent-amber)', textTransform: 'uppercase' }}>
                    Peak Harvest
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-mint-bright)' }}>
                    {item.priceRange}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '0.84375rem', color: 'var(--text-on-dark-muted)', lineHeight: 1.5, marginBottom: 16, flex: 1 }}>
                  {item.description}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-mint-light)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10 }}>
                  📍 {item.availableMarkets.length} markets stocking today
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 07: PRODUCE GUIDE & CATEGORY BROWSING
          -------------------------------------------------------------------- */}
      <section className="section produce-guide-section">
        <div className="container">
          <div className="section-header">
            <span className="section-kicker">Fresh Catalog</span>
            <h2 className="section-title">Regional Produce Guide</h2>
            <p className="section-subtitle">
              Filter by biological classification, inspect nutritional traits, and toggle interactive 3D visualizers.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="filter-tabs" style={{ marginBottom: 32 }}>
            {categoriesData.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-tab-btn ${activeProduceCategory === (cat.id === 'all' ? 'All' : cat.id) ? 'active' : ''}`}
                onClick={() => setActiveProduceCategory(cat.id === 'all' ? 'All' : cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid-4">
            {filteredProduce.map((item) => (
              <ProduceCard key={item.id} produce={item} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/produce" className="btn btn-lg btn-outline" style={{ gap: 8 }}>
              <span>Explore Complete 32+ Produce Catalog</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 08: INTERACTIVE WEEKLY MARKET SCHEDULE
          -------------------------------------------------------------------- */}
      <section className="section section-subtle schedule-section">
        <div className="container">
          <div className="section-header">
            <span className="section-kicker">Operating Timetable</span>
            <h2 className="section-title">Weekly Market Schedule</h2>
            <p className="section-subtitle">
              Plan your visits across every day of the week. Today is highlighted automatically from your local time.
            </p>
          </div>

          {/* Day selection tabs */}
          <div className="filter-tabs" style={{ marginBottom: 28 }}>
            {daysOfWeek.map((day) => {
              const isToday = day === todayDayName;
              const isSelected = day === scheduleDay;
              return (
                <button
                  key={day}
                  type="button"
                  className={`filter-tab-btn ${isSelected ? 'active' : ''}`}
                  style={{
                    position: 'relative',
                    borderColor: isToday ? 'var(--color-leaf-bright)' : 'transparent'
                  }}
                  onClick={() => setScheduleDay(day)}
                >
                  <span>{day}</span>
                  {isToday && (
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        color: isSelected ? '#FFFFFF' : 'var(--color-leaf)',
                        textTransform: 'uppercase'
                      }}
                    >
                      (Today)
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Schedule markets grid */}
          {scheduleMarkets.length === 0 ? (
            <div style={{ background: 'rgba(8, 27, 18, 0.88)', padding: '40px', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid rgba(82, 183, 136, 0.35)', backdropFilter: 'blur(16px)' }}>
              <p style={{ color: '#D8F3DC', fontSize: '1rem' }}>No markets scheduled on {scheduleDay}. Try Saturday or Sunday!</p>
            </div>
          ) : (
            <div className="grid-3">
              {scheduleMarkets.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: 'rgba(8, 27, 18, 0.88)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 24,
                    border: '1px solid rgba(82, 183, 136, 0.35)',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {m.area}
                    </span>
                    <MarketStatus market={m} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
                    {m.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: '#4ADE80', fontWeight: 700, marginBottom: 8 }}>
                    <Clock size={14} color="#4ADE80" />
                    <span>{m.hours[scheduleDay] || 'Hours vary'}</span>
                  </div>
                  <p style={{ fontSize: '0.84375rem', color: '#D8F3DC', marginBottom: 16, opacity: 0.9 }}>
                    {m.address}
                  </p>
                  <Link
                    to={`/market/${m.slug}`}
                    className="btn btn-sm btn-secondary"
                    style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
                  >
                    View Timetable
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 09: BOTANICAL AI CHATBOT HIGHLIGHT
          -------------------------------------------------------------------- */}
      <section className="section">
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-forest-dark), var(--color-forest))',
              borderRadius: 'var(--radius-xl)',
              padding: '48px 40px',
              color: '#FFFFFF',
              gap: 40,
              alignItems: 'center'
            }}
            className="split-grid"
          >
            <div>
              <span className="section-kicker" style={{ color: 'var(--color-mint-bright)' }}>
                Rule-Based Static Engine
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16, color: '#FFFFFF' }}>
                Ask FreshFind Botanical Guide
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-on-dark-muted)', lineHeight: 1.6, marginBottom: 24 }}>
                Ask about market hours, seasonal produce, nearby stalls, sustainability, saved finds, or how to plan a weekend harvest run — all answered locally from FreshFind’s static guide.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsChatOpen(true)}
                  style={{ gap: 8 }}
                >
                  <MessageSquare size={16} />
                  <span>Launch Botanical Guide</span>
                </button>
              </div>
            </div>

            {/* Quick interactive prompt pills */}
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-mint-bright)', textTransform: 'uppercase', marginBottom: 12 }}>
                Try Asking:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Where can I find heirloom tomatoes?',
                  'When is Green Valley Market open?',
                  'Which markets are open Saturday?',
                  'What produce is seasonal right now?'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('freshfind:chat-prompt', { detail: { prompt } }))}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 14px',
                      color: '#FFFFFF',
                      fontSize: '0.8125rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 10: BOOKMARK & HARVEST BASKET SYSTEM
          -------------------------------------------------------------------- */}
      <section className="section section-subtle basket-section">
        <div className="container">
          <div className="freshfind-planner-grid">
            <div className="freshfind-planner-copy">
              <div className="section-kicker">Client-Side Organizer</div>
              <h2 className="section-title">Plan your next fresh find.</h2>
              <p className="section-subtitle" style={{ marginBottom: 24 }}>
                Save favorite markets and seasonal produce, keep private notes, and turn your discoveries into a simple visit plan — all locally in your browser.
              </p>

              <div className="freshfind-planner-steps">
                <div className="freshfind-planner-step">
                  <span className="freshfind-planner-step-icon"><Heart size={16} /></span>
                  <div>
                    <strong>Save what catches your eye</strong>
                    <span>Favorite markets and produce for later.</span>
                  </div>
                </div>
                <div className="freshfind-planner-step">
                  <span className="freshfind-planner-step-icon"><Calendar size={16} /></span>
                  <div>
                    <strong>Build a simple visit plan</strong>
                    <span>Keep your market stops and seasonal picks together.</span>
                  </div>
                </div>
                <div className="freshfind-planner-step">
                  <span className="freshfind-planner-step-icon"><Download size={16} /></span>
                  <div>
                    <strong>Take it with you</strong>
                    <span>Export your saved basket locally when you are ready.</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsBookmarkDrawerOpen(true)}
                  style={{ gap: 8 }}
                >
                  <Heart size={16} />
                  <span>Open Saved Basket</span>
                </button>
                <Link to="/bookmarks" className="btn btn-outline">
                  <span>Full Basket Page</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="freshfind-planner-visual" aria-label="FreshFind planning preview">
              <div className="freshfind-planner-visual-glow" aria-hidden="true" />
              <img src={harvestBasket} alt="Fresh harvest basket" />
              <div className="freshfind-planner-overlay">
                <div className="freshfind-planner-overlay-top">
                  <span className="freshfind-planner-live">● LIVE PLAN</span>
                  <span>FreshFind Basket</span>
                </div>
                <div className="freshfind-planner-route">
                  <span className="freshfind-planner-route-node">01</span>
                  <div>
                    <strong>Green Valley Farmers Market</strong>
                    <span>Saturday · 07:30–15:00</span>
                  </div>
                </div>
                <div className="freshfind-planner-route">
                  <span className="freshfind-planner-route-node">02</span>
                  <div>
                    <strong>Heirloom Beefsteak Tomatoes</strong>
                    <span>Peak harvest · $4.50 / lb</span>
                  </div>
                </div>
                <div className="freshfind-planner-footer">
                  <span><Leaf size={14} /> Local-first discovery</span>
                  <span><ShieldCheck size={14} /> Browser-only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 11: VISITOR EXPERIENCE & COMMUNITY METRICS
          -------------------------------------------------------------------- */}
      <section
        className="section community-pulse-section"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(4, 16, 9, 0.38) 0%, rgba(4, 16, 9, 0.2) 42%, rgba(4, 16, 9, 0.66) 100%), url(${fruitsBasket})`
        }}
      >
        <div className="community-pulse-overlay" aria-hidden="true" />
        <div className="container community-pulse-content">
          <div className="section-header-center">
            <span className="section-kicker">Community Heartbeat</span>
            <h2 className="section-title">FreshFind Community Pulse</h2>
            <p className="section-subtitle">
              Simulated real-time platform telemetry tracking urban market discovery across the metropolitan area.
            </p>
          </div>

          <div className="grid-3">
            <div style={{ background: 'rgba(8, 27, 18, 0.82)', borderRadius: 'var(--radius-lg)', padding: 28, border: '1px solid rgba(82, 183, 136, 0.25)', textAlign: 'center', boxShadow: '0 18px 42px rgba(0, 0, 0, 0.28)', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-mint-bright)', marginBottom: 6 }} className="tabular-nums">
                <AnimatedCounter value={14842} suffix="+" />
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
                Active Market Visitors
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-on-dark-muted)' }}>
                Simulated real-time shopper sessions exploring local produce stalls
              </p>
            </div>

            <div style={{ background: 'rgba(8, 27, 18, 0.82)', borderRadius: 'var(--radius-lg)', padding: 28, border: '1px solid rgba(82, 183, 136, 0.25)', textAlign: 'center', boxShadow: '0 18px 42px rgba(0, 0, 0, 0.28)', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-mint-bright)', marginBottom: 6 }} className="tabular-nums">
                <AnimatedCounter value={14} />
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
                Community Market Hubs
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-on-dark-muted)' }}>
                Certified pesticide-free farmers markets verified across 7 regional sectors
              </p>
            </div>

            <div style={{ background: 'rgba(8, 27, 18, 0.82)', borderRadius: 'var(--radius-lg)', padding: 28, border: '1px solid rgba(82, 183, 136, 0.25)', textAlign: 'center', boxShadow: '0 18px 42px rgba(0, 0, 0, 0.28)', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-mint-bright)', marginBottom: 6 }} className="tabular-nums">
                <AnimatedCounter value={-89} suffix="%" />
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
                Average Food Miles Reduced
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-on-dark-muted)' }}>
                Compared with national industrial grocery distribution center freight
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 12: LOCATION & GEOLOCATION EXPERIENCE
          -------------------------------------------------------------------- */}
      <section className="section section-subtle location-section premium-info-section">
        <div className="container">
          <div className="split-grid premium-location-panel">
            <div className="premium-section-copy">
              <span className="premium-index">01 · DISCOVERY</span>
              <span className="section-kicker">Browser GPS Integration</span>
              <h2 className="premium-section-title">
                Markets Around You
              </h2>
              <p className="premium-section-lead">
                We use standard HTML5 browser geolocation to sort regional markets by straight-line distance. Your location coordinates remain strictly private inside your browser session and are never transmitted to any external server.
              </p>

              {userLocation.error && (
                <div style={{ background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: '#854D0E', marginBottom: 16 }}>
                  {userLocation.error}
                </div>
              )}

              {userLocation.coords && (
                <div style={{ background: 'var(--color-mint-tint)', border: '1px solid rgba(82, 183, 136, 0.3)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--color-forest-dark)', marginBottom: 16 }}>
                  ✓ Geolocation active ({userLocation.coords.lat.toFixed(4)}°, {userLocation.coords.lng.toFixed(4)}°). Closest markets prioritized!
                </div>
              )}

              <button
                type="button"
                onClick={requestLocation}
                className="btn btn-primary"
                style={{ gap: 8 }}
              >
                <Navigation size={16} />
                <span>{userLocation.coords ? 'Refresh My Location' : 'Activate Location Sensing'}</span>
              </button>
            </div>

            <div className="premium-location-utility">
              <div className="premium-orbit" aria-hidden="true"><span></span></div>
              <Compass size={48} style={{ color: 'var(--color-leaf)', marginBottom: 12 }} />
              <span className="premium-mini-label">LOCAL DISCOVERY</span>
              <h4>No GPS? No Problem!</h4>
              <p>
                You can browse every market by area (Downtown, Harbor, North Hills, Midtown, West End).
              </p>
              <Link to="/markets" className="btn btn-sm btn-outline">
                Browse Directory by Area
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 13: ABOUT US HIGHLIGHT
          -------------------------------------------------------------------- */}
      <section className="section philosophy-section premium-info-section">
        <div className="container">
          <div className="split-grid-even premium-philosophy-panel">
            <div className="premium-philosophy-copy">
              <span className="premium-index">02 · THE WHY</span>
              <span className="section-kicker">Our Philosophy</span>
              <h2 className="section-title">Why Local Markets Matter</h2>
              <p className="section-subtitle" style={{ marginBottom: 20 }}>
                Every apple, tomato, and carrot purchased at a farmers market represents living soil, bio-diverse pollination, and fair compensation for agrarian families.
              </p>
              <p className="philosophy-secondary-copy" style={{ fontSize: '0.9375rem', color: 'var(--text-on-dark-muted)', lineHeight: 1.6, marginBottom: 24 }}>
                FreshFind was engineered as an open, accessible public platform for Aptech / TechWiz. By rejecting opaque distributor markups and heavy server tracking, we bring transparency and beauty to regional agricultural discovery.
              </p>
              <Link to="/about" className="btn btn-outline" style={{ gap: 8 }}>
                <span>Read Full Platform Story</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="premium-philosophy-visual">
              <span className="premium-image-tag">REGENERATIVE · LOCAL · HUMAN</span>
              <img
                src={farmLandscape}
                alt="Sustainable solar-assisted farm landscape"
                className="responsive-feature-img"
                style={{ borderRadius: 'var(--radius-xl)', width: '100%', height: '360px', objectFit: 'cover', boxShadow: 'var(--shadow-card)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 14: CONTACT US PREVIEW
          -------------------------------------------------------------------- */}
      <section className="section section-subtle contact-preview-section premium-info-section premium-grower-section">
        <div className="container">
          <div className="split-grid premium-contact-panel premium-grower-panel">
            <div className="premium-contact-copy premium-grower-copy">
              <span className="premium-index">03 · NETWORK</span>
              <span className="section-kicker">Join the Local Grower Network</span>
              <h2 className="section-title">Are You a Local Grower?</h2>
              <p className="section-subtitle" style={{ marginBottom: 20 }}>
                Bring your farm, orchard, apiary, or small-batch stall to a local audience that is actively looking for seasonal food. FreshFind helps shoppers discover you by place, season, and market day.
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                <Link to="/contact" className="btn btn-primary">
                  List Your Market Stall
                </Link>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="btn btn-secondary"
                >
                  Ask Chatbot
                </button>
              </div>
            </div>

            <div className="premium-contact-card premium-grower-card">
              <div className="premium-grower-card-glow" aria-hidden="true" />
              <div className="premium-grower-card-content">
              <span className="premium-card-kicker">FRESHFIND HQ · COMMUNITY DESK</span>
              <h4>
                FreshFind Headquarters
              </h4>
              <p className="premium-contact-details">
                142 Grand Orchard Promenade<br />
                Green Valley Agrarian Guild<br />
                Email: hello@freshfind.green<br />
                Phone: (555) 234-8901
              </p>
              <div className="premium-grower-card-tags">
                <span>✓ Local onboarding</span>
                <span>✓ Seasonal listings</span>
                <span>✓ Market-day visibility</span>
              </div>
              <span className="premium-response">
                Quick community review · built for local growers
              </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          SECTION 15: FINAL IMMERSIVE CALL TO ACTION
          -------------------------------------------------------------------- */}
      <section className="section section-forest" style={{ textAlign: 'center' }}>
        <div className="container-narrow">
          <span className="section-kicker" style={{ color: 'var(--color-mint-bright)', justifyContent: 'center' }}>
            Begin Exploring Today
          </span>
          <h2 style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: 20, letterSpacing: '-0.03em' }}>
            The next great local harvest is closer than you think.
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-on-dark-muted)', lineHeight: 1.6, marginBottom: 36, maxWidth: 580, margin: '0 auto 36px' }}>
            Explore nearby markets, learn what is in season, and build a simple harvest plan around local growers.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/markets" className="btn btn-lg btn-secondary">
              <span>Explore All 14 Markets</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/produce" className="btn btn-lg btn-outline-light">
              <span>Browse Produce Guide</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
