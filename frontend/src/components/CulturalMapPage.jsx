import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DISCOVERIES_DATA } from '../data/discoveries';
import {
  ArrowLeftIcon,
  MapPinIcon,
  CompassIcon,
  SearchIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  LayersIcon,
  LandmarkIcon,
  SparklesIcon,
  PaletteIcon,
  HammerIcon,
  ChevronRightIcon
} from './Icons';

// Default Thrissur District Center Coordinates & Zoom (Module-level constants)
const DEFAULT_CENTER = [10.5244, 76.2138];
const DEFAULT_ZOOM = 10;

// Category color tokens and glyph definitions
const CATEGORY_CONFIG = {
  'Heritage Space': {
    label: 'Heritage Spaces',
    pinColor: '#5A1827',
    borderColor: '#B8973D',
    innerBg: '#3F101B',
    accentColor: '#B8973D',
    badgeClass: 'bg-[#5A1827] text-[#FAF8F5] border border-[#B8973D]/50',
    iconGlyph: `
      <polygon points="12 2 20 7 4 7" fill="#B8973D"/>
      <line x1="2" y1="22" x2="22" y2="22" stroke="#B8973D" stroke-width="2"/>
      <line x1="6" y1="18" x2="6" y2="9" stroke="#FAF8F5" stroke-width="1.5"/>
      <line x1="10" y1="18" x2="10" y2="9" stroke="#FAF8F5" stroke-width="1.5"/>
      <line x1="14" y1="18" x2="14" y2="9" stroke="#FAF8F5" stroke-width="1.5"/>
      <line x1="18" y1="18" x2="18" y2="9" stroke="#FAF8F5" stroke-width="1.5"/>
    `
  },
  'Festival': {
    label: 'Festivals',
    pinColor: '#3F101B',
    borderColor: '#D4B257',
    innerBg: '#5A1827',
    accentColor: '#D4B257',
    badgeClass: 'bg-[#3F101B] text-[#FAF8F5] border border-[#D4B257]/50',
    iconGlyph: `
      <path d="M12 2c1.8 3 4.2 5.2 4.2 8.3a4.2 4.2 0 0 1-8.4 0c0-2.2 1.2-3.8 2.2-5.3.5 1.5 1.5 2 2 2 .5 0 1-.5 1-1.5z" fill="#D4B257"/>
      <circle cx="12" cy="17" r="1" fill="#FAF8F5"/>
    `
  },
  'Art Form': {
    label: 'Art Forms',
    pinColor: '#7A2236',
    borderColor: '#B8973D',
    innerBg: '#3F101B',
    accentColor: '#E6C673',
    badgeClass: 'bg-[#7A2236] text-[#FAF8F5] border border-[#B8973D]/50',
    iconGlyph: `
      <circle cx="12" cy="12" r="7.5" fill="none" stroke="#FAF8F5" stroke-width="1.5"/>
      <circle cx="9.5" cy="10" r="1.2" fill="#D4B257"/>
      <circle cx="14.5" cy="10" r="1.2" fill="#D4B257"/>
      <path d="M9 15.2c1.2 1.2 4.8 1.2 6 0" stroke="#FAF8F5" stroke-width="1.4" stroke-linecap="round"/>
      <line x1="12" y1="4" x2="12" y2="6.5" stroke="#D4B257" stroke-width="1.5"/>
    `
  },
  'Craft': {
    label: 'Crafts',
    pinColor: '#4F1824',
    borderColor: '#D4B257',
    innerBg: '#2A0B12',
    accentColor: '#D4B257',
    badgeClass: 'bg-[#4F1824] text-[#FAF8F5] border border-[#D4B257]/50',
    iconGlyph: `
      <path d="M15 4l5 5-2 2-5-5 2-2z" fill="#D4B257"/>
      <path d="M4 20l7-7" stroke="#FAF8F5" stroke-width="2" stroke-linecap="round"/>
      <path d="M3 21l2-2" stroke="#D4B257" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="8" cy="8" r="1" fill="#D4B257"/>
    `
  }
};

