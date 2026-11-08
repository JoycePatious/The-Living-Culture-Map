import { CompassIcon } from './Icons';

export default function Hero({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  onSelectCategory
}) {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'Heritage Space', label: 'Heritage Spaces' },
    { id: 'Festival', label: 'Festivals' },
    { id: 'Art Form', label: 'Art Forms' },
    { id: 'Craft', label: 'Crafts' }
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5]">
      {/* 1. Large, Blurred Kerala Cultural Photograph blended into Ivory (#FAF8F5) */}
      <div className="hero-cultural-backdrop" aria-hidden="true" />
      <div className="hero-ivory-gradient-overlay" aria-hidden="true" />

      {/* Decorative Silk Geometry Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden="true">
        <div className="absolute top-1/4 left-8 w-64 h-64 rounded-full bg-[#B8973D]/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-10 w-80 h-80 rounded-full bg-[#5A1827]/5 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        {/* District Badge */}
        <div className="inline-flex items-center space-x-2 bg-[#5A1827]/5 border border-[#5A1827]/20 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#B8973D] animate-pulse"></span>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#5A1827]">
            Thrissur Cultural District • 15 Verified Entries
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-[#5A1827] leading-[1.1] mb-6 tracking-tight">
          Where Tradition <br />
          <span className="italic font-normal text-[#B8973D]">Breathes.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-base md:text-lg text-[#221E1F]/75 mb-10 leading-relaxed font-normal">
          Uncovering the living pulse of Thrissur — from midnight temple drums and ancient bell-metal smiths to secret archival heritage trails.
        </p>

        {/* Search Bar Container */}
        <div className="max-w-xl mx-auto bg-white p-3 rounded-2xl shadow-xl shadow-[#5A1827]/5 border border-[#B8973D]/30 mb-8 flex flex-col sm:flex-row gap-2 transition-all duration-300 hover:border-[#B8973D]/50 hover:shadow-2xl hover:shadow-[#5A1827]/10">
          <div className="flex-1 flex items-center px-3 py-2 bg-[#FAF8F5] rounded-xl border border-[#B8973D]/20">
            <CompassIcon className="w-5 h-5 text-[#B8973D] mr-3 shrink-0" />
            <input
              type="text"
              id="heroSearch"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search Pulikali, Vadakkumnathan, Pooram..."
              className="w-full bg-transparent text-sm text-[#221E1F] placeholder-[#221E1F]/40 focus:outline-none"
            />
          </div>
          <button
            onClick={onSearchSubmit}
            className="bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-sm active:scale-95"
          >
            Search Archive
          </button>
        </div>

        {/* Filter Badges / Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs">
          <span className="text-[#221E1F]/50 font-medium mr-2">Filters:</span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#5A1827] text-[#FAF8F5] shadow-md ring-2 ring-[#B8973D]/40'
                    : 'bg-white hover:bg-[#5A1827]/5 border border-[#B8973D]/30 text-[#221E1F]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
