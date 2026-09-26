# FreshFind – Fresh All Along

> **Project Theme:** eGreen Basket  
> **Project Category:** Web Innovation Unleashed  
> **Showcase Platform:** Aptech / TechWiz Project Showcase  

---

## 1. Project Overview

**FreshFind** is a premium, client-side React web platform designed to revitalize urban food systems by connecting conscious eaters with regional, certified organic and regenerative farmers markets. 

Built around the ethos **"Fresh All Along"**, FreshFind combines an organic, natural aesthetic with modern green-technology sensibilities—featuring interactive 3D harvest graphics, client-side geolocation distance calculation, real-time operating status logic (OPEN NOW / CLOSED / OPENS SOON), a static rule-based botanical knowledge chatbot, and a private bookmark and session-note system with instant local itinerary file export.

FreshFind strictly adheres to a **zero-backend, frontend-only architecture**, storing all master data in structured JSON files with zero third-party tracking, live AI APIs, or server dependencies.

---

## 2. Key Features

1. **Cinematic Hero Experience**:
   - 3D interactive farmers market scene powered by Three.js featuring procedural organic produce (heirloom tomatoes, carrots, apples, and kabocha pumpkins) with interactive mouse parallax and gentle oscillation.
   - High-contrast, balanced typography (`Plus Jakarta Sans` & `Playfair Display`).
   - Dynamic real-time community indicators.

2. **Live Market Discovery & Radar**:
   - Filter by Area, Day of the Week, and Produce specialty.
   - Real-time client-side clock synchronized with device date/time.
   - Dynamic status derivation: **OPEN NOW**, **OPEN SOON**, and **CLOSED**.

3. **Interactive Spatial Map & Coordinate Explorer**:
   - Custom coordinate radar visualizing all 14 regional farmers markets across district sectors.
   - Interactive pins displaying market name, operational status, and straight-line distance.

4. **Comprehensive Market Directory (`/markets`)**:
   - Search across market names, addresses, neighborhoods, and stocked produce.
   - Multi-filtering by Area, Operating Day, and Produce.
   - Sorting by Featured, Alphabetical (A-Z), Distance (nearest to farthest via GPS), and Rating.
   - Grid and list view layout toggles with empty state handling and reset filters.

5. **Deep Market Details (`/market/:slug`)**:
   - Hero banner, location metadata, and GPS proximity.
   - Full weekly timetable with **TODAY** highlighted.
   - Verified market amenities (EV charging, compost drop-off, dog-friendly, wheelchair accessible).
   - Direct links to available produce items.
   - Session-only private shopping note editor.
   - One-click social sharing (Web Share API + clipboard fallback).

6. **Seasonal Produce Guide (`/produce`)**:
   - Catalog of 32+ heirloom vegetables, fruits, herbs, dairy, and artisanal staples.
   - Interactive 3D inspection view for produce items.
   - Detailed culinary storage tips, nutritional profiles, and carbon footprint reduction estimates.

7. **Four Seasons Harvest Almanac (`/seasonal`)**:
   - Visual guides for Spring Awakening, Summer Bounty, Autumn Harvest, and Winter Cellar.
   - Seasonal climate profiles, chef tips, and recommended markets for each cycle.

8. **Static Rule-Based Botanical Chatbot**:
   - 100% local, rule-based keyword and intent matching engine reading `chatbot.json`.
   - Zero external AI API calls (no OpenAI, Gemini, or Claude tokens required).
   - Conversational UI with pre-suggested prompts and deep links to relevant pages.

9. **"My Fresh Finds" Basket & Itinerary Export (`/bookmarks`)**:
   - Save favorite markets and produce items.
   - Attach private, session-only notes (persisted in `sessionStorage`).
   - Browser-native export generating a formatted `.txt` itinerary file downloaded directly to the user's device.

10. **Simulated Community Pulse**:
    - Simulated live visitor counter with periodic increments.
    - Live ticking clock displaying day, date, and current local time.

11. **Dummy Authentication UI**:
    - Complete Sign In and Create Account dialog for visual and presentation completeness.
    - Clear demo indicators respecting zero backend constraints.

