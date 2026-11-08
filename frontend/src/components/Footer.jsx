import { FlameIcon } from './Icons';

export default function Footer({
  onNavigateHome,
  onNavigateMap,
  onNavigateMagicLens,
  onNavigateStories,
  onNavigatePreservation
}) {
  return (
    <footer className="bg-[#221E1F] text-[#FAF8F5]/80 py-16 border-t border-[#B8973D]/30 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left pb-8 border-b border-white/10">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#5A1827] flex items-center justify-center text-[#B8973D] border border-[#B8973D]/40 shadow-sm">
              <FlameIcon className="w-5 h-5 text-[#B8973D]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-wider text-[#FAF8F5]">RIVA</span>
              <span className="text-[10px] uppercase tracking-widest text-[#B8973D] font-semibold">
                Living Culture Map
              </span>
            </div>
          </div>

          {/* Subtitle Statement */}
          <p className="text-xs text-[#FAF8F5]/65 max-w-md">
            RIVA – The Living Culture Map (Thrissur District MVP). Built for cultural discovery, preservation, and hackathon excellence.
          </p>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-xs font-medium text-[#B8973D]">
            <a
              href="#discoveries"
              onClick={(e) => {
                if (onNavigateHome) {
                  e.preventDefault();
                  onNavigateHome('discoveries');
                }
              }}
              className="hover:underline hover:text-[#D4B257] transition-colors"
            >
              Discoveries
            </a>
            <a
              href="#map"
              onClick={(e) => {
                if (onNavigateMap) {
                  e.preventDefault();
                  onNavigateMap();
                }
              }}
              className="hover:underline hover:text-[#D4B257] transition-colors"
            >
              Cultural Map
            </a>
            <a
              href="#magic-lens"
              onClick={(e) => {
                if (onNavigateMagicLens) {
                  e.preventDefault();
                  onNavigateMagicLens();
                }
              }}
              className="hover:underline hover:text-[#D4B257] transition-colors"
            >
              Magic Lens
            </a>
            <a
              href="#stories"
              onClick={(e) => {
                if (onNavigateStories) {
                  e.preventDefault();
                  onNavigateStories();
                }
              }}
              className="hover:underline hover:text-[#D4B257] transition-colors"
            >
              Story Mode
            </a>
            <a
              href="#preservation"
              onClick={(e) => {
                if (onNavigatePreservation) {
                  e.preventDefault();
                  onNavigatePreservation();
                }
              }}
              className="hover:underline hover:text-[#D4B257] transition-colors"
            >
              Preservation
            </a>
          </div>
        </div>

        {/* Bottom Attribution & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FAF8F5]/50 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} RIVA Culture Project. Thrissur, Kerala. All cultural entries verified.
          </p>
          <p className="text-[10px] text-[#FAF8F5]/40">
            Authentic photography sourced under Creative Commons Attribution licenses from Wikimedia Commons archives.
          </p>
        </div>
      </div>
    </footer>
  );
}
