import { CATEGORIES_DATA } from '../data/discoveries';
import { LandmarkIcon, SparklesIcon, PaletteIcon, HammerIcon, ChevronRightIcon } from './Icons';

export default function CulturalCategories({ onSelectCategory, selectedCategory }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'landmark':
        return <LandmarkIcon className="w-5 h-5 text-[#B8973D]" />;
      case 'sparkles':
        return <SparklesIcon className="w-5 h-5 text-[#B8973D]" />;
      case 'palette':
        return <PaletteIcon className="w-5 h-5 text-[#B8973D]" />;
      case 'hammer':
        return <HammerIcon className="w-5 h-5 text-[#B8973D]" />;
      default:
        return <SparklesIcon className="w-5 h-5 text-[#B8973D]" />;
    }
  };

  const handleCategoryClick = (categoryId) => {
    onSelectCategory(categoryId);
    const element = document.getElementById('discoveries');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-20 bg-[#FAF8F5] border-t border-b border-[#B8973D]/20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#B8973D] font-bold">Cultural Pillars</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#5A1827] mt-2 mb-3">
            Explore by Living Heritage
          </h2>
          <p className="text-[#221E1F]/70 text-sm leading-relaxed">
            Thrissur's cultural geography organized into four enduring domains of sacred architecture, seasonal gatherings, street pageantry, and metallurgical craft.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`group cursor-pointer rounded-2xl bg-white border transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden relative shadow-sm hover:shadow-xl ${
                  isSelected
                    ? 'border-[#5A1827] ring-2 ring-[#B8973D]/50 shadow-md'
                    : 'border-[#B8973D]/30 hover:border-[#B8973D]/70'
                }`}
              >
                {/* Subtle blurred photo layer in card background */}
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-300 bg-cover bg-center pointer-events-none filter blur-[1px]"
                  style={{ backgroundImage: `url(${cat.image})` }}
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#B8973D]/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      {getIcon(cat.icon)}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#5A1827]/10 text-[#5A1827]">
                      {cat.count} {cat.count === 1 ? 'Entry' : 'Entries'}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#5A1827] mb-1 group-hover:text-[#7A2236] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] uppercase tracking-wider text-[#B8973D] font-semibold mb-2">
                    {cat.tagline}
                  </p>
                  <p className="text-xs text-[#221E1F]/70 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-5 mt-4 border-t border-[#B8973D]/15 flex items-center justify-between text-xs font-semibold text-[#5A1827]">
                  <span>Filter Discoveries</span>
                  <span className="inline-flex items-center text-[#B8973D] group-hover:translate-x-1 transition-transform">
                    <ChevronRightIcon className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
