import React, { createContext, useContext, useState, useEffect } from 'react';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Bookmarks (saved in localStorage for persistence across reloads)
  const [favoriteMarkets, setFavoriteMarkets] = useState(() => {
    try {
      const saved = localStorage.getItem('freshfind_fav_markets_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favoriteProduce, setFavoriteProduce] = useState(() => {
    try {
      const saved = localStorage.getItem('freshfind_fav_produce_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Session-only notes (SRS strictly asks for session-only notes)
  const [sessionNotes, setSessionNotes] = useState(() => {
    try {
      const saved = sessionStorage.getItem('freshfind_session_notes');
      return saved ? JSON.parse(saved) : {
        'mkt-1': 'Ask Farmer Elena about the heirloom beefsteak tomato harvest timing.',
        'prod-16': 'Check for raw mountain honeycomb jar.'
      };
    } catch {
      return {};
    }
  });

  // Browser Geolocation state
  const [userLocation, setUserLocation] = useState({
    coords: null, // { lat, lng }
    loading: false,
    error: null,
    permissionGranted: false
  });

  // Dummy Auth State (SRS requirement: purely frontend visual demonstration)
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [user, setUser] = useState(null);

  // Global Chatbot open/close state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Bookmark Drawer open/close state
  const [isBookmarkDrawerOpen, setIsBookmarkDrawerOpen] = useState(false);

  // Toast Notification state
  const [toasts, setToasts] = useState([]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('freshfind_fav_markets_v2', JSON.stringify(favoriteMarkets));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteMarkets]);

  useEffect(() => {
    try {
      localStorage.setItem('freshfind_fav_produce_v2', JSON.stringify(favoriteProduce));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteProduce]);

  // Save session notes to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('freshfind_session_notes', JSON.stringify(sessionNotes));
    } catch (e) {
      console.error(e);
    }
  }, [sessionNotes]);

  // Toast handler
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Toggle favorite market
  const toggleFavoriteMarket = (marketId) => {
    setFavoriteMarkets((prev) => {
      const exists = prev.includes(marketId);
      const updated = exists ? prev.filter((id) => id !== marketId) : [...prev, marketId];
      const market = marketsData.find((m) => m.id === marketId);
      const name = market ? market.name : 'Market';
      addToast(exists ? `Removed ${name} from saved finds` : `Saved ${name} to your basket!`, exists ? 'default' : 'success');
      return updated;
    });
  };

  // Toggle favorite produce
  const toggleFavoriteProduce = (produceId) => {
    setFavoriteProduce((prev) => {
      const exists = prev.includes(produceId);
      const updated = exists ? prev.filter((id) => id !== produceId) : [...prev, produceId];
      const produce = produceData.find((p) => p.id === produceId);
      const name = produce ? produce.name : 'Produce item';
      addToast(exists ? `Removed ${name} from favorites` : `Added ${name} to your harvest list!`, exists ? 'default' : 'success');
      return updated;
    });
  };

  // Update session note
  const updateSessionNote = (itemId, noteText) => {
    setSessionNotes((prev) => ({
      ...prev,
      [itemId]: noteText
    }));
  };

  // Geolocation request handler
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation({
        coords: null,
        loading: false,
        error: 'Geolocation is not supported by your browser. You can still search by area!',
        permissionGranted: false
      });
      addToast('Geolocation unsupported. Browsing by area instead.', 'warning');
      return;
    }

    setUserLocation((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          loading: false,
          error: null,
          permissionGranted: true
        });
        addToast('Location detected! Markets sorted by distance.', 'success');
      },
      (error) => {
        let msg = 'Location access was denied or unavailable. You can browse markets by area.';
        if (error.code === error.TIMEOUT) msg = 'Location request timed out.';
        setUserLocation({
          coords: null,
          loading: false,
          error: msg,
          permissionGranted: false
        });
        addToast('Location access unavailable. Browsing by area.', 'info');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  // Export Bookmarks as a formatted text download file
  const exportBookmarks = () => {
    const savedMarketsList = marketsData.filter((m) => favoriteMarkets.includes(m.id));
    const savedProduceList = produceData.filter((p) => favoriteProduce.includes(p.id));

    let content = `====================================================\n`;
    content += `        FRESHFIND – MY SAVED HARVEST BASKET         \n`;
    content += `             "Fresh All Along"                      \n`;
    content += `Generated on: ${new Date().toLocaleString()}\n`;
    content += `====================================================\n\n`;

    content += `--- SAVED FARMERS MARKETS (${savedMarketsList.length}) ---\n\n`;
    if (savedMarketsList.length === 0) {
      content += `(No markets saved yet)\n\n`;
    } else {
      savedMarketsList.forEach((m, idx) => {
        content += `${idx + 1}. ${m.name.toUpperCase()}\n`;
        content += `   Area: ${m.area} (${m.neighborhood})\n`;
        content += `   Address: ${m.address}\n`;
        content += `   Operating Days: ${m.days.join(', ')}\n`;
        content += `   Contact: ${m.contact.phone} | ${m.contact.email}\n`;
        if (sessionNotes[m.id]) {
          content += `   Personal Note: "${sessionNotes[m.id]}"\n`;
        }
        content += `\n`;
      });
    }

    content += `--- SAVED PRODUCE PICKS (${savedProduceList.length}) ---\n\n`;
    if (savedProduceList.length === 0) {
      content += `(No produce items saved yet)\n\n`;
    } else {
      savedProduceList.forEach((p, idx) => {
        content += `${idx + 1}. ${p.name} [${p.category}]\n`;
        content += `   Season: ${p.season} (${p.seasonStatus})\n`;
        content += `   Price: ${p.priceRange}\n`;
        content += `   Storage Tip: ${p.storageTip}\n`;
        content += `   Available At: ${p.availableMarkets.join(', ')}\n`;
        if (sessionNotes[p.id]) {
          content += `   Personal Note: "${sessionNotes[p.id]}"\n`;
        }
        content += `\n`;
      });
    }

    content += `====================================================\n`;
    content += `Keep supporting local growers and sustainable food systems.\n`;
    content += `Visit: https://freshfind.green\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `freshfind-basket-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast('Your harvest basket was exported successfully!', 'success');
  };

  // Social Share
  const shareMarketOrPage = (title, text, url = window.location.href) => {
    if (navigator.share) {
      navigator.share({ title, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        addToast('Link copied to clipboard!', 'success');
      }).catch(() => {
        addToast('Share URL: ' + url, 'info');
      });
    }
  };

  // Dummy login action
  const handleDummyAuth = (email, name) => {
    setUser({ email, name: name || 'Market Explorer' });
    setAuthModalOpen(false);
    addToast(`Welcome back, ${name || 'Explorer'}! (Demo Mode)`, 'success');
  };

  const handleDummyLogout = () => {
    setUser(null);
    addToast('Signed out of demo session.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        favoriteMarkets,
        favoriteProduce,
        sessionNotes,
        userLocation,
        authModalOpen,
        authMode,
        user,
        isChatOpen,
        isBookmarkDrawerOpen,
        toasts,
        setAuthModalOpen,
        setAuthMode,
        setIsChatOpen,
        setIsBookmarkDrawerOpen,
        toggleFavoriteMarket,
        toggleFavoriteProduce,
        updateSessionNote,
        requestLocation,
        exportBookmarks,
        shareMarketOrPage,
        handleDummyAuth,
        handleDummyLogout,
        addToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