12. **Accessibility & Responsive Polish**:
    - Semantic HTML5, ARIA labels, visible focus rings, and skip-link navigation.
    - Fully responsive across 1920px desktop down to 360px mobile.
    - Strict `prefers-reduced-motion` compliance.

---

## 3. Technology Stack

- **Framework:** React.js (JavaScript JSX ONLY — zero TypeScript)
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Custom CSS3 Design System with CSS Custom Properties (Zero Tailwind CSS)
- **3D Graphics:** Three.js (`three`)
- **Icons:** Lucide React (`lucide-react`)
- **Build Tool:** Vite
- **Data Architecture:** Local JSON files (`markets.json`, `produce.json`, `chatbot.json`, `seasons.json`, `categories.json`)
- **Storage:** Browser `localStorage` (bookmarks) and `sessionStorage` (private visit notes)

---

## 4. Folder Structure

```text
├── index.html                   # HTML entry point with meta tags & Google Fonts
├── metadata.json                # Project identity and capabilities
├── package.json                 # Dependencies and build scripts
├── vite.config.js               # Clean Vite configuration (pure JS, no Tailwind plugin)
├── README.md                    # Project documentation
└── src/
    ├── main.jsx                 # React root DOM mount
    ├── App.jsx                  # Main router and global layout
    ├── index.css                # Master CSS entry point importing custom sheets
    ├── assets/
    │   └── images/              # High-fidelity photography assets
    ├── context/
    │   └── AppContext.jsx       # State management for bookmarks, notes, GPS, toasts
    ├── data/
    │   ├── markets.json         # 14 detailed farmers market records
    │   ├── produce.json         # 32+ seasonal produce records
    │   ├── chatbot.json         # Rule-based intents and suggested prompts
    │   ├── seasons.json         # Seasonal calendar and culinary insights
    │   └── categories.json      # Produce categories
    ├── utils/
    │   └── marketStatus.js      # Dynamic open/close status & Haversine distance
    ├── components/
    │   ├── Navbar.jsx           # Top Bar Contract navigation
    │   ├── Footer.jsx           # Sustainable footer with clock & counters
    │   ├── MarketCard.jsx       # Market card with image, hours & status
    │   ├── ProduceCard.jsx      # Produce card with 3D viewer toggle
    │   ├── MarketStatus.jsx     # Semantic open/closed beacon badge
    │   ├── Breadcrumbs.jsx      # Hierarchical navigation trail
    │   ├── LiveClock.jsx        # Real-time ticking device clock
    │   ├── VisitorCounter.jsx   # Simulated community explorer counter
    │   ├── InteractiveMap.jsx   # Spatial coordinate radar
    │   ├── Chatbot.jsx          # Static rule-based floating assistant
    │   ├── BookmarkPanel.jsx    # Slide-over harvest basket drawer
    │   ├── AuthModal.jsx        # Dummy authentication dialog
    │   ├── ScrollProgress.jsx   # Top window scroll depth progress bar
    │   ├── Toast.jsx            # Notification toast display
    │   └── 3d/
    │       ├── HeroScene.jsx    # Interactive 3D Three.js hero market scene
    │       └── Produce3D.jsx    # Interactive draggable 3D produce model
    ├── pages/
    │   ├── Home.jsx             # 15+ section long-form storytelling landing
    │   ├── Markets.jsx          # Searchable, filterable market directory
    │   ├── MarketDetails.jsx    # Comprehensive market view & timetable
    │   ├── Produce.jsx          # Complete produce browsing guide
    │   ├── Seasonal.jsx         # Four-season agricultural almanac
    │   ├── About.jsx            # Platform story, mission & impact
    │   ├── Contact.jsx          # Inquiries form & guild contact details
    │   ├── Bookmarks.jsx        # Full harvest basket dashboard
    │   └── NotFound.jsx         # 404 error page
    └── styles/
        ├── variables.css        # Colors, glassmorphism tokens, radii, shadows
        ├── global.css           # Resets, typography, layout containers
        ├── animations.css       # Keyframes for floating, beacons, and fades
        ├── components.css       # Card, button, drawer, and modal rules
        └── responsive.css       # Breakpoints from 1440px to 360px
```

---

## 5. JSON Data Explanation

