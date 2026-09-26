import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Film,
  MapPin,
} from 'lucide-react';
import heroMarketImage from '../assets/images/hero_farmers_market_1790278803277.jpg';
import marketPavilionImage from '../assets/images/market_pavilion_scene_1790278821669.jpg';
import farmLandscapeImage from '../assets/images/sustainable_farm_landscape_1790278849275.jpg';
import marketsData from '../data/markets.json';

const marketVisuals = [
  { image: heroMarketImage, tone: 'golden' },
  { image: marketPavilionImage, tone: 'fresh' },
  { image: farmLandscapeImage, tone: 'earth' },
];

const simplifyMarketName = (name) =>
  name
    .replace(' Farmers Market', '')
    .replace(' Organic Pavilion', '')
    .replace(' Eco-Square', '');

export default function HeroVideoShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const featuredMarkets = useMemo(() => marketsData.slice(0, 3), []);

  useEffect(() => {
    if (isPaused || featuredMarkets.length < 2) return undefined;

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredMarkets.length);
    }, 5200);

    return () => window.clearInterval(id);
  }, [isPaused, featuredMarkets.length]);

  const rotate = (direction) => {
    setActiveIndex((current) => {
      const next = current + direction;
      if (next < 0) return featuredMarkets.length - 1;
      return next % featuredMarkets.length;
    });
  };

  const handlePointerMove = (event) => {
    if (window.matchMedia?.('(pointer: coarse)').matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -6;
    setTilt({ x: y, y: x });
  };

  const handlePointerLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      className="hero-video-card hero-showcase-premium hero-orbit-showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        handlePointerLeave();
      }}
    >
      <div className="hero-orbit-copy">
        <div className="hero-orbit-kicker">
          <Film size={14} />
          <span>Interactive Market Orbit</span>
        </div>
        <h3>
          Discover <span>fresh near you.</span>
        </h3>
        <p>
          Rotate through featured markets, open a destination, or jump directly into the
          cinematic harvest story.
        </p>
      </div>

      <div
        className="hero-orbit-stage-shell"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div
          className="hero-orbit-stage"
          style={{
            transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          <div className="hero-orbit-glow" aria-hidden="true" />

          {featuredMarkets.map((market, index) => {
            const offset = index - activeIndex;
            const wrappedOffset = offset === 2 ? -1 : offset === -2 ? 1 : offset;
            const isActive = wrappedOffset === 0;
            const visual = marketVisuals[index];

            const transform = isActive
              ? 'translate(-50%, -50%) translate3d(0, 0, 90px) rotateY(0deg) scale(1)'
              : wrappedOffset < 0
                ? 'translate(-50%, -50%) translate3d(-42%, 8px, -45px) rotateY(18deg) scale(.80)'
                : 'translate(-50%, -50%) translate3d(42%, 8px, -45px) rotateY(-18deg) scale(.80)';

            return (
              <div
                key={market.id}
                className={`hero-orbit-card ${isActive ? 'is-active' : 'is-side'} hero-orbit-card-${visual.tone}`}
                style={{
                  transform,
                  backgroundImage: `linear-gradient(180deg, rgba(2,14,8,.04) 10%, rgba(2,14,8,.84) 100%), url("${visual.image}")`,
                  opacity: Math.abs(wrappedOffset) > 1 ? 0 : isActive ? 1 : 0.68,
                  zIndex: isActive ? 4 : 2,
                }}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveIndex(index);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select ${market.name}`}
              >
                <div className="hero-orbit-card-top">
                  <span className="hero-orbit-live-pill">FEATURED</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </div>

                <div className="hero-orbit-card-content">
                  <span className="hero-orbit-area">{market.area} · {market.neighborhood}</span>
                  <h4>{simplifyMarketName(market.name)}</h4>
                  <p>{market.tagline}</p>

                  <div className="hero-orbit-meta">
                    <span><MapPin size={13} /> {market.stallsCount} stalls</span>
                    <span>★ {market.rating}</span>
                  </div>

                  {isActive && (
                    <Link
                      to={`/market/${market.slug}`}
                      className="hero-orbit-open"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Open Market <ArrowUpRight size={15} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="hero-orbit-arrow hero-orbit-arrow-left"
          onClick={() => rotate(-1)}
          aria-label="Previous featured market"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="hero-orbit-arrow hero-orbit-arrow-right"
          onClick={() => rotate(1)}
          aria-label="Next featured market"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="hero-orbit-dots" aria-label="Featured market selector">
        {featuredMarkets.map((market, index) => (
          <button
            key={market.id}
            type="button"
            aria-label={`Show ${market.name}`}
            aria-pressed={activeIndex === index}
            className={activeIndex === index ? 'active' : ''}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
