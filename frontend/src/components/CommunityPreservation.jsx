import { BookOpenIcon, HammerIcon, ShieldCheckIcon, FeatherIcon } from './Icons';

export default function CommunityPreservation({ onOpenContribute }) {
  const pillars = [
    {
      title: "Oral Histories & Living Memory",
      tagline: "Elders & Folk Narrators",
      desc: "Documenting spoken folklore, temple drum mnemonics (vaythari), and forgotten harvest songs across Thrissur villages.",
      icon: <BookOpenIcon className="w-5 h-5 text-[#B8973D]" />,
      action: "Archive an Oral Record"
    },
    {
      title: "Artisan Custodianship",
      tagline: "Master Smiths & Guilds",
      desc: "Direct profiling and geo-registry of generational bell-metal casters, Chenda skin-binders, and rosewood carvers.",
      icon: <HammerIcon className="w-5 h-5 text-[#B8973D]" />,
      action: "Register an Artisan"
    },
    {
      title: "Open Cultural Commons",
      tagline: "Peer-Verified Preservation",
      desc: "A public, decentralized digital archive safeguarded for historians, cultural travelers, and Kerala's future generations.",
      icon: <ShieldCheckIcon className="w-5 h-5 text-[#B8973D]" />,
      action: "Explore Commons"
    }
  ];

  return (
    <section id="preservation" className="py-24 bg-[#FAF8F5] relative overflow-hidden border-t border-[#B8973D]/20">
      {/* Subtle Background Radial Blend */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-[#B8973D]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B8973D] font-bold">
            Community Preservation
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#5A1827] mt-2 mb-4">
            Guardians of the Living Archive
          </h2>
          <p className="text-[#221E1F]/70 text-sm md:text-base leading-relaxed">
            Culture does not reside solely in monuments — it breathes in the hands of master metal-smiths, festival drummers, and the oral memory of village elders.
          </p>
        </div>

        {/* 3 Preservation Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#B8973D]/30 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#B8973D]/30 flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 transition-transform">
                  {pillar.icon}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
                  {pillar.tagline}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#5A1827] mt-1 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#221E1F]/70 leading-relaxed mb-6">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#B8973D]/20">
                <button
                  onClick={onOpenContribute}
                  className="text-xs font-semibold text-[#5A1827] group-hover:text-[#B8973D] transition-colors inline-flex items-center space-x-1 cursor-pointer"
                >
                  <span>{pillar.action}</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Banner */}
        <div className="bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border-2 border-[#B8973D]/40 rounded-3xl p-8 md:p-12 shadow-lg max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="max-w-lg">
            <div className="inline-flex items-center space-x-2 text-[#5A1827] text-xs font-bold uppercase tracking-wider mb-2">
              <FeatherIcon className="w-4 h-4 text-[#B8973D]" />
              <span>Living Culture Registry</span>
            </div>
            <h4 className="font-serif text-2xl md:text-3xl font-bold text-[#5A1827] mb-2">
              Know an undocumented ritual or artisan?
            </h4>
            <p className="text-xs md:text-sm text-[#221E1F]/70 leading-relaxed">
              Submit archival documentation, oral narratives, or artisan coordinates to be verified by Thrissur cultural historians.
            </p>
          </div>
          <button
            onClick={onOpenContribute}
            className="bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl shrink-0 cursor-pointer active:scale-95"
          >
            Contribute Archive Note
          </button>
        </div>
      </div>
    </section>
  );
}
