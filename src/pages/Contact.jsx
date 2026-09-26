import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Clock3, ArrowUpRight, HelpCircle } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import Reveal from '../components/reactbits/Reveal';
import { useApp } from '../context/AppContext';

const faqs = [
  ['Market schedules', 'Need opening times, directions, or a quick market lookup? Start from the Markets directory.'],
  ['Grower / vendor listing', 'Use the inquiry form and choose the vendor verification option so the right team can review it.'],
  ['TechWiz showcase', 'Questions about the concept, privacy model, or project flow can be sent as showcase feedback.']
];

export default function Contact() {
  const { addToast, setIsChatOpen } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Question', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Your inquiry was received! (Demo Mode - No backend storage)', 'success');
  };

  return (
    <div className="contact-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <section className="premium-page-hero" style={{ gridTemplateColumns: '1fr' }}>
          <Reveal className="premium-page-hero__copy">
            <span className="premium-eyebrow">Get in Touch · FreshFind</span>
            <h1 className="premium-page-hero__title">Let’s keep the <span>local harvest moving.</span></h1>
            <p className="premium-page-hero__lead">
              Questions about markets, produce, vendor listings, or the TechWiz showcase? Send a note and we’ll route it to the right part of the experience.
            </p>
            <div className="contact-hero-meta">
              <div className="contact-meta-pill"><strong>Fast response</strong><span>Demo-friendly inquiry flow</span></div>
              <div className="contact-meta-pill"><strong>Client-side demo</strong><span>No backend message storage</span></div>
              <div className="contact-meta-pill"><strong>Local focus</strong><span>Markets, growers & seasons</span></div>
            </div>
          </Reveal>
        </section>

        <section className="premium-contact-grid">
          <Reveal className="premium-contact-form" distance={28}>
            {submitted ? (
              <div className="premium-success">
                <CheckCircle2 size={46} style={{ color: '#6fe0a0', margin: '0 auto 14px' }} />
                <h2 style={{ fontSize: '1.6rem', marginBottom: 8, color: '#f6fff8' }}>Message received.</h2>
                <p style={{ color: 'rgba(216,243,220,.72)', fontSize: '.9rem', lineHeight: 1.65, marginBottom: 22 }}>
                  Thanks, {formData.name || 'Friend'}. This showcase form is client-side only, but the interaction is ready for a real backend when needed.
                </p>
                <button type="button" className="btn btn-primary" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'General Question', message: '' }); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', gap:16, alignItems:'flex-start', marginBottom:22 }}>
                  <div>
                    <span className="premium-eyebrow">Direct line</span>
                    <h2 style={{ fontSize:'2rem', lineHeight:1.05, margin:'14px 0 8px' }}>Send an inquiry.</h2>
                    <p style={{ fontSize:'.86rem', lineHeight:1.6 }}>A focused form with just enough context to reach the right part of FreshFind.</p>
                  </div>
                  <div style={{ color:'#75e5a3' }}><Send size={22} /></div>
                </div>

                <form onSubmit={handleSubmit} style={{ display:'grid', gap:16 }}>
                  <div className="contact-field">
                    <label>Your Name</label>
                    <input type="text" required placeholder="e.g. Julian Vance" value={formData.name} onChange={e => setFormData({ ...formData, name:e.target.value })} />
                  </div>
                  <div className="contact-field">
                    <label>Email Address</label>
                    <input type="email" required placeholder="julian@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email:e.target.value })} />
                  </div>
                  <div className="contact-field">
                    <label>Subject</label>
                    <select value={formData.subject} onChange={e => setFormData({ ...formData, subject:e.target.value })}>
                      <option value="General Question">General Question</option>
                      <option value="New Market Listing">Propose a New Farmers Market</option>
                      <option value="Vendor Verification">Vendor Ecological Verification</option>
                      <option value="TechWiz Feedback">TechWiz Showcase Feedback</option>
                    </select>
                  </div>
                  <div className="contact-field">
                    <label>Message</label>
                    <textarea rows={6} required placeholder="Tell us what you want to explore..." value={formData.message} onChange={e => setFormData({ ...formData, message:e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ height:48 }}><Send size={16} /> Send Inquiry</button>
                </form>
              </>
            )}
          </Reveal>

          <div className="premium-contact-stack">
            <Reveal className="premium-contact-card" delay={80}>
              <div className="premium-contact-card__icon"><MapPin size={22} /></div>
              <h3 style={{ fontSize:'1.15rem', marginBottom:6 }}>Office of Regional Markets</h3>
              <p style={{ fontSize:'.82rem', lineHeight:1.55, marginBottom:12 }}>A fictional demo hub used to make the showcase experience feel complete.</p>
              <div className="premium-contact-card__row"><MapPin size={17} style={{ color:'#76e3a2' }} /><div><strong>142 Grand Orchard Promenade</strong><span>Suite 400, Green Valley Agrarian Hub</span></div></div>
              <div className="premium-contact-card__row"><Mail size={17} style={{ color:'#76e3a2' }} /><div><strong>hello@freshfind.green</strong><span>General enquiries & showcase questions</span></div></div>
              <div className="premium-contact-card__row"><Phone size={17} style={{ color:'#76e3a2' }} /><div><strong>(555) 234-8901</strong><span>Mon–Fri · 8am–5pm</span></div></div>
              <div className="premium-contact-card__row"><Clock3 size={17} style={{ color:'#76e3a2' }} /><div><strong>Demo hours</strong><span>Always open for the showcase</span></div></div>
            </Reveal>

            <Reveal className="premium-faq-card" delay={140}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <div className="premium-contact-card__icon" style={{ marginBottom:0, width:40, height:40 }}><HelpCircle size={19} /></div>
                <div>
                  <span className="premium-eyebrow" style={{ padding:'6px 9px', fontSize:'.62rem' }}>Quick answers</span>
                  <h3 style={{ marginTop:8, fontSize:'1.1rem' }}>What can we help with?</h3>
                </div>
              </div>
              <div className="premium-faq-list">
                {faqs.map(([title, text]) => (
                  <div className="premium-faq-item" key={title}><strong>{title}</strong><span>{text}</span></div>
                ))}
              </div>
              <button type="button" className="btn btn-secondary" style={{ width:'100%', marginTop:16 }} onClick={() => setIsChatOpen(true)}>
                <MessageSquare size={16} /> Chat with Botanical Guide <ArrowUpRight size={15} />
              </button>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}
