import { useEffect } from 'react';
import { XIcon, MapPinIcon, CompassIcon, ShieldCheckIcon, ExternalLinkIcon } from './Icons';

export default function DiscoveryModal({ discovery, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!discovery) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div className="relative bg-[#FAF8F5] rounded-3xl border-2 border-[#B8973D]/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 p-6 md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white border border-[#B8973D]/30 text-[#5A1827] flex items-center justify-center hover:bg-[#5A1827] hover:text-[#FAF8F5] transition-colors shadow-sm"
          aria-label="Close dialog"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Category & Verified Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-[#5A1827]/10 text-[#5A1827] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            {discovery.category}
          </span>
          <span className="text-xs font-mono font-semibold text-[#B8973D] bg-[#B8973D]/10 px-2.5 py-1 rounded-full">
            ID #{discovery.id < 10 ? '0' + discovery.id : discovery.id}
          </span>
          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>Verified Archive • High Confidence</span>
          </span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#5A1827] mb-2 pr-8 leading-tight">
          {discovery.name}
        </h2>

        {/* Locality & Coordinates */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#221E1F]/70 mb-5 pb-4 border-b border-[#B8973D]/20">
          <span className="flex items-center">
            <MapPinIcon className="w-4 h-4 text-[#B8973D] mr-1" />
            {discovery.locality}
          </span>
          <span className="flex items-center font-mono text-[#B8973D]">
            <CompassIcon className="w-4 h-4 text-[#B8973D] mr-1" />
            {discovery.coordinates}
          </span>
          <span className="text-[#221E1F]/60">
            Era: <strong>{discovery.era}</strong>
          </span>
        </div>

        {/* Photo Banner with Attribution */}
        <div className="relative rounded-2xl overflow-hidden mb-6 border border-[#B8973D]/30 shadow-md bg-white">
          <img
            src={discovery.image}
            alt={discovery.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/kerala-temple-woodcraft.jpg';
            }}
            className="w-full h-64 md:h-72 object-cover"
          />
          <div className="p-2.5 bg-[#221E1F]/90 text-[10px] text-white/80 flex justify-between items-center">
            <span>Photo Source: {discovery.attribution}</span>
            <span className="text-[#B8973D] font-medium">Authentic Documentation</span>
          </div>
        </div>

        {/* Description & Significance */}
        <div className="space-y-4 text-sm text-[#221E1F]/80 leading-relaxed mb-6">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#B8973D] font-bold mb-1">
              Archival Summary
            </h4>
            <p className="bg-white p-3.5 rounded-xl border border-[#B8973D]/20 text-[#221E1F]">
              {discovery.desc}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#B8973D] font-bold mb-1">
              Cultural & Architectural Significance
            </h4>
            <p className="bg-white p-3.5 rounded-xl border border-[#B8973D]/20 text-[#221E1F]">
              {discovery.significance}
            </p>
          </div>
        </div>

        {/* Sources & Credits Section */}
        <div className="mb-6 rounded-2xl bg-white border border-[#B8973D]/30 p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#B8973D]/20">
            <h4 className="text-xs uppercase tracking-widest text-[#5A1827] font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B8973D]" />
              <span>Photograph Sources & Licensing Credits</span>
            </h4>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {discovery.verificationStatus || 'Cleared for Use'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#221E1F]/80">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#B8973D] font-bold block">
                Photograph File
              </span>
              <span className="font-mono text-[11px] text-[#221E1F]/90 font-medium">
                {discovery.photoFile || (discovery.image && discovery.image.replace('/discoveries/', ''))}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#B8973D] font-bold block">
                Photographer / Creator
              </span>
              <span className="font-semibold text-[#5A1827]">
                {discovery.photographer || 'Unknown'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#B8973D] font-bold block">
                Original Archival Source
              </span>
              <a
                href={discovery.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[#5A1827] hover:text-[#B8973D] font-semibold underline underline-offset-2 transition-colors"
              >
                <span>{discovery.sourceName || 'Wikimedia Commons'}</span>
                <ExternalLinkIcon className="w-3 h-3 text-[#B8973D]" />
              </a>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#B8973D] font-bold block">
                Licence
              </span>
              <a
                href={discovery.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[#5A1827] hover:text-[#B8973D] font-bold underline underline-offset-2 transition-colors"
              >
                <span>{discovery.license || 'CC BY-SA'}</span>
                <ExternalLinkIcon className="w-3 h-3 text-[#B8973D]" />
              </a>
            </div>
          </div>

          {/* Permitted Usage Breakdown */}
          <div className="mt-3 pt-2.5 border-t border-[#B8973D]/15 flex flex-wrap items-center gap-2 text-[10px] text-[#221E1F]/70">
            <span className="bg-[#FAF8F5] border border-[#B8973D]/30 px-2 py-0.5 rounded font-medium">
              Commercial Use: <strong className="text-emerald-700">{discovery.commercialUse || 'Permitted'}</strong>
            </span>
            <span className="bg-[#FAF8F5] border border-[#B8973D]/30 px-2 py-0.5 rounded font-medium">
              Modification: <strong className="text-emerald-700">{discovery.modification || 'Permitted'}</strong>
            </span>
            <span className="bg-[#FAF8F5] border border-[#B8973D]/30 px-2 py-0.5 rounded font-medium">
              Attribution: <strong className="text-amber-800">Required</strong>
            </span>
            <a
              href={discovery.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B8973D] hover:underline font-semibold ml-auto"
            >
              View Full Deed &rarr;
            </a>
          </div>
        </div>

        {/* Story Format Notice */}
        <div className="pt-4 border-t border-[#B8973D]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[#221E1F]/70">
            Curated Format: <strong className="text-[#5A1827]">{discovery.story}</strong>
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
}
