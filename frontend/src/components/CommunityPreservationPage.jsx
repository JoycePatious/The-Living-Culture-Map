import { useState, useRef } from 'react';
import {
  BookOpenIcon,
  SparklesIcon,
  PaletteIcon,
  HammerIcon,
  LandmarkIcon,
  CameraIcon,
  FileTextIcon,
  ShieldCheckIcon,
  FeatherIcon,
  ArrowLeftIcon,
  CompassIcon,
  XIcon,
  CheckCircleIcon,
  UploadCloudIcon,
  InfoIcon
} from './Icons';

export default function CommunityPreservationPage({
  onNavigateHome,
  onNavigateMap,
  onNavigateStories,
  initialCategory = null
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    category: initialCategory || 'Local Stories and Oral Histories',
    locality: '',
    description: '',
    context: '',
    contributorName: '',
    creditPreference: 'display', // 'display' or 'anonymous'
    email: '',
    confirmOwnership: false,
    agreeTerms: false,
    isCulturallySensitive: false
  });

  // Media files state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(null);

  const fileInputRef = useRef(null);

  // The 7 Official Phase 6 Contribution Categories
  const contributionCategories = [
    {
      id: 'Local Stories and Oral Histories',
      title: 'Local Stories & Oral Histories',
      description: 'Family lore, elder recollections, temple drum mnemonics (vaythari), and forgotten harvest songs.',
      icon: <BookOpenIcon className="w-6 h-6 text-[#B8973D]" />,
      tag: 'Living Memory'
    },
    {
      id: 'Festivals and Traditions',
      title: 'Festivals & Traditions',
      description: 'Local desham poorams, velan rituals, neighborhood thiruvathira circles, and sacred processions.',
      icon: <SparklesIcon className="w-6 h-6 text-[#B8973D]" />,
      tag: 'Sacred Ritual'
    },
    {
      id: 'Traditional Art Forms',
      title: 'Traditional Art Forms',
      description: 'Chakyar Koothu, Koodiyattam, Tholpavakoothu shadow puppetry, and folk performance arts.',
      icon: <PaletteIcon className="w-6 h-6 text-[#B8973D]" />,
      tag: 'Performing Heritage'
    },
    {
      id: 'Crafts and Vanishing Skills',
      title: 'Crafts & Vanishing Skills',
      description: 'Lost-wax bell metal founding, rosewood elephant carving, Chenda skin-binding, and clay pottery.',
      icon: <HammerIcon className="w-6 h-6 text-[#B8973D]" />,
      tag: 'Artisan Lineage'
    },
    {
      id: 'Heritage Places',
      title: 'Heritage Places',
      description: 'Sacred groves (sarpa kavu), ancient megalithic dolmens, heritage nalukettu homes, and shrines.',
      icon: <LandmarkIcon className="w-6 h-6 text-[#B8973D]" />,
      tag: 'Sanctuary & Site'
    },
    {
      id: 'Photographs and Videos',
      title: 'Photographs & Videos',
      description: 'Historical family photographs, rare festival footage, artisan process clips, and landscape views.',
      icon: <CameraIcon className="w-6 h-6 text-[#B8973D]" />,
      tag: 'Visual Documentation'
    },
    {
      id: 'Corrections or Additional Information',
      title: 'Corrections & Clarifications',
      description: 'Geographic coordinate updates, corrected dates, architectural details, or historical notes.',
      icon: <FileTextIcon className="w-6 h-6 text-[#B8973D]" />,
      tag: 'Archival Accuracy'
    }
  ];

  // 3 Verified Demonstration Sample Contributions (Explicitly labeled)
  const sampleCommunityContributions = [
    {
      id: 'sample-01',
      title: 'Oral Vaythari Mnemonics of the Peruvanam Melam Tradition',
      category: 'Local Stories & Oral Histories',
      locality: 'Cherpu, Peruvanam',
      desc: 'Documentation of spoken syllable patterns (vaythari) vocalized by Chenda masters to teach the complex 7-beat Triputa rhythms before percussionists ever touch drumsticks.',
      contributorCredit: 'Contributed by Peruvanam percussion student (Anonymous by request)',
      eraContext: 'Generational oral pedagogy (18th Century to present)',
      status: 'Sample Demonstration Content',
      tagColor: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
    },
    {
      id: 'sample-02',
      title: 'Lost-Wax Bell-Metal Tuning Secrets of Nadavaramba',
      category: 'Crafts & Vanishing Skills',
      locality: 'Nadavaramba, Irinjalakuda',
      desc: 'Techniques of testing bronze alloy resonance using beeswax cores and clay moulds to achieve pure acoustic sustain for temple sanctum prayer bells.',
      contributorCredit: 'Contributed by Moosari artisanal guild descendant',
      eraContext: 'Cochin Royal brass founding lineage',
      status: 'Sample Demonstration Content',
      tagColor: 'bg-amber-950/70 text-amber-300 border-amber-500/40'
    },
    {
      id: 'sample-03',
      title: 'Sacred Wood Selection for Kummattikali Avani Avittom Masks',
      category: 'Traditional Art Forms',
      locality: 'Palakkal, Thrissur',
      desc: 'Field notes on selecting seasoned Spathodea campanulata (African tulip wood) for featherweight ritual masks worn during four days of post-Onam masked village dances.',
      contributorCredit: 'Contributed by local folklore researcher',
      eraContext: 'Living ritual choreography',
      status: 'Sample Demonstration Content',
      tagColor: 'bg-purple-950/70 text-purple-300 border-purple-500/40'
    }
  ];

  // Handle category card click to open form pre-filled
  const handleOpenFormWithCategory = (categoryTitle) => {
    setFormData((prev) => ({ ...prev, category: categoryTitle }));
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Handle file uploads (Images, Videos, Documents)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newFiles = files.map((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isDoc = file.type.includes('pdf') || file.type.includes('document') || file.name.endsWith('.pdf') || file.name.endsWith('.doc');

      return {
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: isImage ? 'image' : isVideo ? 'video' : isDoc ? 'document' : 'file',
        previewUrl: isImage || isVideo ? URL.createObjectURL(file) : null
      };
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  // Remove uploaded file
  const handleRemoveFile = (idToRemove) => {
    setUploadedFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== idToRemove);
      return filtered;
    });
  };

  // Client-side Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Please enter a title for your cultural contribution.';
    }
    if (!formData.locality.trim()) {
      errors.locality = 'Please specify the locality, village, or landmark in Thrissur.';
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      errors.description = 'Please provide a detailed description (at least 20 characters).';
    }
    if (!formData.confirmOwnership) {
      errors.confirmOwnership = 'Please confirm ownership or authorization to share this material.';
    }
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'Please agree to archival use and attribution standards.';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email address.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Submission
  const handleSubmitContribution = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate review intake protocol
    setTimeout(() => {
      setIsSubmitting(false);
      const randomRefId = `RIVA-PRESERVE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmissionReceipt({
        refId: randomRefId,
        title: formData.title,
        category: formData.category,
        locality: formData.locality,
        contributor: formData.contributorName || (formData.creditPreference === 'anonymous' ? 'Anonymous Contributor' : 'Community Member'),
        filesCount: uploadedFiles.length,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        isSensitive: formData.isCulturallySensitive
      });
      setIsFormOpen(false);
    }, 800);
  };

  // Reset form
  const handleResetForm = () => {
    setFormData({
      title: '',
      category: 'Local Stories and Oral Histories',
      locality: '',
      description: '',
      context: '',
      contributorName: '',
      creditPreference: 'display',
      email: '',
      confirmOwnership: false,
      agreeTerms: false,
      isCulturallySensitive: false
    });
    setUploadedFiles([]);
    setFormErrors({});
    setSubmissionReceipt(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#221E1F] pt-24 pb-20 selection:bg-[#B8973D]/20 selection:text-[#5A1827]">
      {/* 1. Header & Navigation Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-6 w-full mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#B8973D]/25">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#221E1F]/60 mb-1">
              <button
                onClick={() => onNavigateHome('discoveries')}
                className="hover:text-[#5A1827] transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-[#5A1827] font-semibold">Community Preservation</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
              Open Living Cultural Archive
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#5A1827] tracking-tight mt-1">
              Every Story Deserves to Be Remembered.
            </h1>
            <p className="text-sm sm:text-base text-[#221E1F]/75 mt-2 max-w-3xl font-light leading-relaxed">
              Culture lives through the people who practise it, remember it and pass it on. Share your knowledge and help preserve the living heritage of Thrissur.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0 flex-wrap gap-2">
            <button
              onClick={() => onNavigateHome('discoveries')}
              className="inline-flex items-center space-x-2 bg-white hover:bg-[#5A1827] text-[#5A1827] hover:text-[#FAF8F5] border border-[#B8973D]/40 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5 text-[#B8973D]" />
              <span>Discoveries Grid</span>
            </button>
            <button
              onClick={onNavigateMap}
              className="inline-flex items-center space-x-1.5 bg-[#FAF8F5] hover:bg-[#B8973D]/15 text-[#3F101B] border border-[#B8973D]/40 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
            >
              <CompassIcon className="w-3.5 h-3.5 text-[#B8973D]" />
              <span>Cultural Map</span>
            </button>
            {onNavigateStories && (
              <button
                onClick={onNavigateStories}
                className="inline-flex items-center space-x-1.5 bg-[#FAF8F5] hover:bg-[#B8973D]/15 text-[#3F101B] border border-[#B8973D]/40 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
              >
                <BookOpenIcon className="w-3.5 h-3.5 text-[#B8973D]" />
                <span>Story Mode</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Visual Introduction & Call to Action Hero Banner */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="bg-gradient-to-r from-[#5A1827] via-[#4A1420] to-[#3F101B] rounded-3xl p-8 sm:p-12 text-[#FAF8F5] shadow-2xl relative overflow-hidden">
          {/* Subtle Kerala Architecture Texture Silhouette */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#B8973D]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4B257] mb-4 backdrop-blur-sm">
              <FeatherIcon className="w-3.5 h-3.5 text-[#D4B257]" />
              <span>Grassroots Preservation Initiative</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
              Help Safeguard Thrissur&apos;s Living Memory
            </h2>

            <p className="text-sm sm:text-base text-[#FAF8F5]/85 leading-relaxed font-light mb-8">
              Centuries of oral memory, master craft techniques, and village traditions cannot be found in conventional textbooks. Whether it is a forgotten harvest song from Anthikad, a 90-year-old brass-founder&apos;s alloy recipe from Nadavaramba, or rare family photos of Thrissur Pooram from decades past — your contribution keeps our culture alive.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, category: 'Local Stories and Oral Histories' }));
                  setFormErrors({});
                  setIsFormOpen(true);
                }}
                className="bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] font-bold px-8 py-4 rounded-full text-xs md:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center space-x-2"
              >
                <FeatherIcon className="w-4 h-4 text-[#3F101B]" />
                <span>Share Your Story</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('review-process');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/25 text-[#FAF8F5] px-6 py-4 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all cursor-pointer"
              >
                Learn How Review Works &darr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Seven Contribution Categories */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
            Contribution Pathways
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5A1827] mt-1 mb-3">
            Choose What You Would Like to Share
          </h2>
          <p className="text-xs sm:text-sm text-[#221E1F]/70 font-light leading-relaxed">
            Select an area of cultural heritage to contribute. Every submission is guided by respectful documentation principles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contributionCategories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => handleOpenFormWithCategory(cat.id)}
              className={`bg-white rounded-3xl border border-[#B8973D]/30 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 cursor-pointer ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-1 bg-gradient-to-b from-white to-[#FAF8F5]' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#B8973D]/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    {cat.icon}
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#5A1827]/10 text-[#5A1827] border border-[#5A1827]/15">
                    {cat.tag}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#5A1827] mb-2 group-hover:text-[#7A2236] transition-colors leading-snug">
                  {cat.title}
                </h3>

                <p className="text-xs text-[#221E1F]/70 font-light leading-relaxed mb-6">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#B8973D]/20 flex items-center justify-between text-xs font-semibold text-[#5A1827]">
                <span>Share in this category</span>
                <span className="text-[#B8973D] group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Contribution Review Process (Submitted -> Under Review -> Approved / Rejected) */}
      <section id="review-process" className="max-w-7xl mx-auto px-6 mb-20 scroll-mt-24">
        <div className="bg-white rounded-3xl border-2 border-[#B8973D]/35 p-8 sm:p-12 shadow-lg">
          <div className="max-w-3xl mb-8">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
              Ethical Archival Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5A1827] mt-1 mb-2">
              Our Four-Stage Archival Review Process
            </h2>
            <p className="text-xs sm:text-sm text-[#221E1F]/70 font-light leading-relaxed">
              To protect cultural integrity, community contributions do <strong>not</strong> appear automatically in RIVA&apos;s public discovery map. Every submission is reviewed by our volunteer network of Thrissur historians, folklorists, and local elders.
            </p>
          </div>

          {/* Workflow Stepper Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#B8973D]/25 p-5 relative">
              <div className="w-8 h-8 rounded-full bg-[#5A1827] text-white font-bold text-xs flex items-center justify-center mb-3">
                01
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8973D] block mb-1">
                Stage 1
              </span>
              <h4 className="font-serif text-lg font-bold text-[#5A1827] mb-2">
                Submission & Intake
              </h4>
              <p className="text-xs text-[#221E1F]/75 font-light leading-relaxed">
                Your story, locality, media files, and credit preferences are cataloged with a unique tracking reference code.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#B8973D]/25 p-5 relative">
              <div className="w-8 h-8 rounded-full bg-[#B8973D] text-[#3F101B] font-bold text-xs flex items-center justify-center mb-3">
                02
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8973D] block mb-1">
                Stage 2
              </span>
              <h4 className="font-serif text-lg font-bold text-[#5A1827] mb-2">
                Under Archival Review
              </h4>
              <p className="text-xs text-[#221E1F]/75 font-light leading-relaxed">
                Local historians verify geographical coordinates, check oral provenance, and confirm media rights and licensing clearance.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#B8973D]/25 p-5 relative">
              <div className="w-8 h-8 rounded-full bg-[#3F101B] text-[#FAF8F5] font-bold text-xs flex items-center justify-center mb-3">
                03
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8973D] block mb-1">
                Stage 3
              </span>
              <h4 className="font-serif text-lg font-bold text-[#5A1827] mb-2">
                Sensitivity Safeguard
              </h4>
              <p className="text-xs text-[#221E1F]/75 font-light leading-relaxed">
                Culturally sacred or clan-restricted materials are held confidentially and safeguarded from open public broadcast.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#B8973D]/25 p-5 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center mb-3">
                04
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                Stage 4
              </span>
              <h4 className="font-serif text-lg font-bold text-[#5A1827] mb-2">
                Approved / Published
              </h4>
              <p className="text-xs text-[#221E1F]/75 font-light leading-relaxed">
                Verified records enter the Living Culture Commons with your exact credit preference (or preserved anonymously).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Explore Community Contributions: "Stories From Our Communities" (Clearly Labeled Samples) */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-3 border-b border-[#B8973D]/25">
          <div>
            <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
              <span className="w-2 h-2 rounded-full bg-[#B8973D]" />
              <span>Public Archive Preview</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#5A1827] mt-1">
              Stories From Our Communities
            </h2>
            <p className="text-xs text-[#221E1F]/70 font-light mt-1">
              Explore how peer-verified community submissions are cataloged into the living record.
            </p>
          </div>

          <div className="bg-amber-100/80 border border-amber-300 text-amber-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shrink-0">
            Sample Demonstration Content
          </div>
        </div>

        {/* Prototype Transparency Notice */}
        <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#B8973D]/30 mb-8 flex items-start space-x-3 text-xs text-[#221E1F]/75">
          <InfoIcon className="w-4 h-4 text-[#B8973D] shrink-0 mt-0.5" />
          <span>
            <strong>Editorial Integrity Notice:</strong> The three cards below are illustrative demonstration models representing the format, metadata, and citation structure of community entries. RIVA does not invent contributor identities or attribute fictional individuals to historical knowledge.
          </span>
        </div>

        {/* 3 Sample Demonstration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleCommunityContributions.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-[#B8973D]/30 p-6 shadow-md flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A1827] bg-[#5A1827]/10 px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.tagColor}`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#5A1827] mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[#B8973D] font-medium mb-3 flex items-center">
                  <CompassIcon className="w-3.5 h-3.5 mr-1 text-[#B8973D]" />
                  <span>{item.locality}</span>
                </p>

                <p className="text-xs text-[#221E1F]/75 font-light leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#B8973D]/20 text-[11px] text-[#221E1F]/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#5A1827]">Attribution:</span>
                  <span className="truncate max-w-[180px] text-right italic">{item.contributorCredit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#5A1827]">Period Context:</span>
                  <span className="text-right text-[10px] text-[#B8973D] font-mono">{item.eraContext}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Cultural Sensitivity & Responsible Preservation Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="bg-[#FAF8F5] rounded-3xl border-2 border-[#B8973D]/35 p-8 sm:p-10 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
              Preservation Charter
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#5A1827] mt-1 mb-2">
              Cultural Sensitivity & Responsible Stewardship
            </h2>
            <p className="text-xs sm:text-sm text-[#221E1F]/75 font-light leading-relaxed">
              Living cultural heritage belongs to the communities that sustain it. RIVA is bound by strict ethical principles to ensure digital documentation empowers, rather than exploits, traditional practitioners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-[#221E1F]/80">
            <div className="bg-white p-5 rounded-2xl border border-[#B8973D]/25">
              <h4 className="font-serif text-lg font-bold text-[#5A1827] mb-2 flex items-center space-x-2">
                <ShieldCheckIcon className="w-4 h-4 text-[#B8973D]" />
                <span>Respect for Sacred Traditions</span>
              </h4>
              <p className="font-light leading-relaxed">
                Certain rituals and sanctum practices are sacred and intended only for specific initiates. We never photograph, record, or publish restricted practices without formal elder permission.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#B8973D]/25">
              <h4 className="font-serif text-lg font-bold text-[#5A1827] mb-2 flex items-center space-x-2">
                <BookOpenIcon className="w-4 h-4 text-[#B8973D]" />
                <span>Honoring Oral Provenance</span>
              </h4>
              <p className="font-light leading-relaxed">
                Oral memories are recorded in the authentic dialect and phrasing of the speaker. We do not sanitize, standardize, or overwrite traditional spoken narratives with academic revisionism.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#B8973D]/25">
              <h4 className="font-serif text-lg font-bold text-[#5A1827] mb-2 flex items-center space-x-2">
                <FeatherIcon className="w-4 h-4 text-[#B8973D]" />
                <span>Fair Contributor Attribution</span>
              </h4>
              <p className="font-light leading-relaxed">
                Whether an elder sharing ancient folklore or an artisan sharing metallurgy math, contributors retain credit. Anonymous preferences are rigorously protected with zero data leakage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Comprehensive Contribution Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="relative bg-[#FAF8F5] text-[#221E1F] rounded-3xl border-2 border-[#B8973D]/50 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 my-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white hover:bg-[#5A1827] border border-[#B8973D]/40 text-[#5A1827] hover:text-[#FAF8F5] flex items-center justify-center transition-all cursor-pointer shadow-sm"
              aria-label="Close dialog"
            >
              <XIcon className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-[#B8973D] mb-1">
                <FeatherIcon className="w-3.5 h-3.5 text-[#B8973D]" />
                <span>Living Culture Registry</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A1827]">
                Share Your Cultural Story
              </h3>
              <p className="text-xs text-[#221E1F]/70 font-light mt-1">
                Help document Thrissur&apos;s vanishing folklore, master artisans, and heritage spaces.
              </p>
            </div>

            <form onSubmit={handleSubmitContribution} className="space-y-6">
              {/* SECTION A: About the Contribution */}
              <div className="bg-white p-5 rounded-2xl border border-[#B8973D]/25 space-y-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#5A1827] pb-2 border-b border-[#B8973D]/20 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B8973D]" />
                  <span>1. About the Contribution</span>
                </h4>

                {/* Contribution Title */}
                <div>
                  <label className="block text-xs font-semibold text-[#221E1F]/80 mb-1">
                    Contribution Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Ancient Bell-Metal Casting Techniques of Nadavaramba"
                    className="w-full bg-[#FAF8F5] border border-[#B8973D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#221E1F] focus:outline-none focus:border-[#5A1827]"
                  />
                  {formErrors.title && (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{formErrors.title}</p>
                  )}
                </div>

                {/* Category Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#221E1F]/80 mb-1">
                    Contribution Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#B8973D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#221E1F] focus:outline-none focus:border-[#5A1827]"
                  >
                    {contributionCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Locality or Location */}
                <div>
                  <label className="block text-xs font-semibold text-[#221E1F]/80 mb-1">
                    Location or Locality in Thrissur *
                  </label>
                  <input
                    type="text"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Cherpu, Peruvanam, Swaraj Round, Chavakkad..."
                    className="w-full bg-[#FAF8F5] border border-[#B8973D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#221E1F] focus:outline-none focus:border-[#5A1827]"
                  />
                  {formErrors.locality && (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{formErrors.locality}</p>
                  )}
                </div>

                {/* Detailed Description or Story */}
                <div>
                  <label className="block text-xs font-semibold text-[#221E1F]/80 mb-1">
                    Detailed Description or Story *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the tradition, ritual steps, oral narrative, artisan method, or forgotten memory in detail..."
                    className="w-full bg-[#FAF8F5] border border-[#B8973D]/30 rounded-xl p-3 text-xs text-[#221E1F] focus:outline-none focus:border-[#5A1827] leading-relaxed"
                  />
                  {formErrors.description && (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{formErrors.description}</p>
                  )}
                </div>

                {/* Historical Background / Additional Context */}
                <div>
                  <label className="block text-xs font-semibold text-[#221E1F]/80 mb-1">
                    Historical Background or Additional Context (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.context}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    placeholder="e.g. Practiced since the reign of Shakthan Thampuran, passed down 4 generations"
                    className="w-full bg-[#FAF8F5] border border-[#B8973D]/30 rounded-xl px-3.5 py-2 text-xs text-[#221E1F] focus:outline-none focus:border-[#5A1827]"
                  />
                </div>
              </div>

              {/* SECTION B: Contributor Information */}
              <div className="bg-white p-5 rounded-2xl border border-[#B8973D]/25 space-y-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#5A1827] pb-2 border-b border-[#B8973D]/20 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B8973D]" />
                  <span>2. Contributor Information</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#221E1F]/80 mb-1">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.contributorName}
                      onChange={(e) => setFormData({ ...formData, contributorName: e.target.value })}
                      placeholder="e.g. K. V. Narayanan"
                      className="w-full bg-[#FAF8F5] border border-[#B8973D]/30 rounded-xl px-3.5 py-2 text-xs text-[#221E1F] focus:outline-none focus:border-[#5A1827]"
                    />
                  </div>

                  {/* Private Email */}
                  <div>
                    <label className="block text-xs font-semibold text-[#221E1F]/80 mb-1">
                      Contact Email (Private & Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-[#FAF8F5] border border-[#B8973D]/30 rounded-xl px-3.5 py-2 text-xs text-[#221E1F] focus:outline-none focus:border-[#5A1827]"
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-rose-600 mt-1 font-semibold">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Credit Preference */}
                <div>
                  <span className="block text-xs font-semibold text-[#221E1F]/80 mb-2">
                    How would you like to be credited?
                  </span>
                  <div className="flex items-center space-x-6 text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="creditPreference"
                        value="display"
                        checked={formData.creditPreference === 'display'}
                        onChange={() => setFormData({ ...formData, creditPreference: 'display' })}
                        className="accent-[#5A1827]"
                      />
                      <span>Display my name with the contribution</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="creditPreference"
                        value="anonymous"
                        checked={formData.creditPreference === 'anonymous'}
                        onChange={() => setFormData({ ...formData, creditPreference: 'anonymous' })}
                        className="accent-[#5A1827]"
                      />
                      <span>Keep me anonymous</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION C: Media Uploads (Images, Videos, Documents) */}
              <div className="bg-white p-5 rounded-2xl border border-[#B8973D]/25 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#B8973D]/20">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#5A1827] flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#B8973D]" />
                    <span>3. Media Attachments (Photos, Video, Audio, Docs)</span>
                  </h4>
                  <span className="text-[10px] text-[#B8973D] font-mono">
                    {uploadedFiles.length} file(s) attached
                  </span>
                </div>

                {/* Dropzone / Upload Button */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#B8973D]/40 hover:border-[#5A1827] rounded-2xl p-6 text-center bg-[#FAF8F5] cursor-pointer transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#B8973D]/20 text-[#5A1827] flex items-center justify-center mx-auto mb-2">
                    <UploadCloudIcon className="w-5 h-5 text-[#B8973D]" />
                  </div>
                  <span className="text-xs font-bold text-[#5A1827] block">
                    Click to select photographs, videos, or documents
                  </span>
                  <span className="text-[11px] text-[#221E1F]/60 block mt-1">
                    Supports JPG, PNG, MP4, WebM, and PDF research notes
                  </span>
                </div>

                {/* File Previews List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8973D] block">
                      Attached Media Previews:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {uploadedFiles.map((fileItem) => (
                        <div
                          key={fileItem.id}
                          className="relative rounded-xl border border-[#B8973D]/30 overflow-hidden bg-black/5 p-2 flex flex-col justify-between"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(fileItem.id);
                            }}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-[#5A1827] text-white flex items-center justify-center text-xs z-10 cursor-pointer"
                            title="Remove file"
                          >
                            &times;
                          </button>

                          {fileItem.type === 'image' && fileItem.previewUrl ? (
                            <img
                              src={fileItem.previewUrl}
                              alt={fileItem.name}
                              className="w-full h-20 object-cover rounded-lg mb-1"
                            />
                          ) : fileItem.type === 'video' && fileItem.previewUrl ? (
                            <div className="w-full h-20 bg-black flex items-center justify-center rounded-lg mb-1 text-white text-[10px]">
                              <span>Video: {fileItem.name}</span>
                            </div>
                          ) : (
                            <div className="w-full h-20 bg-[#FAF8F5] border border-[#B8973D]/20 flex flex-col items-center justify-center rounded-lg mb-1 text-[#5A1827]">
                              <FileTextIcon className="w-6 h-6 text-[#B8973D]" />
                              <span className="text-[9px] uppercase font-bold mt-1">Doc</span>
                            </div>
                          )}

                          <div className="text-[10px] truncate max-w-full">
                            <span className="font-semibold block truncate">{fileItem.name}</span>
                            <span className="text-[#221E1F]/50 text-[9px]">{fileItem.size}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION D: Permissions and Consent */}
              <div className="bg-white p-5 rounded-2xl border border-[#B8973D]/25 space-y-3 text-xs">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#5A1827] pb-2 border-b border-[#B8973D]/20 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B8973D]" />
                  <span>4. Permissions & Ethical Consent</span>
                </h4>

                {/* Consent Checkbox 1 */}
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.confirmOwnership}
                    onChange={(e) => setFormData({ ...formData, confirmOwnership: e.target.checked })}
                    className="mt-0.5 accent-[#5A1827]"
                  />
                  <span className="text-[#221E1F]/80">
                    I confirm that I own the submitted media or have explicit permission from the rights holder or family custodians to share it for cultural documentation. *
                  </span>
                </label>
                {formErrors.confirmOwnership && (
                  <p className="text-[11px] text-rose-600 font-semibold pl-6">{formErrors.confirmOwnership}</p>
                )}

                {/* Consent Checkbox 2 */}
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="mt-0.5 accent-[#5A1827]"
                  />
                  <span className="text-[#221E1F]/80">
                    I agree to the educational, archival, and non-commercial preservation of this contribution on RIVA – The Living Culture Map. *
                  </span>
                </label>
                {formErrors.agreeTerms && (
                  <p className="text-[11px] text-rose-600 font-semibold pl-6">{formErrors.agreeTerms}</p>
                )}

                {/* Cultural Sensitivity Toggle */}
                <div className="mt-2 pt-3 border-t border-[#B8973D]/20 bg-[#FAF8F5] p-3 rounded-xl border">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isCulturallySensitive}
                      onChange={(e) => setFormData({ ...formData, isCulturallySensitive: e.target.checked })}
                      className="mt-0.5 accent-[#5A1827]"
                    />
                    <div>
                      <span className="font-semibold text-[#5A1827] block">
                        This contribution contains culturally sensitive, clan-restricted, or sacred knowledge.
                      </span>
                      <span className="text-[11px] text-[#221E1F]/65 font-light leading-relaxed block mt-0.5">
                        RIVA respects sacred protocols: restricted material will NOT be publicly displayed without explicit authorization from community custodians.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button & Cancellation */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-[11px] text-[#221E1F]/60">
                  * Marked fields are required for archival intake.
                </span>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="w-1/2 sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold text-[#221E1F]/70 hover:text-[#5A1827] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 sm:w-auto bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    {isSubmitting ? (
                      <span>Validating Archive Intake...</span>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-[#B8973D]" />
                        <span>Submit Contribution</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Submission Confirmation Receipt Modal */}
      {submissionReceipt && (
        <div className="fixed inset-0 z-[160] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-[#FAF8F5] text-[#221E1F] rounded-3xl border-2 border-[#B8973D]/60 max-w-lg w-full shadow-2xl p-6 sm:p-8 text-center animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-800 flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8" />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-0.5 rounded-full">
              Contribution Received & Staged
            </span>

            <h3 className="font-serif text-3xl font-bold text-[#5A1827] mt-2 mb-2">
              Thank You for Preserving Living Culture
            </h3>

            <p className="text-xs sm:text-sm text-[#221E1F]/75 font-light leading-relaxed mb-6">
              Your contribution for <strong>&ldquo;{submissionReceipt.title}&rdquo;</strong> has been assigned to our Thrissur editorial intake queue.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-white rounded-2xl p-4 border border-[#B8973D]/30 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between border-b border-[#B8973D]/15 pb-1.5">
                <span className="text-[#B8973D] font-medium">Tracking Ref Code:</span>
                <span className="font-mono font-bold text-[#5A1827]">{submissionReceipt.refId}</span>
              </div>
              <div className="flex justify-between border-b border-[#B8973D]/15 pb-1.5">
                <span className="text-[#B8973D] font-medium">Category:</span>
                <span className="font-semibold">{submissionReceipt.category}</span>
              </div>
              <div className="flex justify-between border-b border-[#B8973D]/15 pb-1.5">
                <span className="text-[#B8973D] font-medium">Locality:</span>
                <span className="font-semibold">{submissionReceipt.locality}</span>
              </div>
              <div className="flex justify-between border-b border-[#B8973D]/15 pb-1.5">
                <span className="text-[#B8973D] font-medium">Credited To:</span>
                <span className="font-semibold">{submissionReceipt.contributor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B8973D] font-medium">Archival Status:</span>
                <span className="text-amber-800 font-bold bg-amber-50 border border-amber-300 px-2 py-0.5 rounded text-[10px]">
                  Submitted &rarr; Under Review
                </span>
              </div>
            </div>

            {/* Technical Requirement Prototype Notice */}
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#B8973D]/30 text-[11px] text-[#221E1F]/65 mb-6 text-left">
              <strong className="text-[#5A1827]">Frontend Architecture Note:</strong> This submission has undergone client-side form validation and simulated intake staging. When connected to a production cloud backend, records will write securely to the RIVA moderation cluster.
            </div>

            <button
              onClick={handleResetForm}
              className="w-full bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] font-bold py-3 px-6 rounded-full text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Done & Return to Preservation Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
