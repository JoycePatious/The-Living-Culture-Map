import { useEffect } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MapPinIcon,
  CompassIcon,
  ShieldCheckIcon,
  ExternalLinkIcon,
  LandmarkIcon,
  SparklesIcon,
  PaletteIcon,
  HammerIcon,
  PlayIcon,
  FeatherIcon
} from './Icons';
import { getNextDiscovery, getPrevDiscovery, DISCOVERIES_DATA, STORIES_DATA } from '../data/discoveries';

export default function DiscoveryDetailPage({
  discovery,
  onBack,
  onSelectDiscovery,
  onOpenMap,
  onOpenStory,
  onNavigateStories,
  onNavigatePreservation
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [discovery, onBack]);

  if (!discovery) return null;

  const prevDiscovery = getPrevDiscovery(discovery.id);
  const nextDiscovery = getNextDiscovery(discovery.id);
  const matchingStory = STORIES_DATA.find((s) => s.discoveryId === discovery.id);

  // Category Icon Resolver
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Heritage Space':
        return <LandmarkIcon className="w-5 h-5 text-[#B8973D]" />;
      case 'Festival':
        return <SparklesIcon className="w-5 h-5 text-[#B8973D]" />;
      case 'Art Form':
        return <PaletteIcon className="w-5 h-5 text-[#B8973D]" />;
      case 'Craft':
        return <HammerIcon className="w-5 h-5 text-[#B8973D]" />;
      default:
        return <CompassIcon className="w-5 h-5 text-[#B8973D]" />;
    }
  };

  // Related discoveries from same category (excluding current)
  const relatedDiscoveries = DISCOVERIES_DATA.filter(
    (item) => item.category === discovery.category && item.id !== discovery.id
  ).slice(0, 3);

  return (
    <article className="min-h-screen bg-[#FAF8F5] text-[#221E1F] pt-28 pb-24 selection:bg-[#B8973D]/20 selection:text-[#5A1827]">
      {/* 1. Sticky Navigation & Breadcrumbs Bar */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#B8973D]/25">
          {/* Back Button & Map Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onBack}
              className="group inline-flex items-center space-x-2 bg-white hover:bg-[#5A1827] text-[#5A1827] hover:text-[#FAF8F5] border border-[#B8973D]/40 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
            >
              <ArrowLeftIcon className="w-4 h-4 text-[#B8973D] group-hover:text-[#FAF8F5] transition-colors" />
              <span>Return to Discoveries</span>
            </button>
            {onOpenMap && (
              <button
                onClick={() => onOpenMap(discovery.id)}
                className="inline-flex items-center space-x-1.5 bg-[#FAF8F5] hover:bg-[#B8973D]/15 text-[#3F101B] border border-[#B8973D]/40 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
                title="Locate on Interactive Cultural Map"
              >
                <MapPinIcon className="w-3.5 h-3.5 text-[#B8973D]" />
                <span>View on Cultural Map</span>
              </button>
            )}
            {matchingStory && onOpenStory && (
              <button
                onClick={() => onOpenStory(matchingStory)}
                className="inline-flex items-center space-x-1.5 bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
                title="Launch Cinematic Story Experience"
              >
                <PlayIcon className="w-3.5 h-3.5 text-[#3F101B]" />
                <span>Experience Story</span>
              </button>
            )}
            {onNavigatePreservation && (
              <button
                onClick={onNavigatePreservation}
                className="inline-flex items-center space-x-1.5 bg-[#FAF8F5] hover:bg-[#5A1827]/10 text-[#5A1827] border border-[#B8973D]/40 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
                title="Contribute knowledge or memories to the living archive"
              >
                <FeatherIcon className="w-3.5 h-3.5 text-[#B8973D]" />
                <span>Share Story</span>
              </button>
            )}
          </div>

          {/* Breadcrumb Hierarchy */}
          <nav className="text-xs text-[#221E1F]/60 flex items-center space-x-1.5 flex-wrap">
            <button
              onClick={onBack}
              className="hover:text-[#5A1827] font-semibold underline underline-offset-2 cursor-pointer"
            >
              Discoveries
            </button>
            <span>/</span>
            <span className="text-[#B8973D] font-semibold">{discovery.category}</span>
            <span>/</span>
            <span className="text-[#5A1827] font-bold truncate max-w-[200px]">{discovery.name}</span>
          </nav>

          {/* Prev / Next Quick Controls */}
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => onSelectDiscovery(prevDiscovery.id)}
              title={`Previous: ${prevDiscovery.name}`}
              className="p-2 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#B8973D]/30 text-[#5A1827] transition-colors shadow-sm cursor-pointer"
              aria-label="Previous Discovery"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] text-[#B8973D] font-bold px-2">
              #{discovery.id < 10 ? '0' + discovery.id : discovery.id} of 15
            </span>
            <button
              onClick={() => onSelectDiscovery(nextDiscovery.id)}
              title={`Next: ${nextDiscovery.name}`}
              className="p-2 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#B8973D]/30 text-[#5A1827] transition-colors shadow-sm cursor-pointer"
              aria-label="Next Discovery"
            >
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Card Container */}
        <div className="bg-white rounded-3xl border-2 border-[#B8973D]/35 shadow-xl overflow-hidden mb-12">
          {/* Large Relevant Photograph Banner */}
          <div className="relative w-full h-80 sm:h-96 md:h-[460px] bg-[#FAF8F5] overflow-hidden">
            <img
              src={discovery.image}
              alt={discovery.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/kerala-temple-woodcraft.jpg';
              }}
              className="w-full h-full object-cover object-center"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Top Overlay Badges */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <span className="bg-[#5A1827]/90 text-[#FAF8F5] text-xs uppercase font-bold px-3.5 py-1 rounded-full border border-[#B8973D]/40 shadow-sm backdrop-blur-md">
                  {discovery.category}
                </span>
                <span className="text-xs font-mono font-bold text-[#FAF8F5] bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  ID #{discovery.id < 10 ? '0' + discovery.id : discovery.id}
                </span>
              </div>

              <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-400/40 px-3 py-1 rounded-full backdrop-blur-md">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Historical Record</span>
              </span>
            </div>

            {/* Bottom Hero Overlay Information */}
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="inline-block text-xs uppercase tracking-widest text-[#D4B257] font-bold mb-1">
                Historical Period / Origin: {discovery.era}
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-md leading-tight mb-2">
                {discovery.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/90">
                <span className="flex items-center">
                  <MapPinIcon className="w-4 h-4 text-[#D4B257] mr-1.5 shrink-0" />
                  <span>{discovery.locality}</span>
                </span>
                <span className="flex items-center font-mono text-[#D4B257]">
                  <CompassIcon className="w-4 h-4 mr-1.5 shrink-0" />
                  <span>{discovery.coordinates}</span>
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded text-[11px] font-medium">
                  Format: {discovery.story}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Attribution Banner */}
          <div className="bg-[#221E1F] text-white/80 px-6 py-2.5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-[#B8973D]/30">
            <span className="text-[11px] truncate">
              Photo: <strong className="text-white">{discovery.photographer}</strong> • Source: {discovery.sourceName} • Licence: <span className="text-[#D4B257]">{discovery.license}</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4B257] bg-white/10 px-2 py-0.5 rounded">
              Authentic Kerala Cultural Photography
            </span>
          </div>

          {/* Detailed Content Body */}
          <div className="p-6 sm:p-10 space-y-10">
            {/* Quick Facts 4-Card Metric Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#B8973D]/25">
                <div className="flex items-center space-x-2 text-[#B8973D] mb-1">
                  {getCategoryIcon(discovery.category)}
                  <span className="text-[10px] uppercase font-bold tracking-wider">Domain</span>
                </div>
                <span className="text-sm font-bold text-[#5A1827] block truncate">
                  {discovery.category}
                </span>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#B8973D]/25">
                <div className="flex items-center space-x-2 text-[#B8973D] mb-1">
                  <LandmarkIcon className="w-5 h-5 text-[#B8973D]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Era / Origin</span>
                </div>
                <span className="text-sm font-bold text-[#5A1827] block truncate">
                  {discovery.era}
                </span>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#B8973D]/25">
                <div className="flex items-center space-x-2 text-[#B8973D] mb-1">
                  <CompassIcon className="w-5 h-5 text-[#B8973D]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Coordinates</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#5A1827] block truncate">
                  {discovery.coordinates}
                </span>
                {onOpenMap && (
                  <button
                    onClick={() => onOpenMap(discovery.id)}
                    className="mt-1 text-[11px] font-bold text-[#B8973D] hover:text-[#5A1827] underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Locate on Cultural Map &rarr;</span>
                  </button>
                )}
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#B8973D]/25">
                <div className="flex items-center space-x-2 text-[#B8973D] mb-1">
                  <PlayIcon className="w-4 h-4 text-[#B8973D]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Story Format</span>
                </div>
                <span className="text-sm font-bold text-[#5A1827] block truncate">
                  {discovery.story}
                </span>
              </div>
            </div>

            {/* Story Mode Connection Section (Phase 5) */}
            {matchingStory ? (
              <div className="bg-gradient-to-r from-[#5A1827] via-[#4A1521] to-[#3F101B] rounded-3xl p-6 sm:p-8 text-[#FAF8F5] border-2 border-[#B8973D]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#B8973D]/15 blur-2xl pointer-events-none" />
                <div className="relative z-10 max-w-xl">
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-[#B8973D] mb-2">
                    <SparklesIcon className="w-4 h-4 text-[#B8973D]" />
                    <span>Featured Story Mode Experience</span>
                    <span>•</span>
                    <span>{matchingStory.duration}</span>
                    <span>•</span>
                    <span>{matchingStory.scenesCount} Scenes</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF8F5] mb-2">
                    {matchingStory.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAF8F5]/80 font-light leading-relaxed mb-4">
                    {matchingStory.description}
                  </p>
                  <div className="flex items-center space-x-2 text-[11px] text-[#D4B257] font-semibold">
                    <span>Scene breakdown:</span>
                    <span className="text-[#FAF8F5]/70">
                      {matchingStory.scenes.map((s) => s.title).join(' • ')}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
                  <button
                    onClick={() => onOpenStory(matchingStory)}
                    className="bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center justify-center space-x-2 border border-white/40"
                  >
                    <PlayIcon className="w-4 h-4 text-[#3F101B]" />
                    <span>Launch Story ({matchingStory.duration})</span>
                  </button>
                  {onNavigateStories && (
                    <button
                      onClick={onNavigateStories}
                      className="text-xs text-[#FAF8F5]/75 hover:text-white underline text-center cursor-pointer transition-colors"
                    >
                      Browse all 3 featured stories &rarr;
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#FAF8F5] rounded-3xl p-6 border-2 border-[#B8973D]/25 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#5A1827]/10 border border-[#5A1827]/20 flex items-center justify-center text-[#5A1827] shrink-0">
                    <SparklesIcon className="w-6 h-6 text-[#B8973D]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-serif text-lg font-bold text-[#5A1827]">
                        Story Mode In Production
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-xs text-[#221E1F]/70 font-light mt-1">
                      Time-coded cinematic scene breakdowns for <strong>{discovery.name}</strong> are currently in active field production.
                    </p>
                  </div>
                </div>
                {onNavigateStories && (
                  <button
                    onClick={onNavigateStories}
                    className="text-xs font-bold text-[#5A1827] hover:text-[#7A2236] bg-white hover:bg-[#FAF8F5] border border-[#B8973D]/40 px-5 py-2.5 rounded-full uppercase tracking-wider transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    Explore 3 Featured Stories &rarr;
                  </button>
                )}
              </div>
            )}

            {/* Description & Significance Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Archival Description */}
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#B8973D]/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B8973D]" />
                    <h2 className="text-xs uppercase tracking-widest text-[#B8973D] font-bold">
                      Archival Description
                    </h2>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#5A1827] mb-3">
                    Heritage Summary
                  </h3>
                  <p className="text-sm md:text-base text-[#221E1F]/80 leading-relaxed font-light">
                    {discovery.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#B8973D]/15 text-xs text-[#221E1F]/60 flex items-center">
                  <MapPinIcon className="w-3.5 h-3.5 text-[#B8973D] mr-1 shrink-0" />
                  <span>Documented locality: <strong>{discovery.locality}</strong></span>
                </div>
              </div>

              {/* Cultural Significance */}
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#B8973D]/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5A1827]" />
                    <h2 className="text-xs uppercase tracking-widest text-[#B8973D] font-bold">
                      Cultural Significance
                    </h2>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#5A1827] mb-3">
                    Historical & Community Value
                  </h3>
                  <p className="text-sm md:text-base text-[#221E1F]/80 leading-relaxed font-light">
                    {discovery.significance}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#B8973D]/15 text-xs text-[#221E1F]/60 flex items-center">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-700 mr-1 shrink-0" />
                  <span>Preservation status: <strong>High Archival Confidence</strong></span>
                </div>
              </div>
            </div>

            {/* 3. Comprehensive Sources & Licensing Credits Section */}
            <div className="rounded-2xl bg-[#FAF8F5] border-2 border-[#B8973D]/30 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-[#B8973D]/20">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#B8973D] font-bold block mb-1">
                    Compliance & Transparency
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#5A1827]">
                    Photograph Sources & Licensing Credits
                  </h3>
                </div>
                <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-3 py-1 rounded-full self-start sm:self-auto">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-700" />
                  <span>{discovery.verificationStatus || 'Cleared for Use with Attribution'}</span>
                </span>
              </div>

              {/* 4-Item Credits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
                {/* 1. Photograph */}
                <div className="bg-white p-3.5 rounded-xl border border-[#B8973D]/20">
                  <span className="text-[10px] uppercase tracking-wider text-[#B8973D] font-bold block mb-1">
                    Photograph File
                  </span>
                  <span className="font-mono text-xs text-[#221E1F] font-semibold block truncate">
                    {discovery.photoFile || discovery.image.replace('/discoveries/', '')}
                  </span>
                  <span className="text-[10px] text-[#221E1F]/50 block mt-1">Verified archival asset</span>
                </div>

                {/* 2. Creator */}
                <div className="bg-white p-3.5 rounded-xl border border-[#B8973D]/20">
                  <span className="text-[10px] uppercase tracking-wider text-[#B8973D] font-bold block mb-1">
                    Photographer / Creator
                  </span>
                  <span className="font-bold text-[#5A1827] text-xs block truncate">
                    {discovery.photographer}
                  </span>
                  <span className="text-[10px] text-[#221E1F]/50 block mt-1">Attribution verified</span>
                </div>

                {/* 3. Original Source */}
                <div className="bg-white p-3.5 rounded-xl border border-[#B8973D]/20">
                  <span className="text-[10px] uppercase tracking-wider text-[#B8973D] font-bold block mb-1">
                    Original Source
                  </span>
                  <a
                    href={discovery.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-[#5A1827] hover:text-[#B8973D] font-bold underline underline-offset-2 transition-colors truncate max-w-full"
                  >
                    <span className="truncate">{discovery.sourceName}</span>
                    <ExternalLinkIcon className="w-3.5 h-3.5 text-[#B8973D] shrink-0" />
                  </a>
                  <span className="text-[10px] text-[#221E1F]/50 block mt-1">Public cultural archive</span>
                </div>

                {/* 4. Licence */}
                <div className="bg-white p-3.5 rounded-xl border border-[#B8973D]/20">
                  <span className="text-[10px] uppercase tracking-wider text-[#B8973D] font-bold block mb-1">
                    Licence Name
                  </span>
                  <a
                    href={discovery.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-[#5A1827] hover:text-[#B8973D] font-bold underline underline-offset-2 transition-colors"
                  >
                    <span>{discovery.license}</span>
                    <ExternalLinkIcon className="w-3.5 h-3.5 text-[#B8973D] shrink-0" />
                  </a>
                  <span className="text-[10px] text-[#221E1F]/50 block mt-1 truncate">
                    {discovery.licenseName}
                  </span>
                </div>
              </div>

              {/* Usage Rights Bar */}
              <div className="mt-5 pt-4 border-t border-[#B8973D]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="bg-white border border-[#B8973D]/30 px-3 py-1 rounded-full font-medium">
                    Commercial Use: <strong className="text-emerald-700">{discovery.commercialUse}</strong>
                  </span>
                  <span className="bg-white border border-[#B8973D]/30 px-3 py-1 rounded-full font-medium">
                    Modification: <strong className="text-emerald-700">{discovery.modification}</strong>
                  </span>
                  <span className="bg-white border border-[#B8973D]/30 px-3 py-1 rounded-full font-medium">
                    Attribution: <strong className="text-amber-800">Required</strong>
                  </span>
                </div>

                <a
                  href={discovery.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-[#5A1827] hover:text-[#B8973D] font-bold underline transition-colors"
                >
                  <span>Read Official Creative Commons Deed</span>
                  <ExternalLinkIcon className="w-3.5 h-3.5 text-[#B8973D]" />
                </a>
              </div>
            </div>

            {/* Community Contribution Callout */}
            {onNavigatePreservation && (
              <div className="bg-gradient-to-r from-[#FAF8F5] via-[#F3EFEA] to-[#FAF8F5] border border-[#B8973D]/35 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#5A1827] text-[#FAF8F5] flex items-center justify-center shrink-0 shadow-md">
                    <FeatherIcon className="w-6 h-6 text-[#D4B257]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
                      Community Preservation Archive
                    </span>
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-[#5A1827] mt-0.5">
                      Have a story, photograph, or memory about {discovery.name}?
                    </h4>
                    <p className="text-xs text-[#221E1F]/75 mt-1 max-w-xl leading-relaxed">
                      Culture lives through the people who remember it. Share oral histories, family traditions, vintage photographs, or local insights to help preserve this living heritage.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onNavigatePreservation}
                  className="shrink-0 bg-[#5A1827] hover:bg-[#3F101B] text-[#FAF8F5] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>Share Your Story</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-[#D4B257]" />
                </button>
              </div>
            )}

            {/* 4. Bottom Navigation & Discovery Cycler */}
            <div className="pt-6 border-t border-[#B8973D]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={onBack}
                className="w-full sm:w-auto bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer inline-flex items-center justify-center space-x-2"
              >
                <ArrowLeftIcon className="w-4 h-4 text-[#D4B257]" />
                <span>Return to All 15 Discoveries</span>
              </button>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  onClick={() => onSelectDiscovery(prevDiscovery.id)}
                  className="px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#B8973D]/40 text-xs font-semibold text-[#5A1827] transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5 text-[#B8973D]" />
                  <span>Prev: {prevDiscovery.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => onSelectDiscovery(nextDiscovery.id)}
                  className="px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#B8973D]/40 text-xs font-semibold text-[#5A1827] transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <span>Next: {nextDiscovery.name.split(' ')[0]}</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-[#B8973D]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Related Discoveries from Same Category */}
        {relatedDiscoveries.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B8973D] font-bold">
                  Continue Exploring
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#5A1827]">
                  More in {discovery.category}
                </h3>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-bold text-[#5A1827] hover:text-[#B8973D] underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDiscoveries.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectDiscovery(rel.id)}
                  className="group bg-white rounded-2xl border border-[#B8973D]/30 p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-[#FAF8F5]">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                      <span className="absolute bottom-2 left-2 text-[10px] text-white font-medium bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        {rel.era}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#5A1827] bg-[#5A1827]/10 px-2 py-0.5 rounded-full">
                      {rel.category}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-[#5A1827] mt-1.5 mb-1 group-hover:text-[#7A2236] transition-colors">
                      {rel.name}
                    </h4>
                    <p className="text-xs text-[#221E1F]/65 line-clamp-2 leading-relaxed">
                      {rel.desc}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#B8973D]/20 flex justify-between items-center text-xs font-semibold text-[#5A1827]">
                    <span>{rel.locality.split(',')[0]}</span>
                    <span className="text-[#B8973D] group-hover:translate-x-1 transition-transform">Details &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

