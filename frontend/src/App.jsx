
import { useState, useMemo, useEffect, useCallback } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CulturalCategories from './components/CulturalCategories';
import MagicLensSection from './components/MagicLensSection';
import FeaturedDiscoveries from './components/FeaturedDiscoveries';
import DiscoveryDetailPage from './components/DiscoveryDetailPage';
import CulturalMapPage from './components/CulturalMapPage';
import MagicLensExperience from './components/MagicLensExperience';
import StoryModeSection from './components/StoryModeSection';
import StoryModePage from './components/StoryModePage';
import CinematicStoryPlayer from './components/CinematicStoryPlayer';
import CommunityPreservation from './components/CommunityPreservation';
import CommunityPreservationPage from './components/CommunityPreservationPage';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

import {
  DISCOVERIES_DATA,
  getDiscoveryById,
  getStoryById
} from './data/discoveries';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Discovery Detail Page State
  const [selectedDiscoveryId, setSelectedDiscoveryId] = useState(null);

  // Cultural Map Page State
  const [isMapView, setIsMapView] = useState(false);
  const [initialMapDiscoveryId, setInitialMapDiscoveryId] = useState(null);

  // Story Mode Page & Player State
  const [isStoriesView, setIsStoriesView] = useState(false);
  const [activeStory, setActiveStory] = useState(null);

  // Community Preservation Page State
  const [isPreservationView, setIsPreservationView] = useState(false);

  // Admin Dashboard State
  const [isAdminView, setIsAdminView] = useState(
    window.location.hash === '#admin'
  );

  // Magic Lens Experience State
  const [isMagicLensOpen, setIsMagicLensOpen] = useState(false);
  const [magicLensMode, setMagicLensMode] = useState('surprise');

  // Sync all page states with URL hash
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;

      // 1. Admin Dashboard
      if (hash === '#admin') {
        setIsAdminView(true);
        setSelectedDiscoveryId(null);
        setIsMapView(false);
        setIsMagicLensOpen(false);
        setIsStoriesView(false);
        setIsPreservationView(false);
        setActiveStory(null);
        return;
      }

      setIsAdminView(false);

      // 2. Individual Story Experience
      const storyMatch = hash.match(/^#story-([a-zA-Z0-9_-]+)$/);

      if (storyMatch && storyMatch[1] !== 'mode') {
        const storyKey = storyMatch[1];
        const story = getStoryById(storyKey);

        if (story) {
          setActiveStory(story);
          return;
        }
      }

      // 3. Story Mode Landing Page
      if (hash === '#stories' || hash === '#story-mode') {
        setSelectedDiscoveryId(null);
        setIsMapView(false);
        setIsMagicLensOpen(false);
        setIsStoriesView(true);
        setIsPreservationView(false);
        setActiveStory(null);
        return;
      }

      // 4. Community Preservation Page
      if (hash === '#preservation' || hash === '#community') {
        setSelectedDiscoveryId(null);
        setIsMapView(false);
        setIsMagicLensOpen(false);
        setIsStoriesView(false);
        setIsPreservationView(true);
        setActiveStory(null);
        return;
      }

      // 5. Discovery Detail Page
      const discoveryMatch = hash.match(/^#discovery-(\d+)$/);

      if (discoveryMatch) {
        const id = parseInt(discoveryMatch[1], 10);

        if (DISCOVERIES_DATA.some((d) => d.id === id)) {
          setSelectedDiscoveryId(id);
          setIsMapView(false);
          setIsMagicLensOpen(false);
          setIsStoriesView(false);
          setIsPreservationView(false);
          setActiveStory(null);
          return;
        }
      }

      // 6. Cultural Map
      const mapMatch = hash.match(/^#map(?:-(\d+))?$/);

      if (mapMatch) {
        setSelectedDiscoveryId(null);
        setIsMapView(true);
        setIsMagicLensOpen(false);
        setIsStoriesView(false);
        setIsPreservationView(false);
        setActiveStory(null);

        if (mapMatch[1]) {
          const id = parseInt(mapMatch[1], 10);
          setInitialMapDiscoveryId(id);
        } else {
          setInitialMapDiscoveryId(null);
        }

        return;
      }

      // 7. Magic Lens
      if (hash === '#magic-lens' || hash === '#lens') {
        setSelectedDiscoveryId(null);
        setIsMapView(false);
        setIsMagicLensOpen(true);
        setIsStoriesView(false);
        setIsPreservationView(false);
        setActiveStory(null);
        return;
      }

      // 8. Homepage / Other Anchors
      if (
        !hash.startsWith('#discovery-') &&
        !hash.startsWith('#map') &&
        !hash.startsWith('#magic-lens') &&
        !hash.startsWith('#lens') &&
        !hash.startsWith('#story-') &&
        hash !== '#stories' &&
        hash !== '#story-mode' &&
        hash !== '#preservation' &&
        hash !== '#community' &&
        hash !== '#admin'
      ) {
        setSelectedDiscoveryId(null);
        setIsMapView(false);
        setIsMagicLensOpen(false);
        setIsStoriesView(false);
        setIsPreservationView(false);
        setActiveStory(null);
      }
    };

    parseHash();

    window.addEventListener('hashchange', parseHash);

    return () => {
      window.removeEventListener('hashchange', parseHash);
    };
  }, []);

  // Filtered Discoveries
  const filteredDiscoveries = useMemo(() => {
    return DISCOVERIES_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        item.category === selectedCategory;

      const query = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.locality.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.era.toLowerCase().includes(query) ||
        (item.story && item.story.toLowerCase().includes(query)) ||
        (item.significance &&
          item.significance.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  // Open Discovery Detail Page
  const handleOpenDiscovery = useCallback((discoveryOrId) => {
    const id =
      typeof discoveryOrId === 'object'
        ? discoveryOrId.id
        : discoveryOrId;

    setSelectedDiscoveryId(id);
    setIsMapView(false);
    setIsStoriesView(false);
    setIsPreservationView(false);
    setIsMagicLensOpen(false);
    setActiveStory(null);

    window.location.hash = `#discovery-${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Open Cultural Map
  const handleOpenMap = useCallback((id = null) => {
    setSelectedDiscoveryId(null);
    setIsMapView(true);
    setIsStoriesView(false);
    setIsPreservationView(false);
    setIsMagicLensOpen(false);
    setActiveStory(null);
    setInitialMapDiscoveryId(id);

    window.location.hash = id ? `#map-${id}` : '#map';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Open Story Mode Page
  const handleOpenStoriesPage = useCallback(() => {
    setSelectedDiscoveryId(null);
    setIsMapView(false);
    setIsStoriesView(true);
    setIsPreservationView(false);
    setIsMagicLensOpen(false);
    setActiveStory(null);

    window.location.hash = '#stories';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Open Community Preservation Page
  const handleOpenPreservationPage = useCallback(() => {
    setSelectedDiscoveryId(null);
    setIsMapView(false);
    setIsStoriesView(false);
    setIsPreservationView(true);
    setIsMagicLensOpen(false);
    setActiveStory(null);

    window.location.hash = '#preservation';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Open Cinematic Story
  const handleOpenStory = useCallback((storyOrId) => {
    const story =
      typeof storyOrId === 'object'
        ? storyOrId
        : getStoryById(storyOrId);

    if (story) {
      setActiveStory(story);

      const slug =
        story.id === 'architecture'
          ? 'vadakkumnathan'
          : story.id;

      window.location.hash = `#story-${slug}`;
    }
  }, []);

  // Close Cinematic Story
  const handleCloseStory = useCallback(() => {
    setActiveStory(null);

    if (window.location.hash.startsWith('#story-')) {
      if (isStoriesView) {
        window.location.hash = '#stories';
      } else if (isPreservationView) {
        window.location.hash = '#preservation';
      } else if (selectedDiscoveryId) {
        window.location.hash = `#discovery-${selectedDiscoveryId}`;
      } else {
        window.location.hash = '';
      }
    }
  }, [isStoriesView, isPreservationView, selectedDiscoveryId]);

  // Open Magic Lens
  const handleOpenMagicLens = useCallback((mode = 'surprise') => {
    setSelectedDiscoveryId(null);
    setMagicLensMode(mode);
    setIsMagicLensOpen(true);

    window.location.hash = '#magic-lens';
  }, []);

  // Close Magic Lens
  const handleCloseMagicLens = useCallback(() => {
    setIsMagicLensOpen(false);

    if (
      window.location.hash === '#magic-lens' ||
      window.location.hash === '#lens'
    ) {
      window.location.hash = '';
    }
  }, []);

  // Return to Discoveries
  const handleBackToDiscoveries = useCallback((anchor = 'discoveries') => {
    setSelectedDiscoveryId(null);
    setIsMapView(false);
    setIsStoriesView(false);
    setIsPreservationView(false);
    setIsMagicLensOpen(false);
    setActiveStory(null);

    window.location.hash = `#${anchor}`;

    setTimeout(() => {
      const el = document.getElementById(anchor);

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  }, []);

  // Search Submit
  const handleSearchSubmit = useCallback(() => {
    setSelectedDiscoveryId(null);
    setIsMapView(false);
    setIsStoriesView(false);
    setIsPreservationView(false);
    setIsMagicLensOpen(false);
    setActiveStory(null);

    const el = document.getElementById('discoveries');

    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Active Discovery Object
  const activeDiscovery = useMemo(() => {
    if (!selectedDiscoveryId) return null;

    return getDiscoveryById(selectedDiscoveryId);
  }, [selectedDiscoveryId]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#221E1F] flex flex-col font-sans selection:bg-[#B8973D]/20 selection:text-[#5A1827]">

      {/* Navigation Bar */}
      {!isAdminView && (
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          onNavigateHome={handleBackToDiscoveries}
          onNavigateMap={handleOpenMap}
          onNavigateMagicLens={handleOpenMagicLens}
          onNavigateStories={handleOpenStoriesPage}
          onNavigatePreservation={handleOpenPreservationPage}
          isDetailPage={Boolean(activeDiscovery)}
          isMapView={isMapView}
          isMagicLensView={isMagicLensOpen}
          isStoriesView={isStoriesView}
          isPreservationView={isPreservationView}
        />
      )}

      <main className="flex-1">

        {/* Admin Dashboard */}
        {isAdminView ? (
          <AdminDashboard
            onExit={() => {
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

        ) : activeDiscovery ? (

          <DiscoveryDetailPage
            discovery={activeDiscovery}
            onBack={handleBackToDiscoveries}
            onSelectDiscovery={handleOpenDiscovery}
            onOpenMap={handleOpenMap}
            onOpenStory={handleOpenStory}
            onNavigateStories={handleOpenStoriesPage}
            onNavigatePreservation={handleOpenPreservationPage}
          />

        ) : isMapView ? (

          <CulturalMapPage
            onSelectDiscovery={handleOpenDiscovery}
            onNavigateHome={handleBackToDiscoveries}
            onLaunchMagicLens={handleOpenMagicLens}
            initialDiscoveryId={initialMapDiscoveryId}
          />

        ) : isStoriesView ? (

          <StoryModePage
            onOpenStory={handleOpenStory}
            onSelectDiscovery={handleOpenDiscovery}
            onNavigateHome={handleBackToDiscoveries}
            onNavigateMap={handleOpenMap}
          />

        ) : isPreservationView ? (

          <CommunityPreservationPage
            onNavigateHome={handleBackToDiscoveries}
            onNavigateMap={handleOpenMap}
            onNavigateStories={handleOpenStoriesPage}
          />

        ) : (

          <>
            {/* Homepage Hero */}
            <Hero
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearchSubmit={handleSearchSubmit}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Cultural Categories */}
            <CulturalCategories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Magic Lens Section */}
            <MagicLensSection
              onSelectDiscovery={handleOpenDiscovery}
              onLaunchMagicLens={handleOpenMagicLens}
            />

            {/* Featured Discoveries */}
            <FeaturedDiscoveries
              discoveries={filteredDiscoveries}
              allCount={DISCOVERIES_DATA.length}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onOpenDetails={handleOpenDiscovery}
              onOpenMap={handleOpenMap}
              onOpenStory={handleOpenStory}
            />

            {/* Story Mode Introduction */}
            <StoryModeSection
              onOpenStory={handleOpenStory}
              onNavigateStories={handleOpenStoriesPage}
            />

            {/* Community Preservation */}
            <CommunityPreservation
              onOpenContribute={handleOpenPreservationPage}
            />
          </>
        )}
      </main>

      {/* Full Magic Lens Experience */}
      {isMagicLensOpen && !isAdminView && (
        <MagicLensExperience
          onClose={handleCloseMagicLens}
          onSelectDiscovery={handleOpenDiscovery}
          onOpenStory={handleOpenStory}
          initialMode={magicLensMode}
        />
      )}

      {/* Cinematic Story Player */}
      {activeStory && !isAdminView && (
        <CinematicStoryPlayer
          key={activeStory.id}
          story={activeStory}
          onClose={handleCloseStory}
          onSelectDiscovery={handleOpenDiscovery}
          onSelectStory={handleOpenStory}
        />
      )}

      {/* Archival Footer */}
      {!isAdminView && (
        <Footer
          onNavigateHome={handleBackToDiscoveries}
          onNavigateMap={handleOpenMap}
          onNavigateMagicLens={handleOpenMagicLens}
          onNavigateStories={handleOpenStoriesPage}
          onNavigatePreservation={handleOpenPreservationPage}
        />
      )}
    </div>
  );
}
