import { SparklesIcon, CompassIcon } from './Icons';

export default function MagicLensSection({ onLaunchMagicLens }) {
  const handleLaunch = (mode = 'surprise') => {
    if (onLaunchMagicLens) {
      onLaunchMagicLens(mode);
    } else {
      window.location.hash = '#magic-lens';
    }
  };

  return (
    <section id="magic-lens" className="py-24 bg-white border-t border-b border-[#B8973D]/20 relative overflow-hidden">
      {/* Background Decorative Motifs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#B8973D]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#5A1827]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#B8973D] font-bold">
            Signature Experience
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#5A1827] mt-2 mb-3">
            Ready to discover something unexpected?
          </h2>
          <p className="text-[#221E1F]/70 text-sm md:text-base leading-relaxed font-light">
            Look closer. Discover something unexpected.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Information & Controls */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#5A1827] leading-snug">
              Kinetic 3D Magnifying Lens across Thrissur District
            </h3>
            <p className="text-xs md:text-sm text-[#221E1F]/75 leading-relaxed font-light">
              Instead of manual clicking, the Magic Lens automatically glides along smooth cartographic trajectories across historical sanctuaries, sacred festival routes, and artisan colonies—genuinely magnifying the underlying map before revealing a curated cultural gem.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleLaunch('surprise')}
                className="bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-xl active:scale-95 cursor-pointer inline-flex items-center justify-center space-x-2"
              >
                <SparklesIcon className="w-4 h-4 text-[#D4B257]" />
                <span>Start Exploring</span>
                <span className="text-base">&rarr;</span>
              </button>
              <button
                onClick={() => handleLaunch('preferences')}
                className="bg-white border-2 border-[#B8973D]/50 text-[#5A1827] hover:bg-[#FAF8F5] px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer inline-flex items-center justify-center space-x-1.5"
              >
                <CompassIcon className="w-4 h-4 text-[#B8973D]" />
                <span>My Preferences</span>
              </button>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#B8973D]/20 text-xs text-[#221E1F]/75">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#B8973D]" />
                <span>Genuine Cartographic Magnification</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#5A1827]" />
                <span>Automated Cinematic Scanning</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#927329]" />
                <span>Verified Coordinates & Highlights</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Accessible with Pause & Skip</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Teaser / Launcher Box */}
          <div
            id="lensSimulationBox"
            onClick={() => handleLaunch('surprise')}
            className="group cursor-pointer relative bg-[#FAF8F5] p-8 rounded-3xl border-2 border-[#B8973D]/40 hover:border-[#5A1827] shadow-xl text-center min-h-[340px] flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            {/* 3D Magnifying Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FAF8F5] via-[#D4B257] to-[#5A1827] p-1.5 shadow-xl group-hover:scale-105 transition-transform duration-300 mb-4">
              <div className="w-full h-full rounded-full bg-[#3F101B] flex items-center justify-center text-[#D4B257] border border-[#FAF8F5]/30">
                <SparklesIcon className="w-8 h-8 text-[#D4B257] animate-pulse" />
              </div>
            </div>

            {/* Lens Status Tag */}
            <span
              id="lensStatusTag"
              className="text-[10px] uppercase tracking-widest font-bold mb-2 px-3 py-1 rounded-full bg-[#5A1827]/10 text-[#5A1827] border border-[#5A1827]/20"
            >
              Interactive Discovery Mode
            </span>

            {/* Result Title */}
            <h4 className="font-serif text-2xl md:text-3xl font-bold text-[#5A1827] mb-2 group-hover:text-[#7A2236] transition-colors">
              Experience Magic Lens
            </h4>

            {/* Result Description */}
            <p className="text-xs text-[#221E1F]/70 max-w-sm mb-5 leading-relaxed font-light">
              Click to launch the 3D magnifying lens over Thrissur district. Discover shrines, festivals, ritual art, and traditional crafts.
            </p>

            <span className="bg-[#5A1827] group-hover:bg-[#7A2236] text-[#FAF8F5] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center space-x-1.5">
              <span>Launch Experience</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
