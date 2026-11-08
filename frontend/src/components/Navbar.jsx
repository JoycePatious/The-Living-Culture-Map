import { useState } from 'react';
import { FlameIcon, SearchIcon, MenuIcon, XIcon, ArrowLeftIcon } from './Icons';

export default function Navbar({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onNavigateHome,
  onNavigateMap,
  onNavigateMagicLens,
  onNavigateStories,
  onNavigatePreservation,
  isDetailPage,
  isMapView,
  isMagicLensView,
  isStoriesView,
  isPreservationView
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit();
    }
  };

  const handleLinkClick = (anchor) => {
    setMobileMenuOpen(false);
    if (anchor === 'map') {
      if (onNavigateMap) {
        onNavigateMap();
      } else {
        window.location.hash = '#map';
      }
      return;
    }
    if (anchor === 'magic-lens') {
      if (onNavigateMagicLens) {
        onNavigateMagicLens();
      } else {
        window.location.hash = '#magic-lens';
      }
      return;
    }
    if (anchor === 'story-mode' || anchor === 'stories') {
      if (onNavigateStories) {
        onNavigateStories();
      } else {
        window.location.hash = '#stories';
      }
      return;
    }
    if (anchor === 'preservation' || anchor === 'community') {
      if (onNavigatePreservation) {
        onNavigatePreservation();
      } else {
        window.location.hash = '#preservation';
      }
      return;
    }
    if (onNavigateHome) {
      onNavigateHome(anchor);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#B8973D]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick();
          }}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#5A1827] flex items-center justify-center text-[#B8973D] border border-[#B8973D]/40 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <FlameIcon className="w-5 h-5 text-[#B8973D]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-wider text-[#5A1827]">RIVA</span>
            <span className="text-[10px] uppercase tracking-widest text-[#B8973D] font-semibold">Living Culture Map</span>
          </div>
        </a>

        {/* Live Search Input (Desktop) */}
        <div className="hidden md:flex items-center relative w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search art, shrines, craft..."
            className="w-full bg-white border border-[#B8973D]/30 rounded-full py-2 pl-10 pr-4 text-xs text-[#221E1F] placeholder-[#221E1F]/40 focus:outline-none focus:border-[#5A1827] transition-all shadow-inner"
          />
          <span className="absolute left-3.5 top-2.5 text-[#B8973D]">
            <SearchIcon className="w-4 h-4" />
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-[#221E1F]/80">
          <a
            href="#categories"
            onClick={() => handleLinkClick('categories')}
            className="hover:text-[#5A1827] transition-colors"
          >
            Categories
          </a>
          <a
            href="#magic-lens"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('magic-lens');
            }}
            className={`hover:text-[#5A1827] transition-colors flex items-center space-x-1 ${
              isMagicLensView ? 'font-semibold text-[#5A1827] border-b-2 border-[#5A1827] pb-0.5' : ''
            }`}
          >
            <span>Magic Lens</span>
            <span className="text-[10px] bg-[#B8973D]/20 text-[#5A1827] px-1.5 py-0.2 rounded font-bold">Signature</span>
          </a>
          <a
            href="#discoveries"
            onClick={() => handleLinkClick('discoveries')}
            className={`hover:text-[#5A1827] transition-colors ${
              !isMapView && !isDetailPage && !isStoriesView && !isPreservationView ? 'font-semibold text-[#5A1827]' : ''
            }`}
          >
            Discoveries (15)
          </a>
          <a
            href="#map"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('map');
            }}
            className={`hover:text-[#5A1827] transition-colors flex items-center space-x-1 ${
              isMapView ? 'font-semibold text-[#5A1827] border-b-2 border-[#5A1827] pb-0.5' : ''
            }`}
          >
            <span>Cultural Map</span>
            <span className="text-[10px] bg-[#B8973D]/20 text-[#5A1827] px-1.5 py-0.2 rounded font-bold">New</span>
          </a>
          <a
            href="#stories"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('stories');
            }}
            className={`hover:text-[#5A1827] transition-colors flex items-center space-x-1 ${
              isStoriesView ? 'font-semibold text-[#5A1827] border-b-2 border-[#5A1827] pb-0.5' : ''
            }`}
          >
            <span>Story Mode</span>
            <span className="text-[10px] bg-[#B8973D]/20 text-[#5A1827] px-1.5 py-0.2 rounded font-bold">3 Stories</span>
          </a>
          <a
            href="#preservation"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('preservation');
            }}
            className={`hover:text-[#5A1827] transition-colors flex items-center space-x-1 ${
              isPreservationView ? 'font-semibold text-[#5A1827] border-b-2 border-[#5A1827] pb-0.5' : ''
            }`}
          >
            <span>Preservation</span>
            <span className="text-[10px] bg-[#B8973D]/20 text-[#5A1827] px-1.5 py-0.2 rounded font-bold">Community</span>
          </a>
        </nav>

        {/* Action Button & Mobile Hamburger */}
        <div className="flex items-center space-x-3">
          {isDetailPage || isMapView || isStoriesView || isPreservationView ? (
            <button
              onClick={() => handleLinkClick('discoveries')}
              className="bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>{isPreservationView ? 'Return to Discoveries' : isStoriesView ? 'Return to Discoveries' : isMapView ? 'Return to Discoveries' : 'Back to Discoveries'}</span>
            </button>
          ) : (
            <a
              href="#map"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('map');
              }}
              className="bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Cultural Map
            </a>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#5A1827] hover:bg-[#5A1827]/10 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#B8973D]/20 px-6 py-4 shadow-xl space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search art, shrines, craft..."
              className="w-full bg-white border border-[#B8973D]/30 rounded-full py-2.5 pl-10 pr-4 text-xs text-[#221E1F] placeholder-[#221E1F]/40 focus:outline-none focus:border-[#5A1827]"
            />
            <span className="absolute left-3.5 top-3 text-[#B8973D]">
              <SearchIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="flex flex-col space-y-3 text-sm font-medium text-[#221E1F]/80 pt-2">
            <a
              href="#categories"
              onClick={() => handleLinkClick('categories')}
              className="hover:text-[#5A1827] transition-colors py-1"
            >
              Categories
            </a>
            <a
              href="#magic-lens"
              onClick={() => handleLinkClick('magic-lens')}
              className="hover:text-[#5A1827] transition-colors py-1"
            >
              Magic Lens
            </a>
            <a
              href="#discoveries"
              onClick={() => handleLinkClick('discoveries')}
              className="hover:text-[#5A1827] transition-colors py-1 font-semibold text-[#5A1827]"
            >
              Discoveries (15 Verified)
            </a>
            <a
              href="#map"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('map');
              }}
              className="hover:text-[#5A1827] transition-colors py-1 flex items-center justify-between font-semibold text-[#5A1827]"
            >
              <span>Cultural Map (Interactive)</span>
              <span className="text-[10px] bg-[#B8973D]/20 text-[#5A1827] px-2 py-0.5 rounded font-bold">New</span>
            </a>
            <a
              href="#stories"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('stories');
              }}
              className={`hover:text-[#5A1827] transition-colors py-1 flex items-center justify-between ${
                isStoriesView ? 'font-bold text-[#5A1827]' : ''
              }`}
            >
              <span>Story Mode</span>
              <span className="text-[10px] bg-[#B8973D]/20 text-[#5A1827] px-2 py-0.5 rounded font-bold">3 Stories</span>
            </a>
            <a
              href="#preservation"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('preservation');
              }}
              className={`hover:text-[#5A1827] transition-colors py-1 flex items-center justify-between ${
                isPreservationView ? 'font-bold text-[#5A1827]' : ''
              }`}
            >
              <span>Community Preservation</span>
              <span className="text-[10px] bg-[#B8973D]/20 text-[#5A1827] px-2 py-0.5 rounded font-bold">Share Story</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
