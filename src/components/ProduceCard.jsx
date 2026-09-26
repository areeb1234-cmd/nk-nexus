import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  MapPin,
  X,
  BookOpen,
  Leaf,
  Snowflake,
  PackageCheck,
  Sprout,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Reveal from './reactbits/Reveal';
import SpotlightCard from './reactbits/SpotlightCard';

import vegetableBasket from '../assets/images/vegetable_basket_cinematic_1790321903634.jpg';
import fruitBasket from '../assets/images/fruits_basket_cinematic_1790321893623.jpg';
import harvestBasket from '../assets/images/seasonal_harvest_basket_1790278834057.jpg';

const PRODUCE_IMAGE_BY_CATEGORY = {
  Vegetables: vegetableBasket,
  Fruits: fruitBasket,
  Herbs: vegetableBasket,
  'Dairy & Pantry': harvestBasket,
  'Artisanal Goods': harvestBasket
};

const PRODUCE_DISPLAY_NAMES = {
  'Heirloom Beefsteak Tomatoes': 'Beefsteak Tomatoes',
  'Rainbow Bunch Carrots': 'Rainbow Carrots',
  'Crisp Gala Apples': 'Gala Apples',
  'Wild Forest Mushrooms': 'Forest Mushrooms',
  'Tuscan Lacinato Kale': 'Tuscan Kale',
  'Sweet Japanese Sweet Potatoes': 'Japanese Sweet Potatoes',
  'Fresh Genovese Basil': 'Genovese Basil',
  'Black Mission Figs': 'Black Mission Figs',
  'Wild Mountain Lavender Honey': 'Lavender Honey',
  'Cultured Farmstead Butter': 'Farmstead Butter',
  'Organic Rosemary Sprigs': 'Rosemary',
  'Crisp Romanesco Broccoli': 'Romanesco Broccoli',
  'Fresh Thyme Sprigs': 'Fresh Thyme',
  'Organic Hass Avocados': 'Hass Avocados',
  'Golden Honeycomb': 'Honeycomb',
  'Fresh Mint Leaves': 'Fresh Mint',
  'Farmhouse Sourdough Bread': 'Sourdough Bread'
};

function getProduceImage(category) {
  return PRODUCE_IMAGE_BY_CATEGORY[category] || harvestBasket;
}

function getFallbackImage(category) {
  const fallbackMap = {
    Vegetables: '/product-images/heirloom-beefsteak-tomatoes.jpg',
    Fruits: '/product-images/crisp-gala-apples.jpg',
    Herbs: '/product-images/tuscan-lacinato-kale.jpg',
    'Dairy & Pantry': '/product-images/seasonal-produce.jpg',
    'Artisanal Goods': '/product-images/seasonal-produce.jpg'
  };
  return fallbackMap[category] || '/product-images/seasonal-produce.jpg';
}

function getDisplayName(name) {
  return PRODUCE_DISPLAY_NAMES[name] || name;
}

function getProductionGuide(produce) {
  const templates = {
    Vegetables: [
      ['01', 'Cultivate', 'Rich soil, consistent moisture, and a seasonal growing window shape the harvest.'],
      ['02', 'Harvest', 'Picked close to peak maturity so color, texture, and flavor are at their strongest.'],
      ['03', 'Bring to market', 'Short local routes keep the crop fresh and ready for same-day discovery.']
    ],
    Fruits: [
      ['01', 'Grow', 'Orchard or berry-row care focuses on healthy plants, pollination, and steady ripening.'],
      ['02', 'Pick', 'Harvest timing follows color, aroma, firmness, and the season’s natural peak.'],
      ['03', 'Bring to market', 'Gentle handling and short regional routes protect the delicate fruit.']
    ],
    Herbs: [
      ['01', 'Cultivate', 'Leafy herbs are grown for tender, aromatic growth with frequent attention to moisture and sunlight.'],
      ['02', 'Clip', 'Young leaves and stems are cut close to market time for maximum aroma.'],
      ['03', 'Bring to market', 'Fresh bunching and quick regional delivery keep the herbs lively.']
    ],
    'Dairy & Pantry': [
      ['01', 'Craft', 'Small-batch preparation keeps ingredients traceable and the production story transparent.'],
      ['02', 'Finish', 'Each batch is finished, chilled, sealed, or prepared for safe local handling.'],
      ['03', 'Bring to market', 'Regional market placement keeps the product close to its maker and its community.']
    ],
    'Artisanal Goods': [
      ['01', 'Craft', 'Small-batch makers focus on careful ingredients, texture, and repeatable quality.'],
      ['02', 'Finish', 'Products are packaged at the right stage for freshness, flavor, and presentation.'],
      ['03', 'Bring to market', 'Local stalls create a direct path from maker to community shopper.']
    ]
  };
  return templates[produce.category] || templates.Vegetables;
}

