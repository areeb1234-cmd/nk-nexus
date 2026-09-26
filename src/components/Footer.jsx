import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, Shield, Sparkles } from 'lucide-react';
import LiveClock from './LiveClock';
import VisitorCounter from './VisitorCounter';
import brandLogo from '../assets/images/market_brand_logo_1790321825419.jpg';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Brand info */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid rgba(82, 183, 136, 0.5)',
                  boxShadow: '0 0 14px rgba(82, 183, 136, 0.3)',
                  flexShrink: 0
                }}
              >
                <img
                  src={brandLogo}
                  alt="FreshFind Logo"
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>FreshFind</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-mint-bright)' }}>Organic Harvest & Scrollytelling</span>
              </div>
            </div>
            <p className="footer-tagline">
              "Fresh All Along." Connecting conscious urban communities with certified regenerative growers, heirloom harvests, and weekly farmers markets.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <LiveClock showSeconds={false} />
              <VisitorCounter />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Home Showcase</Link>
              </li>
              <li>
                <Link to="/markets" className="footer-link">Market Directory</Link>
              </li>
              <li>
                <Link to="/produce" className="footer-link">Seasonal Produce Guide</Link>
              </li>
              <li>
                <Link to="/seasonal" className="footer-link">Four Seasons Calendar</Link>
              </li>
              <li>
                <Link to="/bookmarks" className="footer-link">My Fresh Finds Basket</Link>
              </li>
            </ul>
          </div>

          {/* Community & Story */}
          <div>
            <h4 className="footer-col-title">Platform Story</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about" className="footer-link">About FreshFind</Link>
              </li>
              <li>
                <Link to="/about#mission" className="footer-link">Our Ecological Mission</Link>
              </li>
              <li>
                <Link to="/about#standards" className="footer-link">Regenerative Standards</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact & Stall Inquiries</Link>
              </li>
            </ul>
          </div>

          {/* Showcase & Tech info */}
          <div>
            <h4 className="footer-col-title">Project Showcase</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-on-dark-muted)', lineHeight: 1.6, marginBottom: 12 }}>
              <strong>Category:</strong> Web Innovation Unleashed<br />
              <strong>Theme:</strong> eGreen Basket<br />
              <strong>Platform:</strong> Pure React.js & Three.js
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-mint-bright)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={13} />
              <span>Static JSON Architecture · Zero Backend</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} FreshFind. All rights reserved. Built for Aptech / TechWiz Innovation Showcase.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link to="/about" className="footer-link">Accessibility</Link>
            <Link to="/about" className="footer-link">Privacy Standards</Link>
            <Link to="/about" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
