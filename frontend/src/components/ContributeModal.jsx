import { useState, useEffect } from 'react';
import { XIcon, FeatherIcon, ShieldCheckIcon } from './Icons';

export default function ContributeModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    locality: '',
    category: 'Heritage Space',
    notes: '',
    contributor: ''
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.locality) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      locality: '',
      category: 'Heritage Space',
      notes: '',
      contributor: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-[#FAF8F5] rounded-3xl border-2 border-[#B8973D]/40 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white border border-[#B8973D]/30 text-[#5A1827] flex items-center justify-center hover:bg-[#5A1827] hover:text-[#FAF8F5] transition-colors"
          aria-label="Close dialog"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-300">
              <ShieldCheckIcon className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-3xl font-bold text-[#5A1827] mb-2">
              Archive Note Received
            </h3>
            <p className="text-xs md:text-sm text-[#221E1F]/70 max-w-md mx-auto mb-6 leading-relaxed">
              Thank you for contributing to Thrissur's Living Culture Map. Your submission for{' '}
              <strong className="text-[#5A1827]">"{formData.name}"</strong> will be reviewed by our local heritage circle for GIS and historical verification.
            </p>
            <button
              onClick={handleReset}
              className="bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest text-[#B8973D] font-bold mb-2">
              <FeatherIcon className="w-4 h-4" />
              <span>Preservation Contribution</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#5A1827] mb-2">
              Submit an Archive Note
            </h2>
            <p className="text-xs text-[#221E1F]/70 mb-6 leading-relaxed">
              Help preserve undocumented folklore, master craftsmen, or sacred groves across Thrissur District.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#221E1F]/80 mb-1">
                  Landmark / Tradition / Artisan Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nadavaramba Bell-Metal Foundry or Chenda Master"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-[#B8973D]/30 rounded-xl px-3.5 py-2 text-xs text-[#221E1F] focus:outline-none focus:border-[#5A1827]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#221E1F]/80 mb-1">
                    Locality / Taluk / Village *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cherpu, Irinjalakuda, Swaraj Round"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full bg-white border border-[#B8973D]/30 rounded-xl px-3.5 py-2 text-xs text-[#221E1F] focus:outline-none focus:border-[#5A1827]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#221E1F]/80 mb-1">
                    Cultural Domain
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border border-[#B8973D]/30 rounded-xl px-3.5 py-2 text-xs text-[#221E1F] focus:outline-none focus:border-[#5A1827]"
                  >
                    <option value="Heritage Space">Heritage Space</option>
                    <option value="Festival">Festival</option>
                    <option value="Art Form">Art Form</option>
                    <option value="Craft">Craft</option>
                    <option value="Oral History">Oral History / Folklore</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#221E1F]/80 mb-1">
                  Historical Summary / Elder Oral Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe the significance, materials used, generational origin, or current preservation condition..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-[#B8973D]/30 rounded-xl p-3 text-xs text-[#221E1F] focus:outline-none focus:border-[#5A1827]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#221E1F]/80 mb-1">
                  Your Name / Contact Affiliation (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Raghavan / Local Folk Historian"
                  value={formData.contributor}
                  onChange={(e) => setFormData({ ...formData, contributor: e.target.value })}
                  className="w-full bg-white border border-[#B8973D]/30 rounded-xl px-3.5 py-2 text-xs text-[#221E1F] focus:outline-none focus:border-[#5A1827]"
                />
              </div>

              <div className="pt-4 border-t border-[#B8973D]/20 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#221E1F]/70 hover:bg-[#221E1F]/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  Submit For Review
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
