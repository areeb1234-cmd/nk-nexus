import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import Chatbot from './components/Chatbot';
import BookmarkPanel from './components/BookmarkPanel';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import OrganicParticleField from './components/OrganicParticleField';

// Pages
import Home from './pages/Home';
import Markets from './pages/Markets';
import MarketDetails from './pages/MarketDetails';
import Produce from './pages/Produce';
import Seasonal from './pages/Seasonal';
import About from './pages/About';
import Contact from './pages/Contact';
import Bookmarks from './pages/Bookmarks';
import NotFound from './pages/NotFound';

// Helper component to scroll to top on every navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function RouteAtmosphere() {
  const { pathname } = useLocation();
  const excluded = pathname === '/' || pathname === '/about' || pathname === '/contact';
  return excluded ? null : <OrganicParticleField />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollProgress />
        <ScrollToTop />
        <RouteAtmosphere />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main id="main-content" style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/market/:slug" element={<MarketDetails />} />
              <Route path="/produce" element={<Produce />} />
              <Route path="/seasonal" element={<Seasonal />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>

        {/* Global Floating Accessories */}
        <Chatbot />
        <BookmarkPanel />
        <AuthModal />
        <Toast />
      </BrowserRouter>
    </AppProvider>
  );
}
