import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, User, Menu, X, MessageSquare, Home as HomeIcon, Store, Sprout, CalendarDays, Info, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import horizontalLogo from '../assets/images/freshfind-horizontal-logo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const {
    favoriteMarkets,
    favoriteProduce,
    setIsBookmarkDrawerOpen,
    setAuthModalOpen,
    setIsChatOpen,
    user
  } = useApp();

  const totalFavorites = favoriteMarkets.length + favoriteProduce.length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Markets', path: '/markets', icon: Store },
    { label: 'Produce', path: '/produce', icon: Sprout },
    { label: 'Seasonal', path: '/seasonal', icon: CalendarDays },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Mail }
  ];

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Zone 1: Horizontal FreshFind wordmark */}
        <Link to="/" className="nav-brand" aria-label="FreshFind home">
          <img
            src={horizontalLogo}
            alt="FreshFind — Organic Harvest Market"
            className="nav-brand-logo"
            draggable="false"
          />
        </Link>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="nav-links" aria-label="Primary Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                aria-label={item.label}
              >
                <span className="nav-link-icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={2.1} />
                </span>
                <span className="nav-link-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="nav-actions">
          {/* Basket / Bookmark drawer trigger */}
          <button
            type="button"
            className="nav-action-btn nav-favorites-btn nav-tooltip-btn" data-tooltip="Saved harvest basket"
            onClick={() => setIsBookmarkDrawerOpen(true)}
            aria-label="View saved harvest basket"
            title="My Saved Fresh Finds"
          >
            <Heart size={18} />
            {totalFavorites > 0 && <span className="nav-badge-count" aria-label={`${totalFavorites} saved items`}>{totalFavorites}</span>}
          </button>

          {/* Chatbot trigger button */}
          <button
            type="button"
            className="nav-action-btn nav-tooltip-btn"
            data-tooltip="FreshFind assistant"
            onClick={() => setIsChatOpen(true)}
            aria-label="Open botanical chatbot assistant"
            title="Ask FreshFind Botanical Guide"
          >
            <MessageSquare size={18} />
          </button>

          {/* Dummy Auth UI trigger */}
          <button
            type="button"
            className="btn btn-sm btn-primary nav-auth-btn nav-tooltip-btn"
            data-tooltip="Account & sign in"
            onClick={() => setAuthModalOpen(true)}
            style={{ gap: 6 }}
          >
            <User size={14} />
            <span className="nav-signin-label">{user ? user.name.split(' ')[0] : 'Sign In'}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14, borderBottom: '1px solid rgba(0, 0, 0, 0.08)', marginBottom: 8 }}>
            <img
              src={horizontalLogo}
              alt="FreshFind — Organic Harvest Market"
              className="nav-mobile-brand-logo"
              draggable="false"
            />
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsBookmarkDrawerOpen(true);
              }}
            >
              <Heart size={16} />
              <span>Saved Basket ({totalFavorites})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
