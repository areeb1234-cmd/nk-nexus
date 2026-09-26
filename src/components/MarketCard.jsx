import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import MarketStatus from './MarketStatus';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm } from '../utils/marketStatus';
import Reveal from './reactbits/Reveal';
import SpotlightCard from './reactbits/SpotlightCard';

// Visual fallback images from generated assets
import heroFarmersMarket from '../assets/images/hero_farmers_market_1790278803277.jpg';
import marketPavilion from '../assets/images/market_pavilion_scene_1790278821669.jpg';
import seasonalHarvest from '../assets/images/seasonal_harvest_basket_1790278834057.jpg';
import farmLandscape from '../assets/images/sustainable_farm_landscape_1790278849275.jpg';

const imagePool = [heroFarmersMarket, marketPavilion, seasonalHarvest, farmLandscape];

export default function MarketCard({ market, index = 0 }) {
  const { favoriteMarkets, toggleFavoriteMarket, userLocation } = useApp();
  const isFavorite = favoriteMarkets.includes(market.id);

  // Compute proximity if user GPS coordinates are active
  const distance =
    userLocation.coords && market.coordinates
      ? calculateDistanceKm(
          userLocation.coords.lat,
          userLocation.coords.lng,
          market.coordinates.lat,
          market.coordinates.lng
        )
      : null;

  const cardImage = imagePool[index % imagePool.length];

  return (
    <Reveal delay={(index % 3) * 90} className="market-card-reveal">
      <SpotlightCard className="market-card">
      <div className="market-card-media">
        <img
          src={cardImage}
          alt={market.name}
          className="market-card-img"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <button
          type="button"
          className={`market-card-fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavoriteMarket(market.id);
          }}
          aria-label={isFavorite ? `Remove ${market.name} from saved` : `Save ${market.name}`}
        >
          <Heart size={18} fill={isFavorite ? '#DC2626' : 'none'} />
        </button>
      </div>

      <div className="market-card-body">
        {/* Clean unboxed metadata with typographic separator */}
        <div className="card-metadata">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} />
            {market.area}
          </span>
          <span aria-hidden="true">·</span>
          <span>{market.neighborhood}</span>
          {distance !== null && (
            <>
              <span aria-hidden="true">·</span>
              <span style={{ color: 'var(--color-leaf)', fontWeight: 600 }}>{distance} km away</span>
            </>
          )}
        </div>

        <h3 className="market-card-title">
          <Link to={`/market/${market.slug}`} style={{ color: 'inherit' }}>
            {market.name}
          </Link>
        </h3>

        <div style={{ marginBottom: 12 }}>
          <MarketStatus market={market} />
        </div>

        <p className="market-card-desc">{market.description}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={13} style={{ color: 'var(--color-leaf)' }} />
            <span>{market.days.join(', ')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={13} style={{ color: 'var(--color-leaf)' }} />
            <span>{market.days[0] ? `${market.days[0]}: ${market.hours[market.days[0]] || 'Varies'}` : 'See timetable'}</span>
          </div>
        </div>

        <div className="market-card-tags">
          {market.produce.slice(0, 3).map((item, idx) => (
            <span key={idx} className="market-card-tag">
              {item}
            </span>
          ))}
          {market.produce.length > 3 && (
            <span className="market-card-tag" style={{ background: 'rgba(13, 40, 24, 0.04)', color: 'var(--text-muted)' }}>
              +{market.produce.length - 3} more
            </span>
          )}
        </div>

        <div className="market-card-footer">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ★ {market.rating} ({market.reviewCount} reviews)
          </span>
          <Link to={`/market/${market.slug}`} className="btn btn-sm btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>View Market</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
      </SpotlightCard>
    </Reveal>
  );
}
