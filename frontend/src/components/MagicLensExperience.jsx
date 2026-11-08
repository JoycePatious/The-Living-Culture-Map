import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DISCOVERIES_DATA, STORIES_DATA } from '../data/discoveries';
import {
  SparklesIcon,
  CompassIcon,
  MapPinIcon,
  RotateCcwIcon,
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  XIcon,
  ShieldCheckIcon,
  LandmarkIcon,
  PaletteIcon,
  HammerIcon
} from './Icons';

// Default Thrissur District Coordinates & Zoom
const THRISSUR_CENTER = [10.5244, 76.2138];
const DEFAULT_MAP_ZOOM = 11;
const TARGET_ZOOM = 14;

// Cubic Ease-In-Out Easing Function
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Generate Custom DivIcon for Map Markers
function createDivIcon(item, isHighlighted) {
  const highlightClass = isHighlighted ? 'marker-scanned-beacon marker-active' : '';

  const html = `
    <div class="riva-marker-container ${highlightClass}" id="lens-marker-${item.id}">
      <svg class="riva-marker-pin" viewBox="0 0 38 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 0C8.50659 0 0 8.50659 0 19C0 32.5 19 48 19 48C19 48 38 32.5 38 19C38 8.50659 29.4934 0 19 0Z" fill="${
          item.category === 'Heritage Space'
            ? '#5A1827'
            : item.category === 'Festival'
            ? '#3F101B'
            : item.category === 'Art Form'
            ? '#7A2236'
            : '#4F1824'
        }" stroke="#D4B257" stroke-width="2" />
        <circle cx="19" cy="19" r="13" fill="#2A0B12" stroke="#D4B257" stroke-width="1" />
        <circle cx="19" cy="19" r="4" fill="#D4B257" />
      </svg>
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

export default function MagicLensExperience({
  onClose,
  onSelectDiscovery,
  onOpenStory,
  initialMode = 'surprise'
}) {
  // Experience States: 'intro' | 'scanning' | 'revealed'
  const [phase, setPhase] = useState('intro');

  // Mode Selection: 'surprise' | 'preferences'
  const [mode, setMode] = useState(initialMode);

  // Category Preferences in Mode B
  const [selectedCategories, setSelectedCategories] = useState([
    'Heritage Space',
    'Festival',
    'Art Form',
    'Craft'
  ]);
  const [preferenceError, setPreferenceError] = useState('');

  // Scanning Journey State
  const [targetDiscovery, setTargetDiscovery] = useState(null);
  const [currentCoordinates, setCurrentCoordinates] = useState('10.5244° N, 76.2138° E');
  const [scanningStatus, setScanningStatus] = useState('Calibrating Optics...');
  const [stepIndex, setStepIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(4);
  const [isPaused, setIsPaused] = useState(false);

  // Story Notification for items without interactive video breakdown
  const [storyNotice, setStoryNotice] = useState(null);

  // DOM Refs
  const baseMapContainerRef = useRef(null);
  const baseMapRef = useRef(null);
  const lensMapContainerRef = useRef(null);
  const lensMapRef = useRef(null);
  const lensAssemblyRef = useRef(null);
  const markersRef = useRef({});

  // Animation Refs
  const animationFrameRef = useRef(null);
  const waypointsRef = useRef([]);
  const waypointIdxRef = useRef(0);
  const segmentStartTimeRef = useRef(null);
  const isPausedRef = useRef(false);
  const pauseStartRef = useRef(null);
  const totalPausedTimeRef = useRef(0);
  const targetItemRef = useRef(null);

  // Keep ref in sync with state in effect
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Filter Eligible Discoveries based on Mode and Preferences
  const eligibleDiscoveries = useMemo(() => {
    if (mode === 'surprise') {
      return DISCOVERIES_DATA;
    }
    return DISCOVERIES_DATA.filter((d) => selectedCategories.includes(d.category));
  }, [mode, selectedCategories]);

  // Toggle Category Selection in Preferences Mode
  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      const exists = prev.includes(category);
      const updated = exists ? prev.filter((c) => c !== category) : [...prev, category];
      if (updated.length > 0) {
        setPreferenceError('');
      }
      return updated;
    });
  };

  // 1. Initialize Base Leaflet Map
  useEffect(() => {
    if (!baseMapContainerRef.current) return;
    if (baseMapRef.current) return;

    const baseMap = L.map(baseMapContainerRef.current, {
      center: THRISSUR_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      minZoom: 9,
      maxZoom: 18,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false, // Locked during automated scanning to ensure cinematic stability
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false
    });

    // OpenStreetMap standard public tiles (No API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
    }).addTo(baseMap);

    baseMapRef.current = baseMap;

    // Render Markers for all eligible discoveries
    DISCOVERIES_DATA.forEach((item) => {
      const icon = createDivIcon(item, false);
      const marker = L.marker([item.lat, item.lng], {
        icon,
        interactive: false
      }).addTo(baseMap);
      markersRef.current[item.id] = marker;
    });

    const timer = setTimeout(() => {
      baseMap.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      baseMap.remove();
      baseMapRef.current = null;
    };
  }, []);

  // 2. Initialize Secondary Magnified Map inside the Lens Assembly
  useEffect(() => {
    if (!lensMapContainerRef.current) return;
    if (lensMapRef.current) return;

    // The lens map runs at (Parent Zoom + 2) for authentic high-resolution cartographic magnification
    const lensMap = L.map(lensMapContainerRef.current, {
      center: THRISSUR_CENTER,
      zoom: DEFAULT_MAP_ZOOM + 2,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(lensMap);

    lensMapRef.current = lensMap;

    const timer = setTimeout(() => {
      lensMap.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      lensMap.remove();
      lensMapRef.current = null;
    };
  }, []);

  // Highlight a specific marker on the base map
  const highlightMarker = useCallback((id, isHighlighted) => {
    const marker = markersRef.current[id];
    if (!marker) return;
    const item = DISCOVERIES_DATA.find((d) => d.id === id);
    if (!item) return;

    const icon = createDivIcon(item, isHighlighted);
    marker.setIcon(icon);
  }, []);

  // Clear all marker highlights
  const clearAllHighlights = useCallback(() => {
    DISCOVERIES_DATA.forEach((item) => {
      highlightMarker(item.id, false);
    });
  }, [highlightMarker]);

  // Update position of the Lens Assembly and synchronized Inner Map
  const updateLensPosition = useCallback((lat, lng) => {
    const baseMap = baseMapRef.current;
    const lensMap = lensMapRef.current;
    const lensAssembly = lensAssemblyRef.current;

    if (!baseMap || !lensAssembly) return;

    // Convert lat/lng to container pixel coordinates
    const point = baseMap.latLngToContainerPoint([lat, lng]);

    // Position the lens assembly centered over the geographic point
    lensAssembly.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;

    // Update inner magnified map center
    if (lensMap) {
      lensMap.setView([lat, lng], baseMap.getZoom() + 2, { animate: false });
    }

    setCurrentCoordinates(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
  }, []);

  // 3. Complete and Reveal Discovery
  const finishAndReveal = useCallback(
    (target) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      setTargetDiscovery(target);
      setScanningStatus(`Identified: ${target.name}`);
      clearAllHighlights();
      highlightMarker(target.id, true);

      const baseMap = baseMapRef.current;
      if (baseMap) {
        // Smooth cinematic zoom towards target discovery
        baseMap.flyTo([target.lat, target.lng], TARGET_ZOOM, {
          duration: 1.4
        });
      }

      // Allow zoom animation to settle before presenting reveal modal
      setTimeout(() => {
        setPhase('revealed');
      }, 1200);
    },
    [clearAllHighlights, highlightMarker]
  );

  // 4. Start the Kinetic Scanning Animation Journey
  const startScanningJourney = useCallback(() => {
    if (eligibleDiscoveries.length === 0) {
      setPreferenceError('Please select at least one category before continuing.');
      return;
    }

    setPreferenceError('');
    clearAllHighlights();
    setIsPaused(false);
    isPausedRef.current = false;
    totalPausedTimeRef.current = 0;
    pauseStartRef.current = null;

    // Pick a random target from eligible discoveries
    const targetIdx = Math.floor(Math.random() * eligibleDiscoveries.length);
    const target = eligibleDiscoveries[targetIdx];
    targetItemRef.current = target;

    // Generate 3 intermediate waypoints to form a scenic flight path across Thrissur
    const otherEligible = DISCOVERIES_DATA.filter((d) => d.id !== target.id);
    const shuffled = [...otherEligible].sort(() => 0.5 - Math.random());
    const waypoints = [
      shuffled[0] || DISCOVERIES_DATA[0],
      shuffled[1] || DISCOVERIES_DATA[1],
      shuffled[2] || DISCOVERIES_DATA[2],
      target
    ];

    waypointsRef.current = waypoints;
    waypointIdxRef.current = 0;
    setTotalSteps(waypoints.length);
    setStepIndex(1);
    setPhase('scanning');

    const baseMap = baseMapRef.current;
    if (baseMap) {
      baseMap.setView(THRISSUR_CENTER, DEFAULT_MAP_ZOOM, { animate: false });
    }

    // Position lens at the initial waypoint
    const startWp = waypoints[0];
    updateLensPosition(startWp.lat, startWp.lng);
    setScanningStatus(`Scanning: ${startWp.locality}...`);
    highlightMarker(startWp.id, true);

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTimeout(() => {
        finishAndReveal(target);
      }, 800);
      return;
    }

    // Begin Waypoint Animation Sequence
    const TRAVEL_DURATION = 1800; // ms between waypoints
    const PAUSE_DURATION = 900; // ms dwell over each waypoint

    segmentStartTimeRef.current = performance.now();
    let isDwelling = true;
    let dwellStartTime = performance.now();

    const animate = (now) => {
      // Handle Pause State
      if (isPausedRef.current) {
        if (!pauseStartRef.current) {
          pauseStartRef.current = now;
        }
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      } else if (pauseStartRef.current) {
        totalPausedTimeRef.current += now - pauseStartRef.current;
        pauseStartRef.current = null;
      }

      const currentIdx = waypointIdxRef.current;
      const waypointsList = waypointsRef.current;

      if (currentIdx >= waypointsList.length - 1) {
        // Final destination reached
        finishAndReveal(waypointsList[waypointsList.length - 1]);
        return;
      }

      const fromWp = waypointsList[currentIdx];
      const toWp = waypointsList[currentIdx + 1];

      // Dwell Pause logic over current marker
      if (isDwelling) {
        const dwellElapsed = now - dwellStartTime;
        if (dwellElapsed >= PAUSE_DURATION) {
          isDwelling = false;
          segmentStartTimeRef.current = now;
          highlightMarker(fromWp.id, false); // clear highlight before moving
        } else {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }
      }

      // Moving interpolation between fromWp and toWp
      const elapsed = now - segmentStartTimeRef.current;
      const progress = Math.min(elapsed / TRAVEL_DURATION, 1.0);
      const easedProgress = easeInOutCubic(progress);

      const currentLat = fromWp.lat + (toWp.lat - fromWp.lat) * easedProgress;
      const currentLng = fromWp.lng + (toWp.lng - fromWp.lng) * easedProgress;

      updateLensPosition(currentLat, currentLng);
      setScanningStatus(`Scanning route toward ${toWp.name}...`);

      if (progress >= 1.0) {
        // Reached next waypoint
        waypointIdxRef.current = currentIdx + 1;
        setStepIndex(currentIdx + 2);
        setScanningStatus(`Scanning: ${toWp.name} (${toWp.locality})`);
        highlightMarker(toWp.id, true);

        isDwelling = true;
        dwellStartTime = performance.now();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [eligibleDiscoveries, clearAllHighlights, highlightMarker, updateLensPosition, finishAndReveal]);

  // 5. Skip scanning journey immediately to target reveal
  const handleSkipJourney = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const target = targetItemRef.current || eligibleDiscoveries[0];
    updateLensPosition(target.lat, target.lng);
    finishAndReveal(target);
  }, [eligibleDiscoveries, finishAndReveal, updateLensPosition]);

  // 6. Pause / Resume scanning journey
  const handleTogglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // 7. Experience the Story Handler
  const handleExperienceStory = useCallback(
    (discovery) => {
      // Find matching Story Mode record
      const match = STORIES_DATA.find(
        (s) =>
          s.id.toLowerCase() === discovery.name.toLowerCase() ||
          s.title.toLowerCase().includes(discovery.name.toLowerCase()) ||
          (discovery.name.includes('Vadakkumnathan') && s.id === 'architecture') ||
          (discovery.name.includes('Pooram') && s.id === 'pooram') ||
          (discovery.name.includes('Pulikali') && s.id === 'pulikali')
      );

      if (match) {
        onClose();
        if (onOpenStory) onOpenStory(match);
      } else {
        // If story is not in active video breakdown, display clearly labeled coming-soon notification
        setStoryNotice({
          discoveryName: discovery.name,
          message: `Archival Visual Story for ${discovery.name} is currently in active production. In the meantime, you can explore the full archival record or view the Thrissur Pooram story.`
        });
      }
    },
    [onClose, onOpenStory]
  );

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#FAF8F5] flex flex-col font-sans select-none overflow-hidden">
      {/* Top Experience Navigation Bar */}
      <header className="h-16 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#B8973D]/30 px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#5A1827] flex items-center justify-center text-[#B8973D] border border-[#B8973D]/50 shadow-sm">
            <SparklesIcon className="w-4 h-4 text-[#B8973D]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-xl font-bold tracking-wider text-[#5A1827]">RIVA</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D] bg-[#B8973D]/10 px-2 py-0.5 rounded-full border border-[#B8973D]/30">
                Magic Lens
              </span>
            </div>
            <p className="text-[10px] text-[#221E1F]/60 hidden sm:block">
              Look closer. Discover something unexpected.
            </p>
          </div>
        </div>

        {/* Action & Close Controls */}
        <div className="flex items-center space-x-3">
          {phase === 'scanning' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleTogglePause}
                className="inline-flex items-center space-x-1.5 bg-white hover:bg-[#FAF8F5] text-[#5A1827] border border-[#B8973D]/40 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                {isPaused ? <PlayIcon className="w-3.5 h-3.5" /> : <PauseIcon className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                onClick={handleSkipJourney}
                className="inline-flex items-center space-x-1.5 bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <SkipForwardIcon className="w-3.5 h-3.5" />
                <span>Skip to Reveal</span>
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#5A1827] text-[#5A1827] hover:text-[#FAF8F5] border border-[#B8973D]/40 flex items-center justify-center transition-all shadow-sm cursor-pointer"
            title="Exit Magic Lens"
            aria-label="Exit Magic Lens"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Map Viewport Area */}
      <div className="flex-1 relative w-full h-full overflow-hidden bg-[#FAF8F5]">
        {/* Base Leaflet Map */}
        <div ref={baseMapContainerRef} className="w-full h-full absolute inset-0" />

        {/* 3D Realistic Magnifying Glass Assembly */}
        {phase === 'scanning' && (
          <div
            ref={lensAssemblyRef}
            className="magic-lens-assembly -ml-[105px] -mt-[105px] sm:-ml-[105px] sm:-mt-[105px]"
            style={{
              left: 0,
              top: 0,
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            {/* Antique Gold Metallic Rim */}
            <div className="magic-lens-bezel">
              {/* Internal Glass Viewport */}
              <div className="magic-lens-glass">
                {/* Genuine Magnified Leaflet Map */}
                <div ref={lensMapContainerRef} className="magic-lens-inner-map" />

                {/* Specular Glare & Optical Reflection Arc */}
                <div className="magic-lens-reflection" />

                {/* Precision Reticle Crosshair */}
                <div className="magic-lens-reticle" />
                <div className="magic-lens-reticle-center" />
              </div>

              {/* Hand-Turned Rosewood & Brass Handle */}
              <div className="magic-lens-handle-wrapper">
                <div className="magic-lens-handle-ferrule" />
                <div className="magic-lens-handle-shaft" />
                <div className="magic-lens-handle-pommel" />
              </div>
            </div>
          </div>
        )}

        {/* Scanning HUD Banner */}
        {phase === 'scanning' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 max-w-lg w-[90%] bg-[#FAF8F5]/95 backdrop-blur-md border border-[#B8973D]/40 rounded-2xl p-3 shadow-xl text-center">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#B8973D] mb-1">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Kinetic Lens Active</span>
              </span>
              <span>
                Location {stepIndex} of {totalSteps}
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#5A1827] truncate">
              {scanningStatus}
            </h3>
            <div className="flex items-center justify-center space-x-2 mt-1 text-[11px] font-mono text-[#221E1F]/70">
              <CompassIcon className="w-3.5 h-3.5 text-[#B8973D]" />
              <span>{currentCoordinates}</span>
            </div>
          </div>
        )}

        {/* PHASE 1: Introduction & Mode Selection Dialog Overlay */}
        {phase === 'intro' && (
          <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <div className="bg-[#FAF8F5] border-2 border-[#B8973D]/50 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative text-left">
              {/* Header Badge */}
              <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-[#B8973D] mb-2">
                <SparklesIcon className="w-4 h-4 text-[#B8973D]" />
                <span>Signature Discovery Experience</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5A1827] leading-tight mb-2">
                Ready to discover something unexpected?
              </h2>

              <p className="text-xs sm:text-sm text-[#221E1F]/75 font-light leading-relaxed mb-6">
                Magic Lens is an automated cartographic journey. Watch the magnifying lens sweep across Thrissur&apos;s cultural map, scanning sacred architecture, folk dance routes, and master craft colonies before unlocking a serendipitous discovery.
              </p>

              {/* Mode Selection Tabs */}
              <div className="space-y-4 mb-6">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#5A1827] block">
                  Select Discovery Mode:
                </span>

                {/* Mode A: Total Surprise */}
                <div
                  onClick={() => setMode('surprise')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    mode === 'surprise'
                      ? 'bg-white border-[#5A1827] shadow-md ring-1 ring-[#5A1827]'
                      : 'bg-[#FAF8F5] border-[#B8973D]/30 hover:border-[#B8973D]'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="lensMode"
                      checked={mode === 'surprise'}
                      onChange={() => setMode('surprise')}
                      className="mt-1 accent-[#5A1827]"
                    />
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#5A1827]">
                        Mode A: Total Surprise
                      </h4>
                      <p className="text-xs text-[#221E1F]/70 mt-0.5 leading-relaxed">
                        Surrender to serendipity. The lens traverses all 15 heritage spaces, festivals, art forms, and craft lineages across the district.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mode B: My Preferences */}
                <div
                  onClick={() => setMode('preferences')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    mode === 'preferences'
                      ? 'bg-white border-[#5A1827] shadow-md ring-1 ring-[#5A1827]'
                      : 'bg-[#FAF8F5] border-[#B8973D]/30 hover:border-[#B8973D]'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="lensMode"
                      checked={mode === 'preferences'}
                      onChange={() => setMode('preferences')}
                      className="mt-1 accent-[#5A1827]"
                    />
                    <div className="flex-1">
                      <h4 className="font-serif text-lg font-bold text-[#5A1827]">
                        Mode B: My Preferences
                      </h4>
                      <p className="text-xs text-[#221E1F]/70 mt-0.5 leading-relaxed">
                        Calibrate the lens to search only within your chosen cultural categories.
                      </p>

                      {/* Preference Category Checkboxes */}
                      {mode === 'preferences' && (
                        <div className="mt-3 pt-3 border-t border-[#B8973D]/25 grid grid-cols-2 gap-2">
                          {[
                            { id: 'Heritage Space', label: 'Heritage Spaces (5)', icon: LandmarkIcon },
                            { id: 'Festival', label: 'Festivals (3)', icon: SparklesIcon },
                            { id: 'Art Form', label: 'Art Forms (3)', icon: PaletteIcon },
                            { id: 'Craft', label: 'Crafts (4)', icon: HammerIcon }
                          ].map((cat) => {
                            const isChecked = selectedCategories.includes(cat.id);
                            const IconComponent = cat.icon;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCategory(cat.id);
                                }}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                                  isChecked
                                    ? 'bg-[#5A1827] text-[#FAF8F5] border-[#5A1827]'
                                    : 'bg-white text-[#221E1F]/70 border-[#B8973D]/30 hover:border-[#B8973D]'
                                }`}
                              >
                                <IconComponent className={`w-3.5 h-3.5 ${isChecked ? 'text-[#D4B257]' : 'text-[#B8973D]'}`} />
                                <span className="truncate">{cat.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Warning */}
              {preferenceError && (
                <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium">
                  {preferenceError}
                </div>
              )}

              {/* Start Action */}
              <div className="flex items-center justify-between pt-2 border-t border-[#B8973D]/20">
                <button
                  onClick={onClose}
                  className="text-xs text-[#221E1F]/60 hover:text-[#5A1827] font-semibold underline cursor-pointer"
                >
                  Exit to Map
                </button>
                <button
                  onClick={startScanningJourney}
                  className="bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl active:scale-95 cursor-pointer inline-flex items-center space-x-2"
                >
                  <span>Start Exploring</span>
                  <span className="text-base">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3: Discovery Reveal Panel Overlay */}
        {phase === 'revealed' && targetDiscovery && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <div className="bg-[#FAF8F5] border-2 border-[#B8973D]/60 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden relative text-left">
              {/* Reveal Header Image */}
              <div className="relative h-48 sm:h-56 w-full bg-[#221E1F] overflow-hidden">
                <img
                  src={targetDiscovery.image}
                  alt={targetDiscovery.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/kerala-temple-woodcraft.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="bg-[#5A1827]/95 text-[#FAF8F5] text-xs uppercase font-bold px-3 py-1 rounded-full border border-[#B8973D]/50 shadow">
                    {targetDiscovery.category}
                  </span>
                  <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                    <ShieldCheckIcon className="w-3 h-3 text-emerald-400" />
                    <span>Unlocked by Magic Lens</span>
                  </span>
                </div>

                {/* Bottom Photo Title */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] text-[#D4B257] font-semibold uppercase tracking-wider block">
                    {targetDiscovery.era}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight drop-shadow">
                    {targetDiscovery.name}
                  </h3>
                </div>
              </div>

              {/* Reveal Content Body */}
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#221E1F]/70 mb-3 pb-3 border-b border-[#B8973D]/20">
                  <span className="flex items-center">
                    <MapPinIcon className="w-3.5 h-3.5 text-[#B8973D] mr-1" />
                    <span>{targetDiscovery.locality}</span>
                  </span>
                  <span className="font-mono text-[#5A1827] font-semibold">
                    {targetDiscovery.coordinates}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#221E1F]/80 leading-relaxed font-light mb-4">
                  {targetDiscovery.desc}
                </p>

                {/* Significance Highlight */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#B8973D]/30 mb-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8973D] block mb-1">
                    Cultural Significance
                  </span>
                  <p className="text-xs text-[#221E1F]/75 leading-relaxed font-light">
                    {targetDiscovery.significance}
                  </p>
                </div>

                {/* The 3 Actions Required by Phase 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Action 1: Explore More */}
                  <button
                    onClick={() => {
                      onClose();
                      onSelectDiscovery(targetDiscovery.id);
                    }}
                    className="bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer inline-flex items-center justify-center space-x-1"
                  >
                    <span>Explore More</span>
                    <span>&rarr;</span>
                  </button>

                  {/* Action 2: Experience the Story */}
                  <button
                    onClick={() => handleExperienceStory(targetDiscovery)}
                    className="bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer inline-flex items-center justify-center space-x-1"
                  >
                    <PlayIcon className="w-3 h-3 text-[#3F101B]" />
                    <span>Experience Story</span>
                  </button>

                  {/* Action 3: Try Again */}
                  <button
                    onClick={() => {
                      setPhase('intro');
                    }}
                    className="bg-white hover:bg-[#FAF8F5] text-[#5A1827] border border-[#B8973D]/50 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer inline-flex items-center justify-center space-x-1"
                  >
                    <RotateCcwIcon className="w-3 h-3 text-[#B8973D]" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coming Soon Notice Modal for stories not yet in video format */}
        {storyNotice && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FAF8F5] border-2 border-[#B8973D]/50 rounded-2xl p-6 max-w-md w-full shadow-2xl text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8973D]">
                Story Production Notice
              </span>
              <h4 className="font-serif text-xl font-bold text-[#5A1827] mt-1 mb-2">
                {storyNotice.discoveryName}
              </h4>
              <p className="text-xs text-[#221E1F]/75 leading-relaxed mb-4">
                {storyNotice.message}
              </p>
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => setStoryNotice(null)}
                  className="text-xs text-[#221E1F]/60 hover:text-[#5A1827] px-3 py-1.5 font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setStoryNotice(null);
                    onClose();
                    if (onOpenStory) onOpenStory(STORIES_DATA[0]);
                  }}
                  className="bg-[#B8973D] text-[#3F101B] hover:bg-[#D4B257] px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer"
                >
                  Watch Featured Story
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
