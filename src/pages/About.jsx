import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, ArrowRight, TreeDeciduous, Award, MapPinned, Route, Sparkles } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import Reveal from '../components/reactbits/Reveal';
import farmLandscape from '../assets/images/sustainable_farm_landscape_1790278849275.jpg';

const principles = [
  {
    icon: TreeDeciduous,
    number: '01',
    title: 'Regenerative by design',
    text: 'A discovery experience built around seasonal produce, local farms, and the people growing food close to home.'
  },
  {
    icon: ShieldCheck,
    number: '02',
    title: 'Privacy first',
    text: 'FreshFind keeps the experience lightweight and client-side, so saved finds stay inside the user session.'
  },
  {
    icon: Award,
    number: '03',
    title: 'Showcase ready',
    text: 'Responsive React architecture, cinematic motion, refined custom CSS, and purposeful interaction throughout.'
  }
];

export default function About() {
  return (
    <div className="about-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        <section className="premium-page-hero">
          <Reveal className="premium-page-hero__copy" distance={34}>
            <span className="premium-eyebrow">Platform Story · FreshFind</span>
            <h1 className="premium-page-hero__title">
              Fresh <span>All Along.</span>
            </h1>
            <p className="premium-page-hero__lead">
              FreshFind is a next-generation agriculture and community discovery experience built for the Aptech / TechWiz Innovation Showcase under the eGreen Basket theme.
            </p>
            <div className="premium-cta" style={{ marginTop: 28 }}>
              <div>
                <h3>From farm rows to local markets.</h3>
                <p>Discover a cleaner, more visual way to understand what is growing around you.</p>
              </div>
              <div className="premium-cta__actions">
                <Link to="/markets" className="btn btn-primary"><MapPinned size={16} /> Explore Markets</Link>
                <Link to="/produce" className="btn btn-secondary"><Sprout size={16} /> Browse Produce</Link>
              </div>
            </div>
          </Reveal>

          <Reveal className="premium-page-visual" delay={120} scale={.985}>
            <img src={farmLandscape} alt="Sustainable regional farmland" />
            <div className="premium-floating-note">
              <strong>Local discovery, made visual.</strong>
              <span>Seasonality, markets and regenerative growing stories in one focused experience.</span>
            </div>
          </Reveal>
        </section>

        <section className="premium-section">
          <div className="premium-story-grid">
            <Reveal className="premium-story-card" delay={40}>
              <div className="premium-story-card__index">01 · The gap</div>
              <h2 style={{ fontSize: '1.85rem', lineHeight: 1.08, marginBottom: 14 }}>The food journey is often invisible.</h2>
              <p style={{ lineHeight: 1.75 }}>
                Local farmers markets can be close by while their opening times, seasonal crops, and grower stories remain scattered across the web. FreshFind turns that fragmented information into a single visual journey.
              </p>
            </Reveal>
            <Reveal className="premium-story-card" delay={100}>
              <div className="premium-story-card__index">02 · The answer</div>
              <h2 style={{ fontSize: '1.85rem', lineHeight: 1.08, marginBottom: 14 }}>A lightweight platform with personality.</h2>
              <p style={{ lineHeight: 1.75 }}>
                Rather than feeling like a static directory, FreshFind combines maps, market stories, seasonal produce, motion, and quick actions into a polished client-side experience that feels alive.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="premium-feature-shell">
          <Reveal className="premium-feature-head" distance={24}>
            <div>
              <span className="premium-eyebrow">Core Principles</span>
              <h2>Built to feel simple.<br />Engineered to feel special.</h2>
            </div>
            <div style={{ maxWidth: 310, color: 'rgba(216,243,220,.64)', fontSize: '.88rem', lineHeight: 1.65 }}>
              Every interaction should add clarity, confidence, or delight — never noise.
            </div>
          </Reveal>

          <div className="premium-feature-grid">
            {principles.map(({ icon: Icon, number, title, text }, index) => (
              <Reveal key={number} className="premium-feature-card" delay={90 * index}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div className="premium-feature-card__icon"><Icon size={22} /></div>
                  <span className="premium-number">{number}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 9 }}>{title}</h3>
                <p style={{ fontSize: '.86rem', lineHeight: 1.65 }}>{text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className="premium-cta" distance={22}>
          <div>
            <h3>Ready to explore your local harvest?</h3>
            <p>Jump into the market directory or continue the seasonal journey.</p>
          </div>
          <div className="premium-cta__actions">
            <Link to="/markets" className="btn btn-primary">Browse Markets <ArrowRight size={16} /></Link>
            <Link to="/contact" className="btn btn-outline-light">Contact the Team</Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
