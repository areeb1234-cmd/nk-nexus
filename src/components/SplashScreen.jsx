import React, { useEffect, useState } from 'react';

const SPLASH_DURATION = 1350;

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setExiting(true), SPLASH_DURATION - 380);
    const hideTimer = window.setTimeout(() => setVisible(false), SPLASH_DURATION);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`ff-splash-screen${exiting ? ' is-exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading FreshFind"
    >
      <div className="ff-splash-orb ff-splash-orb-left" aria-hidden="true" />
      <div className="ff-splash-orb ff-splash-orb-right" aria-hidden="true" />

      <div className="ff-splash-content">
        <div className="ff-splash-logo-wrap" aria-hidden="true">
          <img src="/brand_logo.jpg" alt="" className="ff-splash-logo" />
        </div>

        <div className="ff-splash-brand">FreshFind</div>
        <div className="ff-splash-tagline">Discover. Explore. Find Fresh.</div>

        <div className="ff-splash-loader" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
