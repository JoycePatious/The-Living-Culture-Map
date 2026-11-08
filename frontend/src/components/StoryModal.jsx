import { useEffect } from 'react';
import { XIcon, PlayIcon, ExternalLinkIcon } from './Icons';

export default function StoryModal({ story, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-[#3F101B] text-[#FAF8F5] rounded-3xl border-2 border-[#B8973D]/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 p-6 md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 border border-[#B8973D]/40 text-[#FAF8F5] flex items-center justify-center hover:bg-[#B8973D] hover:text-[#3F101B] transition-colors"
          aria-label="Close dialog"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Header Tag */}
        <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-[#B8973D] mb-2">
          <span>{story.category}</span>
          <span>•</span>
          <span>{story.duration}</span>
        </div>

        {/* Story Title */}
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#FAF8F5] mb-3 leading-tight pr-8">
          {story.title}
        </h2>

        {/* Summary */}
        <p className="text-xs md:text-sm text-[#FAF8F5]/80 mb-4 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/10">
          {story.summary}
        </p>

        {/* Hero Photo with Attribution */}
        {story.heroImage && (
          <div className="relative rounded-2xl overflow-hidden mb-6 border border-[#B8973D]/30 shadow-md">
            <img
              src={story.heroImage}
              alt={story.title}
              className="w-full h-48 md:h-56 object-cover"
            />
            {story.attribution && (
              <div className="p-2 bg-black/60 text-[10px] text-white/80 flex justify-between items-center">
                <span>Photo: {story.attribution}</span>
                <span className="text-[#B8973D]">Verified Thrissur Archive</span>
              </div>
            )}
          </div>
        )}

        {/* Scene Breakdown List */}
        <h4 className="text-xs uppercase tracking-widest text-[#B8973D] font-bold mb-3 flex items-center space-x-2">
          <PlayIcon className="w-3.5 h-3.5 text-[#B8973D]" />
          <span>Cinematic Scene Progression</span>
        </h4>

        <div className="space-y-3 mb-8">
          {story.breakdown.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-[#B8973D]/25 rounded-xl p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif text-lg font-bold text-[#FAF8F5]">
                  Scene {idx + 1}: {item.scene}
                </span>
                <span className="text-[11px] font-mono text-[#B8973D] font-semibold bg-black/40 px-2 py-0.5 rounded">
                  {item.time}
                </span>
              </div>
              <p className="text-xs text-[#FAF8F5]/75 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Sources & Credits Section */}
        <div className="mb-8 rounded-2xl bg-black/40 border border-[#B8973D]/30 p-4 md:p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#B8973D]/20">
            <h4 className="text-xs uppercase tracking-widest text-[#B8973D] font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B8973D]" />
              <span>Photograph Sources & Licensing Credits</span>
            </h4>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
              {story.verificationStatus || 'Cleared for Use'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#FAF8F5]/80">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#B8973D] font-bold block">
                Photograph File
              </span>
              <span className="font-mono text-[11px] text-[#FAF8F5]/90 font-medium">
                {story.photoFile || (story.heroImage && story.heroImage.replace('/stories/', ''))}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#B8973D] font-bold block">
                Photographer / Creator
              </span>
              <span className="font-semibold text-[#FAF8F5]">
                {story.photographer || 'Unknown'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#B8973D] font-bold block">
                Original Archival Source
              </span>
              <a
                href={story.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[#D4B257] hover:text-white font-semibold underline underline-offset-2 transition-colors"
              >
                <span>{story.sourceName || 'Wikimedia Commons'}</span>
                <ExternalLinkIcon className="w-3 h-3 text-[#B8973D]" />
              </a>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#B8973D] font-bold block">
                Licence
              </span>
              <a
                href={story.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[#D4B257] hover:text-white font-bold underline underline-offset-2 transition-colors"
              >
                <span>{story.license || 'CC BY-SA'}</span>
                <ExternalLinkIcon className="w-3 h-3 text-[#B8973D]" />
              </a>
            </div>
          </div>

          {/* Usage breakdown */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-2 text-[10px] text-[#FAF8F5]/70">
            <span className="bg-white/5 border border-[#B8973D]/30 px-2 py-0.5 rounded font-medium">
              Commercial Use: <strong className="text-emerald-300">{story.commercialUse || 'Permitted'}</strong>
            </span>
            <span className="bg-white/5 border border-[#B8973D]/30 px-2 py-0.5 rounded font-medium">
              Modification: <strong className="text-emerald-300">{story.modification || 'Permitted'}</strong>
            </span>
            <span className="bg-white/5 border border-[#B8973D]/30 px-2 py-0.5 rounded font-medium">
              Attribution: <strong className="text-amber-300">Required</strong>
            </span>
            <a
              href={story.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4B257] hover:underline font-semibold ml-auto"
            >
              View Full Deed &rarr;
            </a>
          </div>
        </div>

        {/* Footer info note & close */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] text-[#FAF8F5]/60">
            Phase 1 Story Mode preview script. Full kinetic scene player unlocks in Phase 2.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
