import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, CloudRain, Wind, Snowflake, ArrowRight, Quote, MapPin, Sparkles } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import seasonsData from '../data/seasons.json';
import produceData from '../data/produce.json';
import seasonalBasket from '../assets/images/seasonal_harvest_basket_1790278834057.jpg';
import vegetableBasket from '../assets/images/vegetable_basket_cinematic_1790321903634.jpg';
import fruitBasket from '../assets/images/fruits_basket_cinematic_1790321893623.jpg';
import farmLandscape from '../assets/images/sustainable_farm_landscape_1790278849275.jpg';

const seasonImages = {
  spring: vegetableBasket,
  summer: fruitBasket,
  autumn: seasonalBasket,
  winter: farmLandscape,
};

const categoryImages = {
  Vegetables: vegetableBasket,
  Fruits: fruitBasket,
  Herbs: seasonalBasket,
  'Dairy & Pantry': seasonalBasket,
  'Artisanal Goods': seasonalBasket,
};


export default function Seasonal() {
  const [activeSeasonId, setActiveSeasonId] = useState('autumn');
  const currentSeason = seasonsData.find((s) => s.id === activeSeasonId) || seasonsData[0];
  const heroImage = seasonImages[currentSeason.id] || seasonalBasket;

  const featured = useMemo(() => currentSeason.featuredProduce.map((pName, idx) => {
    const matchedProduce = produceData.find((p) => p.name.toLowerCase().includes(pName.toLowerCase()));
    return { pName, matchedProduce, idx };
  }), [currentSeason]);

  const getSeasonIcon = (id) => {
    switch (id) {
      case 'spring': return <CloudRain size={20} />;
      case 'summer': return <Sun size={20} />;
      case 'autumn': return <Wind size={20} />;
      case 'winter': return <Snowflake size={20} />;
      default: return <Sun size={20} />;
    }
  };

  return (
    <div className="seasonal-page seasonal-premium-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Seasonal Recommendations' }]} />

        <section className="seasonal-hero">
          <div className="seasonal-hero-copy">
            <span className="section-kicker">Biological Rhythm · FreshFind Almanac</span>
            <h1 className="seasonal-hero-title">Harvests have a <span>season.</span></h1>
            <p className="seasonal-hero-subtitle">
              Explore what is naturally at its best across the year — with market-ready produce, seasonal tips, and a visual field guide built for discovery.
            </p>
            <div className="seasonal-hero-meta">
              <div className="seasonal-meta-chip"><Sparkles size={15} /> Peak produce signals</div>
              <div className="seasonal-meta-chip"><MapPin size={15} /> Local market picks</div>
              <div className="seasonal-meta-chip"><Sun size={15} /> Seasonal rhythm</div>
            </div>
          </div>

          <div className="seasonal-hero-visual">
            <img src={heroImage} alt={`${currentSeason.name} harvest`} />
            <div className="seasonal-image-glow" />
            <div className="seasonal-hero-overlay-card">
              <span>{currentSeason.months}</span>
              <strong>{currentSeason.name}</strong>
              <small>{currentSeason.tagline}</small>
            </div>
          </div>
        </section>

        <section className="seasonal-season-picker" aria-label="Choose a season">
          {seasonsData.map((s) => {
            const isActive = s.id === activeSeasonId;
            return (
              <button
                key={s.id}
                type="button"
                className={`seasonal-season-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveSeasonId(s.id)}
                aria-pressed={isActive}
              >
                <span className="seasonal-tab-icon">{getSeasonIcon(s.id)}</span>
                <span className="seasonal-tab-copy"><strong>{s.name}</strong><small>{s.months}</small></span>
              </button>
            );
          })}
        </section>

        <section className="seasonal-feature" key={currentSeason.id}>
          <div className="seasonal-feature-copy">
            <div className="seasonal-feature-eyebrow" style={{ color: currentSeason.palette }}>
              {getSeasonIcon(currentSeason.id)} <span>{currentSeason.months}</span>
            </div>
            <h2>{currentSeason.name}</h2>
            <p className="seasonal-feature-tagline">“{currentSeason.tagline}”</p>
            <p className="seasonal-feature-description">{currentSeason.climateDescription}</p>

            <div className="seasonal-insight" style={{ '--season-accent': currentSeason.palette }}>
              <span>Agrarian culinary insight</span>
              <p>“{currentSeason.chefTip}”</p>
            </div>

            <div className="seasonal-markets">
              <div className="seasonal-markets-title"><MapPin size={15} /> Top markets this season</div>
              <div className="seasonal-market-list">
                {currentSeason.recommendedMarkets.map((mName) => (
                  <span key={mName}>{mName}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="seasonal-feature-visual">
            <img src={heroImage} alt={`${currentSeason.name} produce and farms`} />
            <div className="seasonal-quote-card">
              <Quote size={30} />
              <p>“{currentSeason.quote}”</p>
              <span>FreshFind Ecological Almanac</span>
            </div>
          </div>
        </section>

        <section className="seasonal-produce-section">
          <div className="seasonal-section-heading">
            <div>
              <span className="section-kicker">Peak harvest list</span>
              <h3>What to look for in {currentSeason.name}</h3>
            </div>
            <Link to="/produce" className="seasonal-inline-link">Browse full produce guide <ArrowRight size={16} /></Link>
          </div>

          <div className="seasonal-produce-grid">
            {featured.map(({ pName, matchedProduce, idx }) => {
              const category = matchedProduce?.category || 'Vegetables';
              const image = categoryImages[category] || seasonalBasket;
              return (
                <article className="seasonal-produce-card" key={pName} style={{ '--delay': `${idx * 70}ms` }}>
                  <div className="seasonal-produce-media">
                    <img src={image} alt={pName} />
                    <span>In season</span>
                  </div>
                  <div className="seasonal-produce-card-body">
                    <div className="seasonal-card-topline">
                      <span>{category}</span>
                      {matchedProduce && <strong>{matchedProduce.priceRange}</strong>}
                    </div>
                    <h4>{pName}</h4>
                    <p>{matchedProduce ? matchedProduce.description : 'Fresh local harvest sourced from regional farms.'}</p>
                    {matchedProduce && (
                      <div className="seasonal-card-footer">
                        <span>{matchedProduce.availableMarkets.length} regional markets</span>
                        <Link to="/produce" aria-label={`Explore ${pName}`}>Explore <ArrowRight size={14} /></Link>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