// Generate Leaflet DivIcon HTML for a discovery
function createDivIcon(item, isSelected) {
  const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG['Heritage Space'];
  const activeClass = isSelected ? 'marker-active' : '';

  const html = `
    <div class="riva-marker-container ${activeClass}" id="marker-${item.id}">
      ${item.isAreaLevel ? '<div class="riva-marker-area-ring"></div><div class="riva-marker-pulse"></div>' : ''}
      <svg class="riva-marker-pin" viewBox="0 0 38 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 0C8.50659 0 0 8.50659 0 19C0 32.5 19 48 19 48C19 48 38 32.5 38 19C38 8.50659 29.4934 0 19 0Z" fill="${config.pinColor}" stroke="${config.borderColor}" stroke-width="2" />
        <circle cx="19" cy="19" r="13.5" fill="${config.innerBg}" stroke="${config.borderColor}" stroke-width="1" />
        <g transform="translate(7, 7)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            ${config.iconGlyph}
          </svg>
        </g>
      </svg>
      ${item.isAreaLevel ? '<span class="absolute -bottom-1.5 bg-[#B8973D] text-[#3F101B] text-[8px] font-black uppercase px-1 py-0.2 rounded border border-white/60 shadow whitespace-nowrap">AREA</span>' : ''}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'riva-div-icon',
    iconSize: [38, 48],
    iconAnchor: [19, 48],
    popupAnchor: [0, -46]
  });
}

// Generate Leaflet Popup HTML
function createPopupContent(item) {
  const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG['Heritage Space'];

  return `
    <div class="riva-popup-shell font-sans text-left">
      <div class="relative h-32 w-full overflow-hidden bg-[#221E1F]">
        <img 
          src="${item.image}" 
          alt="${item.name}" 
          class="w-full h-full object-cover" 
          onerror="this.onerror=null; this.src='/kerala-temple-woodcraft.jpg';"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
          <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.badgeClass} shadow-sm backdrop-blur-md">
            ${item.category}
          </span>
          ${item.isAreaLevel ? '<span class="text-[9px] font-bold text-amber-300 bg-amber-950/80 border border-amber-400/50 px-2 py-0.5 rounded-full shadow-sm">Area Tradition</span>' : ''}
        </div>
        <div class="absolute bottom-2 left-2.5 right-2.5 text-white flex items-center justify-between text-[10px] font-mono">
          <span class="text-[#D4B257] font-semibold">${item.coordinates}</span>
          <span class="text-white/80 bg-black/40 px-1.5 py-0.5 rounded text-[9px]">${item.era}</span>
        </div>
      </div>
      <div class="p-3.5 bg-[#FAF8F5]">
        <h4 class="font-serif text-lg font-bold text-[#5A1827] leading-snug mb-1">
          ${item.name}
        </h4>
        <div class="text-[11px] text-[#221E1F]/75 flex items-center mb-2">
          <svg class="w-3.5 h-3.5 text-[#B8973D] mr-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span class="truncate font-medium">${item.locality}</span>
        </div>
        <p class="text-[11px] text-[#221E1F]/80 line-clamp-2 leading-relaxed mb-3">
          ${item.desc}
        </p>
        <div class="pt-2.5 border-t border-[#B8973D]/25 flex items-center justify-between">
          <span class="text-[10px] text-[#221E1F]/60 font-mono">ID #${item.id < 10 ? '0' + item.id : item.id}</span>
          <button 
            type="button" 
            data-discovery-id="${item.id}" 
            class="riva-popup-details-btn inline-flex items-center space-x-1 bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm transition-all cursor-pointer hover:shadow-md"
          >
            <span>View Full Record</span>
            <span class="font-bold">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export default function CulturalMapPage({
  onSelectDiscovery,
  onNavigateHome,
  onLaunchMagicLens,
  initialDiscoveryId = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Map Filter and Search State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mapSearchTerm, setMapSearchTerm] = useState('');
  const [activeDiscoveryId, setActiveDiscoveryId] = useState(initialDiscoveryId);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filtered discoveries based on category and search query
  const filteredDiscoveries = useMemo(() => {
    return DISCOVERIES_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const query = mapSearchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.locality.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, mapSearchTerm]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Leaflet map instance centered on Thrissur District
    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 8,
      maxZoom: 18,
      zoomControl: false, // We'll position zoom control neatly in bottom-right
      scrollWheelZoom: true
    });

    // Standard OpenStreetMap tiles (No API key required)
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
    });
    tileLayer.addTo(map);

    // Reposition zoom controls to bottom-right
    L.control
      .zoom({
        position: 'bottomright'
      })
      .addTo(map);

    mapInstanceRef.current = map;

    // Handle delegated clicks from Leaflet popups
    const handlePopupClick = (e) => {
      const detailsBtn = e.target.closest('.riva-popup-details-btn');
      if (detailsBtn) {
        const id = parseInt(detailsBtn.getAttribute('data-discovery-id'), 10);
        if (id && onSelectDiscovery) {
          onSelectDiscovery(id);
        }
      }
    };

    const container = mapContainerRef.current;
    container.addEventListener('click', handlePopupClick);

    // Ensure map tiles and container recalculate size cleanly
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handlePopupClick);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onSelectDiscovery]);

  // 2. Synchronize Markers with Filtered Discoveries
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers from map
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add markers for current filtered discoveries
    filteredDiscoveries.forEach((item) => {
      const isSelected = item.id === activeDiscoveryId;
      const icon = createDivIcon(item, isSelected);

      const marker = L.marker([item.lat, item.lng], {
        icon,
        title: item.name,
        riseOnHover: true
      });

      const popupHtml = createPopupContent(item);
      marker.bindPopup(popupHtml, {
        maxWidth: 320,
        className: 'riva-leaflet-popup'
      });

      marker.on('click', () => {
        setActiveDiscoveryId(item.id);
      });

      marker.addTo(map);
      markersRef.current[item.id] = marker;
    });

    // If an initial or active discovery is selected, open its popup
    if (activeDiscoveryId && markersRef.current[activeDiscoveryId]) {
      const activeItem = DISCOVERIES_DATA.find((d) => d.id === activeDiscoveryId);
      if (activeItem) {
        map.flyTo([activeItem.lat, activeItem.lng], 13, { duration: 0.8 });
        markersRef.current[activeDiscoveryId].openPopup();
      }
    }
  }, [filteredDiscoveries, activeDiscoveryId]);

  // Fly to and highlight a specific discovery on marker click or list click
  const handleFocusDiscovery = useCallback((item) => {
    setActiveDiscoveryId(item.id);
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo([item.lat, item.lng], 14, {
      duration: 1.2
    });

    const targetMarker = markersRef.current[item.id];
    if (targetMarker) {
      setTimeout(() => {
        targetMarker.openPopup();
      }, 500);
    }
  }, []);

  // Reset to default Thrissur District perspective
  const handleResetView = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    setActiveDiscoveryId(null);
    map.closePopup();
    map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, {
      duration: 1.0
    });
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: DISCOVERIES_DATA.length,
      'Heritage Space': DISCOVERIES_DATA.filter((d) => d.category === 'Heritage Space').length,
      Festival: DISCOVERIES_DATA.filter((d) => d.category === 'Festival').length,
      'Art Form': DISCOVERIES_DATA.filter((d) => d.category === 'Art Form').length,
      Craft: DISCOVERIES_DATA.filter((d) => d.category === 'Craft').length
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#221E1F] pt-24 pb-16 flex flex-col selection:bg-[#B8973D]/20 selection:text-[#5A1827]">
      {/* 1. Header & Navigation Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-6 w-full mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#B8973D]/25">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#221E1F]/60 mb-1">
              <button
                onClick={() => onNavigateHome('discoveries')}
                className="hover:text-[#5A1827] transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <button
                onClick={() => onNavigateHome('discoveries')}
                className="hover:text-[#5A1827] transition-colors cursor-pointer"
              >
                Discoveries
              </button>
              <span>/</span>
              <span className="text-[#5A1827] font-semibold">Interactive Cultural Map</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#5A1827] tracking-tight">
              Thrissur Cultural Geodatabase
            </h1>
            <p className="text-xs sm:text-sm text-[#221E1F]/70 mt-1 max-w-2xl leading-relaxed">
              Explore the living spatial geography of Thrissur district. Discover 15 verified heritage sanctuaries, sacred festivals, ritual performance grounds, and master artisan clusters mapped with geographical fidelity.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0 flex-wrap gap-2">
            <button
              onClick={() => onNavigateHome('discoveries')}
              className="inline-flex items-center space-x-2 bg-white hover:bg-[#5A1827] text-[#5A1827] hover:text-[#FAF8F5] border border-[#B8973D]/40 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5 text-[#B8973D]" />
              <span>Discoveries Grid</span>
            </button>
            <button
              onClick={handleResetView}
              className="inline-flex items-center space-x-1.5 bg-[#FAF8F5] hover:bg-[#B8973D]/15 text-[#3F101B] border border-[#B8973D]/40 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
              title="Reset map view to entire Thrissur District"
            >
              <RotateCcwIcon className="w-3.5 h-3.5 text-[#B8973D]" />
              <span>Reset Thrissur View</span>
            </button>
            {onLaunchMagicLens && (
              <button
                onClick={onLaunchMagicLens}
                className="inline-flex items-center space-x-1.5 bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                title="Launch Magic Lens automated discovery journey"
              >
                <SparklesIcon className="w-3.5 h-3.5 text-[#D4B257]" />
                <span>Magic Lens</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Category Filter & Search Bar */}
        <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#5A1827] text-[#FAF8F5] shadow-sm ring-1 ring-[#B8973D]'
                  : 'bg-white hover:bg-[#5A1827]/10 text-[#221E1F] border border-[#B8973D]/30'
              }`}
            >
              All Traditions ({categoryCounts.all})
            </button>
            <button
              onClick={() => setSelectedCategory('Heritage Space')}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'Heritage Space'
                  ? 'bg-[#5A1827] text-[#FAF8F5] shadow-sm ring-1 ring-[#B8973D]'
                  : 'bg-white hover:bg-[#5A1827]/10 text-[#221E1F] border border-[#B8973D]/30'
              }`}
            >
              <LandmarkIcon className="w-3.5 h-3.5 text-[#B8973D]" />
              <span>Heritage Spaces ({categoryCounts['Heritage Space']})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('Festival')}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'Festival'
                  ? 'bg-[#3F101B] text-[#FAF8F5] shadow-sm ring-1 ring-[#D4B257]'
                  : 'bg-white hover:bg-[#3F101B]/10 text-[#221E1F] border border-[#B8973D]/30'
              }`}
            >
              <SparklesIcon className="w-3.5 h-3.5 text-[#B8973D]" />
              <span>Festivals ({categoryCounts['Festival']})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('Art Form')}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'Art Form'
                  ? 'bg-[#7A2236] text-[#FAF8F5] shadow-sm ring-1 ring-[#B8973D]'
                  : 'bg-white hover:bg-[#7A2236]/10 text-[#221E1F] border border-[#B8973D]/30'
              }`}
            >
              <PaletteIcon className="w-3.5 h-3.5 text-[#B8973D]" />
              <span>Art Forms ({categoryCounts['Art Form']})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('Craft')}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'Craft'
                  ? 'bg-[#4F1824] text-[#FAF8F5] shadow-sm ring-1 ring-[#D4B257]'
                  : 'bg-white hover:bg-[#4F1824]/10 text-[#221E1F] border border-[#B8973D]/30'
              }`}
            >
              <HammerIcon className="w-3.5 h-3.5 text-[#B8973D]" />
              <span>Crafts ({categoryCounts['Craft']})</span>
            </button>
          </div>

          {/* Quick Search on Map */}
          <div className="relative w-full lg:w-72">
            <input
              type="text"
              value={mapSearchTerm}
              onChange={(e) => setMapSearchTerm(e.target.value)}
              placeholder="Search map discoveries..."
              className="w-full bg-white border border-[#B8973D]/35 rounded-full py-2 pl-9 pr-8 text-xs text-[#221E1F] placeholder-[#221E1F]/40 focus:outline-none focus:border-[#5A1827] shadow-sm"
            />
            <span className="absolute left-3 top-2.5 text-[#B8973D]">
              <SearchIcon className="w-3.5 h-3.5" />
            </span>
            {mapSearchTerm && (
              <button
                onClick={() => setMapSearchTerm('')}
                className="absolute right-2.5 top-2 text-[#221E1F]/50 hover:text-[#5A1827] text-xs font-bold"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Map & Interactive Discovery Drawer Section */}
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col lg:flex-row gap-6 relative">
        {/* Map Container Area */}
        <div 
          className="flex-1 relative rounded-2xl overflow-hidden border-2 border-[#B8973D]/35 shadow-xl bg-[#FAF8F5] min-h-[540px] lg:min-h-[640px]"
          style={{ minHeight: '540px', height: '100%', width: '100%' }}
        >
          {/* Leaflet Map Div */}
          <div 
            ref={mapContainerRef} 
            className="w-full h-full min-h-[540px] lg:min-h-[640px]"
            style={{ minHeight: '540px', height: '100%', width: '100%' }} 
          />

          {/* Floating Map Legend Card */}
          <div className="absolute top-4 left-4 z-[400] max-w-[260px] bg-[#FAF8F5]/95 backdrop-blur-md border border-[#B8973D]/40 rounded-xl p-3 shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#B8973D]/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A1827] flex items-center space-x-1.5">
                <LayersIcon className="w-3.5 h-3.5 text-[#B8973D]" />
                <span>Map Legend</span>
              </span>
              <button
                onClick={() => setIsLegendOpen(!isLegendOpen)}
                className="text-[10px] text-[#B8973D] hover:text-[#5A1827] font-semibold underline cursor-pointer"
              >
                {isLegendOpen ? 'Hide' : 'Show'}
              </button>
            </div>

            {isLegendOpen && (
              <div className="space-y-1.5 text-[11px] text-[#221E1F]/80">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#5A1827] border border-[#B8973D] inline-block shrink-0" />
                  <span>Heritage Spaces (5)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#3F101B] border border-[#D4B257] inline-block shrink-0" />
                  <span>Sacred Festivals (3)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#7A2236] border border-[#B8973D] inline-block shrink-0" />
                  <span>Art Forms (3)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#4F1824] border border-[#D4B257] inline-block shrink-0" />
                  <span>Master Crafts (4)</span>
                </div>
                <div className="pt-1.5 border-t border-[#B8973D]/20 flex items-center space-x-2 text-[10px] text-[#5A1827] font-medium">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#B8973D] inline-block shrink-0 animate-spin-slow" />
                  <span>Area-Level Multi-Temple Art</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Pill (Top Right) */}
          <div className="absolute top-4 right-4 z-[400] hidden sm:flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#B8973D]/30 shadow-md text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-[#5A1827]">{filteredDiscoveries.length} Traditions Visible</span>
            <span className="text-[#221E1F]/40">•</span>
            <span className="text-[#221E1F]/70">Thrissur Geodatabase</span>
          </div>

          {/* Mobile Toggle Drawer Button */}
          <div className="lg:hidden absolute bottom-4 left-4 z-[400]">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-[#5A1827] text-[#FAF8F5] px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1.5 border border-[#B8973D]/50"
            >
              <span>{isSidebarOpen ? 'Hide Discovery List' : `Show Discoveries (${filteredDiscoveries.length})`}</span>
            </button>
          </div>
        </div>

        {/* Interactive Discovery Sidebar / Drawer */}
        {isSidebarOpen && (
          <aside className="w-full lg:w-96 flex flex-col bg-white rounded-2xl border-2 border-[#B8973D]/30 shadow-xl overflow-hidden max-h-[640px]">
            {/* Sidebar Header */}
            <div className="p-4 bg-[#FAF8F5] border-b border-[#B8973D]/25 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
                  Location Directory
                </span>
                <h3 className="font-serif text-lg font-bold text-[#5A1827]">
                  {selectedCategory === 'all' ? 'All Thrissur Locations' : selectedCategory} ({filteredDiscoveries.length})
                </h3>
              </div>
              <span className="text-xs font-mono text-[#221E1F]/60 bg-white px-2.5 py-1 rounded-full border border-[#B8973D]/20">
                15 Total
              </span>
            </div>

            {/* Discoveries Scrollable List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 divide-y divide-[#B8973D]/15">
              {filteredDiscoveries.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-xs text-[#221E1F]/60 mb-2">No cultural traditions match your search query.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setMapSearchTerm('');
                    }}
                    className="text-xs bg-[#5A1827] text-white px-3.5 py-1.5 rounded-full font-semibold"
                  >
                    Reset Search & Filters
                  </button>
                </div>
              ) : (
                filteredDiscoveries.map((item) => {
                  const isActive = item.id === activeDiscoveryId;
                  const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG['Heritage Space'];

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleFocusDiscovery(item)}
                      className={`pt-3 first:pt-0 group rounded-xl p-2.5 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#5A1827]/10 border border-[#5A1827]/30 shadow-inner'
                          : 'hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-[#B8973D]/30 bg-[#221E1F]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/kerala-temple-woodcraft.jpg';
                            }}
                          />
                          <span className="absolute bottom-1 left-1 text-[8px] font-mono text-white bg-black/60 px-1 rounded">
                            #{item.id < 10 ? '0' + item.id : item.id}
                          </span>
                        </div>

                        {/* Information Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.badgeClass}`}>
                              {item.category}
                            </span>
                            {item.isAreaLevel && (
                              <span className="text-[8px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded">
                                District Tradition
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif text-base font-bold text-[#5A1827] truncate group-hover:text-[#7A2236] transition-colors leading-snug">
                            {item.name}
                          </h4>

                          <p className="text-[11px] text-[#221E1F]/70 flex items-center mt-0.5 truncate">
                            <MapPinIcon className="w-3 h-3 text-[#B8973D] mr-1 shrink-0" />
                            <span className="truncate">{item.locality}</span>
                          </p>

                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#B8973D]">
                              {item.coordinates}
                            </span>
                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFocusDiscovery(item);
                                }}
                                className="text-[10px] font-bold text-[#5A1827] hover:underline"
                              >
                                Locate
                              </button>
                              <span className="text-[#221E1F]/30">•</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onSelectDiscovery) onSelectDiscovery(item.id);
                                }}
                                className="text-[10px] font-bold text-[#B8973D] hover:text-[#5A1827] inline-flex items-center"
                              >
                                <span>Details</span>
                                <ChevronRightIcon className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sidebar Bottom Banner */}
            <div className="p-3 bg-[#FAF8F5] border-t border-[#B8973D]/20 text-[11px] text-[#221E1F]/70 flex items-center justify-between">
              <span className="flex items-center space-x-1 text-[#5A1827] font-semibold">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Geographical Fidelity</span>
              </span>
              <span className="text-[10px] text-[#221E1F]/50">Click card to pan map</span>
            </div>
          </aside>
        )}
      </div>

      {/* 4. Cultural Geographic Authenticity & Documentation Callout */}
      <section className="max-w-7xl mx-auto px-6 w-full mt-10">
        <div className="bg-white rounded-2xl border border-[#B8973D]/30 p-6 md:p-8 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#5A1827]/10 flex items-center justify-center shrink-0 border border-[#B8973D]/40">
              <CompassIcon className="w-5 h-5 text-[#5A1827]" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
                Spatial Accuracy & Archival Truth
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#5A1827] mt-1 mb-2">
                Cartographic Principles of the Thrissur Cultural Map
              </h3>
              <p className="text-xs sm:text-sm text-[#221E1F]/80 leading-relaxed font-light mb-4">
                Unlike decorative tourist maps that artificially cluster traditions in the municipal center, RIVA documents the real spatial boundaries of Kerala cultural geography across the entire district:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#B8973D]/20 text-xs">
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#B8973D]/20">
                  <h4 className="font-bold text-[#5A1827] mb-1 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#B8973D]" />
                    <span>Palakkad–Thrissur Border</span>
                  </h4>
                  <p className="text-[#221E1F]/75 leading-relaxed text-[11px]">
                    <strong>Tholpavakoothu (Shadow Puppetry)</strong> is accurately pinned to Koonathara (10.7725° N, 76.3218° E) along the sacred Bharathapuzha river corridor on the borderland, honoring the traditional Pulavar family sangham rather than central Thrissur.
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#B8973D]/20">
                  <h4 className="font-bold text-[#5A1827] mb-1 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#5A1827]" />
                    <span>Area-Level Living Traditions</span>
                  </h4>
                  <p className="text-[#221E1F]/75 leading-relaxed text-[11px]">
                    <strong>Kalamezhuthu (Sacred Floor Powder Art)</strong> is represented as an area-level ritual art celebrated across multiple shrines and sacred groves throughout the district, rather than assigned to a false single building coordinate.
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#B8973D]/20">
                  <h4 className="font-bold text-[#5A1827] mb-1 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#927329]" />
                    <span>Artisan & Coastal Hamlets</span>
                  </h4>
                  <p className="text-[#221E1F]/75 leading-relaxed text-[11px]">
                    Discoveries span from <strong>Kodungallur</strong> in the coastal south and <strong>Guruvayur</strong> in the west to the GI craft clusters of <strong>Irinjalakuda (Nadavaramba)</strong> and <strong>Cherpu</strong>, reflecting the genuine living landscape.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