function GuideModal({ produce, displayName, imageSrc, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const seasonTag =
    produce.seasonStatus === 'peak'
      ? 'Peak Harvest'
      : produce.seasonStatus === 'in_season'
      ? 'In Season'
      : 'Coming Soon';

  const seasonColor =
    produce.seasonStatus === 'peak'
      ? '#F4A261'
      : produce.seasonStatus === 'in_season'
      ? '#74C69D'
      : '#E9C46A';

  return createPortal(
    <div className="produce-guide-modal" role="dialog" aria-modal="true" aria-labelledby="produce-guide-title">
      <button
        type="button"
        className="produce-guide-backdrop"
        aria-label="Close produce guide"
        onClick={onClose}
      />

      <div className="produce-guide-modal-card">
        <button
          type="button"
          className="produce-guide-close"
          onClick={onClose}
          aria-label="Close produce guide"
        >
          <X size={18} />
        </button>

        <div className="produce-guide-hero">
          <img src={imageSrc} alt={`${displayName} harvest`} />
          <div className="produce-guide-hero-overlay" />
          <div className="produce-guide-hero-copy">
            <span className="produce-guide-kicker">FreshFind Produce Guide</span>
            <h2 id="produce-guide-title">{displayName}</h2>
            <div className="produce-guide-meta">
              <span>{produce.category}</span>
              <span style={{ color: seasonColor }}>{seasonTag}</span>
              <span>{produce.season}</span>
            </div>
          </div>
        </div>

        <div className="produce-guide-body">
          <div className="produce-guide-intro">
            <div>
              <span className="produce-guide-label">From the local harvest</span>
              <p>{produce.description}</p>
            </div>
            <div className="produce-guide-price-card">
              <span>Market price</span>
              <strong>{produce.priceRange}</strong>
              <small>Typical regional range</small>
            </div>
          </div>

          <div className="produce-guide-grid">
            <article className="produce-guide-detail-card">
              <div className="produce-guide-icon"><PackageCheck size={17} /></div>
              <div>
                <span>Storage guide</span>
                <p>{produce.storageTip}</p>
              </div>
            </article>

            <article className="produce-guide-detail-card">
              <div className="produce-guide-icon"><Leaf size={17} /></div>
              <div>
                <span>Nutrition</span>
                <p>{produce.nutrition || 'Seasonal produce selected for freshness and flavor.'}</p>
              </div>
            </article>

            <article className="produce-guide-detail-card">
              <div className="produce-guide-icon"><Sprout size={17} /></div>
              <div>
                <span>Local impact</span>
                <p>{produce.carbonImpact}</p>
              </div>
            </article>

            <article className="produce-guide-detail-card">
              <div className="produce-guide-icon"><MapPin size={17} /></div>
              <div>
                <span>Where to find it</span>
                <p>{produce.availableMarkets.length} regional markets currently list this produce.</p>
              </div>
            </article>
          </div>

          <section className="produce-guide-production" aria-label="Production guide">
            <div className="produce-guide-production-head">
              <div>
                <span className="produce-guide-label">How it gets here</span>
                <h3>Production guide</h3>
              </div>
              <span className="produce-guide-production-season">{produce.season} harvest window</span>
            </div>
            <div className="produce-guide-production-steps">
              {getProductionGuide(produce).map(([step, title, copy]) => (
                <article key={step} className="produce-guide-production-step">
                  <span className="produce-guide-step-number">{step}</span>
                  <div>
                    <h4>{title}</h4>
                    <p>{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="produce-guide-markets">
            <div className="produce-guide-markets-heading">
              <div>
                <span className="produce-guide-label">Market trail</span>
                <h3>Regional markets</h3>
              </div>
              <BookOpen size={18} />
            </div>
            <div className="produce-guide-market-list">
              {produce.availableMarkets.map((market) => (
                <span key={market} className="produce-guide-market-pill">
                  <MapPin size={12} />
                  {market}
                </span>
              ))}
            </div>
          </div>

          <div className="produce-guide-footer">
            <span><Snowflake size={14} /> Freshness-first handling</span>
            <span><ArrowUpRight size={14} /> Local market discovery</span>
            <Link to="/produce" onClick={onClose} className="produce-guide-full-link">
              <BookOpen size={14} /> Open full Produce Guide
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ProduceCard({ produce, revealDelay = 0 }) {
  const { favoriteProduce, toggleFavoriteProduce } = useApp();
  const [guideOpen, setGuideOpen] = useState(false);
  const isFavorite = favoriteProduce.includes(produce.id);

  const seasonTag =
    produce.seasonStatus === 'peak'
      ? 'Peak Harvest'
      : produce.seasonStatus === 'in_season'
      ? 'In Season'
      : 'Coming Soon';

  const seasonColor =
    produce.seasonStatus === 'peak'
      ? 'var(--color-accent-orange)'
      : produce.seasonStatus === 'in_season'
      ? 'var(--color-leaf)'
      : 'var(--color-accent-amber)';

  const displayName = getDisplayName(produce.name);
  const imageSrc = produce.image || getProduceImage(produce.category);

  const openGuide = () => setGuideOpen(true);

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openGuide();
    }
  };

  return (
    <>
      <Reveal className="produce-card-reveal" delay={revealDelay}>
        <SpotlightCard className="produce-card">
          <div
            className="produce-card-interactive"
            role="button"
            tabIndex={0}
            onClick={openGuide}
            onKeyDown={handleCardKeyDown}
            aria-label={`Open ${displayName} produce guide`}
          >
            <div className="produce-card-header">
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {produce.category}
              </span>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleFavoriteProduce(produce.id);
                }}
                className={`produce-favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
                aria-label={isFavorite ? `Remove ${displayName} from saved` : `Save ${displayName}`}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="produce-image-wrap">
              <img
                src={imageSrc}
                alt={`${displayName} fresh harvest`}
                className="produce-card-image"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = getFallbackImage(produce.category);
                }}
              />
              <div className="produce-image-overlay" aria-hidden="true" />
              <span className="produce-fresh-chip">
                <Sparkles size={12} />
                Fresh pick
              </span>
            </div>

            <div className="produce-name-row">
              <h4 className="produce-name">{displayName}</h4>
              <ArrowUpRight className="produce-open-icon" size={16} aria-hidden="true" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 0 10px', gap: 12 }}>
              <span className="produce-price">{produce.priceRange}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: seasonColor, textAlign: 'right' }}>
                {seasonTag} · {produce.season}
              </span>
            </div>

            <p className="produce-desc">{produce.description}</p>

            <div className="produce-info-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={11} style={{ color: 'var(--color-leaf)' }} />
                <span>Available at {produce.availableMarkets.length} regional markets</span>
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-leaf-deep)' }}>
                {produce.carbonImpact}
              </div>
            </div>

            <div className="produce-card-guide-hint">
              <span>Open full harvest guide</span>
              <ArrowUpRight size={13} />
            </div>
          </div>
        </SpotlightCard>
      </Reveal>

      {guideOpen && (
        <GuideModal
          produce={produce}
          displayName={displayName}
          imageSrc={imageSrc}
          onClose={() => setGuideOpen(false)}
        />
      )}
    </>
  );
}
