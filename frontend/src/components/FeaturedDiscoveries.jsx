import { MapPinIcon, SearchIcon, XIcon, CompassIcon, PlayIcon } from './Icons';

export default function FeaturedDiscoveries({
  discoveries,
  allCount,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  onOpenDetails,
  onOpenMap,
  onOpenStory
}) {
  const categories = [
    { id: 'all', label: 'All', count: 15 },
    { id: 'Heritage Space', label: 'Heritage Spaces', count: 5 },
    { id: 'Festival', label: 'Festivals', count: 3 },
    { id: 'Art Form', label: 'Art Forms', count: 3 },
    { id: 'Craft', label: 'Crafts', count: 4 }
  ];

  const popularKeywords = [
    'Vadakkumnathan',
    'Pooram',
    'Kathakali',
    'Bell-Metal',
    'Wooden Elephant',
    'Pottery',
    'Swaraj Round'
  ];

  const handleClearSearch = () => {
    onSearchChange('');
  };

  const handleResetAll = () => {
    onSearchChange('');
    onSelectCategory('all');
  };

  return (
    <section id="discoveries" className="py-24 discovery-cultural-wrapper relative">
      {/* 2. Traditional Kerala Cultural Photograph Behind Discovery / Dashboard */}
      <div className="discovery-bg-image" aria-hidden="true" />

      {/* Subtle Dark Burgundy Overlay Layer with Slight Blur for Maximum Contrast */}
      <div className="discovery-burgundy-overlay" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#B8973D] font-bold">
            Verified Cultural Archive
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#FAF8F5] mt-2 mb-4 tracking-tight">
            The 15 Thrissur Discoveries
          </h2>
          <p className="text-[#FAF8F5]/85 text-sm md:text-base leading-relaxed font-light mb-4">
            Search, filter, and explore all fifteen documented shrines, festivals, living art forms, and master craft traditions of Thrissur.
          </p>
          {onOpenMap && (
            <button
              onClick={() => onOpenMap()}
              className="inline-flex items-center space-x-2 bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] border border-[#B8973D]/50 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm cursor-pointer hover:scale-105"
            >
              <CompassIcon className="w-4 h-4 text-[#D4B257]" />
              <span>Explore All on Interactive Cultural Map &rarr;</span>
            </button>
          )}
        </div>

        {/* 1. Working Discovery Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative bg-[#FAF8F5] rounded-2xl p-2 border-2 border-[#B8973D]/40 shadow-xl flex items-center">
            <span className="pl-3.5 pr-2 text-[#B8973D]">
              <SearchIcon className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, location, craft, festival or keyword..."
              className="w-full bg-transparent text-sm md:text-base text-[#221E1F] placeholder-[#221E1F]/45 focus:outline-none py-2 pr-10 font-medium"
              aria-label="Search cultural discoveries"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3.5 p-1 rounded-full text-[#5A1827] hover:bg-[#5A1827]/10 transition-colors cursor-pointer"
                aria-label="Clear search query"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Keyword Quick Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-[#FAF8F5]/75">
            <span className="text-[#D4B257] font-semibold mr-1">Popular searches:</span>
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => onSearchChange(kw)}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  searchTerm.toLowerCase() === kw.toLowerCase()
                    ? 'bg-[#B8973D] text-[#3F101B] font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-[#FAF8F5] border border-white/15'
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Category Filter Controls & Results Status */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-[#B8973D]/30">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-[#B8973D] text-[#3F101B] shadow-lg font-bold ring-2 ring-[#FAF8F5]/30'
                      : 'bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] text-[#221E1F] font-semibold border border-[#B8973D]/40 backdrop-blur-sm'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#3F101B] text-[#FAF8F5]' : 'bg-[#5A1827]/10 text-[#5A1827]'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results Summary & Clear Action */}
          <div className="text-xs text-[#FAF8F5]/90 flex items-center space-x-2 flex-wrap justify-center">
            <span>
              Showing <strong className="text-[#D4B257] font-bold">{discoveries.length}</strong> of{' '}
              {allCount} verified entries
            </span>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={handleResetAll}
                className="text-[#D4B257] underline hover:text-white font-semibold ml-2 cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-[#FAF8F5]">
            <span className="text-white/60 font-medium">Active filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center space-x-1 bg-[#5A1827] border border-[#B8973D]/40 text-[#FAF8F5] px-3 py-1 rounded-full">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-[#D4B257] ml-1 cursor-pointer"
                  aria-label="Remove category filter"
                >
                  ×
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center space-x-1 bg-[#5A1827] border border-[#B8973D]/40 text-[#FAF8F5] px-3 py-1 rounded-full">
                <span>Query: "{searchTerm}"</span>
                <button
                  onClick={handleClearSearch}
                  className="hover:text-[#D4B257] ml-1 cursor-pointer"
                  aria-label="Remove search query filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* 3. Discoveries 3-Column Responsive Grid */}
        {discoveries.length === 0 ? (
          <div className="bg-[#FAF8F5] rounded-3xl border-2 border-[#B8973D]/40 p-12 text-center max-w-lg mx-auto shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#5A1827]/10 text-[#5A1827] flex items-center justify-center mx-auto mb-4 border border-[#B8973D]/30">
              <CompassIcon className="w-8 h-8 text-[#B8973D]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#5A1827] mb-2">
              No Discoveries Found
            </h3>
            <p className="text-xs md:text-sm text-[#221E1F]/70 mb-6 leading-relaxed">
              No archival entries match <strong className="text-[#5A1827]">"{searchTerm}"</strong> in <span className="font-semibold">{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</span>.
              Try adjusting your query or exploring our popular cultural keywords.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="text-[11px] text-[#221E1F]/60 block w-full mb-1">Try searching for:</span>
              {popularKeywords.slice(0, 4).map((kw) => (
                <button
                  key={kw}
                  onClick={() => {
                    onSearchChange(kw);
                    onSelectCategory('all');
                  }}
                  className="text-xs bg-white border border-[#B8973D]/30 text-[#5A1827] px-3 py-1 rounded-full hover:bg-[#5A1827] hover:text-[#FAF8F5] transition-colors cursor-pointer"
                >
                  {kw}
                </button>
              ))}
            </div>
            <button
              onClick={handleResetAll}
              className="bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Reset Filters & Show All 15 Discoveries
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="discoveryGrid">
            {discoveries.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenDetails(item)}
                className="discovery-card bg-white rounded-2xl border border-[#B8973D]/30 p-6 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 cursor-pointer"
              >
                <div>
                  {/* Top Header: Category & ID */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-[#5A1827]/10 text-[#5A1827] text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-wider border border-[#5A1827]/15">
                      {item.category}
                    </span>
                    <span className="text-xs text-[#B8973D] font-semibold font-mono bg-[#B8973D]/10 px-2 py-0.5 rounded-full">
                      ID #{item.id < 10 ? '0' + item.id : item.id}
                    </span>
                  </div>

                  {/* Thumbnail Preview Banner */}
                  <div className="relative h-48 rounded-xl overflow-hidden mb-4 border border-[#B8973D]/25 bg-[#FAF8F5]">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/kerala-temple-woodcraft.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                    <span className="absolute bottom-2.5 left-2.5 text-[10px] text-white font-medium px-2.5 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/15">
                      {item.era}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 text-[9px] text-white/80 font-medium px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm truncate max-w-[150px]">
                      {item.photographer}
                    </span>
                  </div>

                  {/* Discovery Name */}
                  <h3 className="font-serif text-2xl font-bold text-[#5A1827] mb-2 group-hover:text-[#7A2236] transition-colors leading-snug">
                    {item.name}
                  </h3>

                  {/* Locality */}
                  <p className="text-xs text-[#221E1F]/65 mb-3 flex items-center">
                    <MapPinIcon className="w-3.5 h-3.5 text-[#B8973D] mr-1.5 shrink-0" />
                    <span>{item.locality}</span>
                  </p>

                  {/* Short Description */}
                  <p className="text-xs text-[#221E1F]/75 mb-4 leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Footer: Format & Details Action */}
                <div className="pt-4 border-t border-[#B8973D]/20 flex justify-between items-center text-xs font-semibold text-[#5A1827]">
                  <span className="text-[#221E1F]/70 text-[11px] font-medium bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#B8973D]/20">
                    Format: {item.story}
                  </span>
                  <div className="flex items-center space-x-2">
                    {onOpenStory && (item.id === 1 || item.id === 6 || item.id === 9) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const storyId = item.id === 1 ? 'architecture' : item.id === 6 ? 'pooram' : 'pulikali';
                          onOpenStory(storyId);
                        }}
                        className="bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] px-2.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center space-x-1"
                        title="Watch Cinematic Story"
                      >
                        <PlayIcon className="w-3 h-3 text-[#3F101B]" />
                        <span>Story</span>
                      </button>
                    )}
                    {onOpenMap && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenMap(item.id);
                        }}
                        className="text-[#B8973D] hover:text-[#5A1827] bg-[#FAF8F5] hover:bg-[#B8973D]/15 border border-[#B8973D]/35 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center space-x-1"
                        title="Locate on Cultural Map"
                      >
                        <MapPinIcon className="w-3 h-3 text-[#B8973D]" />
                        <span>Map</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetails(item);
                      }}
                      className="bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm group-hover:shadow cursor-pointer inline-flex items-center space-x-1"
                    >
                      <span>Details</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