All application data resides inside `/src/data/`:

1. `markets.json`: Contains 14 detailed market records. Each entry includes:
   - `id`, `name`, `slug`, `tagline`
   - `area`, `neighborhood`, `address`, `coordinates` (`lat`, `lng`)
   - `days` (array of operating days)
   - `hours` (map of day-to-hours string, e.g. `"08:00-14:00"`)
   - `description`, `featured`, `rating`, `reviewCount`, `stallsCount`
   - `produce` (array of specialty crops stocked)
   - `amenities` (array of facilities)
   - `contact` (phone, email, manager name)

2. `produce.json`: Contains 32+ individual produce crops with:
   - `id`, `name`, `category`, `season`, `seasonStatus` (`peak`, `in_season`, `coming_soon`)
   - `description`, `storageTip`, `nutrition`, `carbonImpact`, `priceRange`
   - `availableMarkets` (list of regional markets carrying this crop)

3. `chatbot.json`: Contains keyword triggers, questions, static answer texts, and direct navigation action links for the rule-based assistant.

4. `seasons.json`: Encapsulates seasonal themes, climate patterns, recommended markets, and chef tips for Spring, Summer, Autumn, and Winter.

5. `categories.json`: Defines category taxonomy (Vegetables, Fruits, Herbs, Dairy & Pantry, Artisanal Goods).

---

## 6. How Key Systems Work

### A. Market Status Logic (`src/utils/marketStatus.js`)
- The system reads the client's current date and time via `new Date()`.
- It matches the current day name (e.g., "Saturday") against the market's `hours` map.
- If the market is scheduled today, it parses the open and close times into minutes from midnight (e.g. `08:00` $\to 480\text{ mins}$, `14:00` $\to 840\text{ mins}$).
- If the current minute is within the window, the status is **OPEN NOW** with a closing countdown.
- If within 60 minutes before opening, the status is **OPENING SOON**.
- If closed today, it iterates forward through the week to identify and announce the next opening day.

### B. Geolocation & Proximity
- Triggered by the "Use My Location" action using `navigator.geolocation.getCurrentPosition()`.
- Calculates straight-line distance in kilometers to each market's coordinates using the **Haversine formula**.
- If location permission is denied or unsupported, a graceful notice is shown, allowing the user to seamlessly filter by area without errors.

### C. Static Rule-Based Chatbot
- Evaluates the user's typed input by normalizing to lowercase and scoring against keyword arrays defined in `chatbot.json`.
- The highest scoring intent returns a curated, helpful answer along with an actionable routing button (e.g. "Open Green Valley Market Guide").
- If no keyword matches, a structured fallback is provided with quick navigation links.
- Strictly no external API calls, ensuring high privacy, zero cost, and instant response.

### D. Bookmark & Export System
- Markets and produce can be saved to the user's basket.
- Notes are kept in `sessionStorage` (strictly session-only as required by the SRS).
- When the user clicks **Export Itinerary**, a browser `Blob` of type `text/plain` is generated containing the user's saved markets, addresses, schedules, produce, and personal notes, automatically triggering a local file download named `freshfind-basket-[YYYY-MM-DD].txt`.

---

## 7. Installation & Run Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup Steps
```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Access in browser
# Open http://localhost:3000
```

### Production Build
```bash
# Compile and package for production
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Deployment

Because FreshFind is a 100% client-side React single-page application with zero backend or database requirements, it can be deployed to any static host:

- **Vercel / Netlify / Cloudflare Pages**: Simply point the build command to `npm run build` and publish directory to `dist`. Ensure a single-page rewrite rule redirects all routes (`/*`) to `/index.html`.
- **GitHub Pages**: Build with `npm run build` and deploy the `dist/` directory.

---

*Fresh All Along. Built with pride for Aptech / TechWiz.*


## Final Showcase Pass
- Premium hero showcase/control deck visual refinement.
- Saved-finds (wishlist) navbar action and count badge alignment polish.
- Added a visual scroll-journey progress rail to the existing hero scene controls.
- Smoothed the existing scroll-scrub interpolation/seek threshold without changing the feature.
- Preserved routing, filters, wishlist, chatbot, GPS, counters, and existing interactions.
