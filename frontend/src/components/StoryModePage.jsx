import { useState } from 'react';
import { STORIES_DATA, DISCOVERIES_DATA } from '../data/discoveries';
import {
  PlayIcon,
  ArrowLeftIcon,
  CompassIcon,
  ChevronRightIcon,
  SparklesIcon,
  MapPinIcon
} from './Icons';

export default function StoryModePage({
  onOpenStory,
  onSelectDiscovery,
  onNavigateHome,
  onNavigateMap
}) {
  const [selectedStoryNotice, setSelectedStoryNotice] = useState(null);

  // Discoveries without interactive stories yet (In Production)
  const upcomingStories = [
    {
      id: 10,
      name: 'Kummattikali',
      locality: 'Palakkal, Thrissur',
      category: 'Art Form',
      expectedTitle: 'Kummattikali: Faces of the Grass Gods',
      duration: '45 seconds (In Production)',
      desc: 'Decoding the sacred Avani Avittom mask rituals and grass-skirt choreography.',
      image: '/discoveries/10-kummattikali.jpg'
    },
    {
      id: 11,
      name: 'Tholpavakoothu',
      locality: 'Koonathara, Palakkad-Thrissur border',
      category: 'Craft & Performance',
      expectedTitle: 'Tholpavakoothu: Shadow Theatre of the River',
      duration: '60 seconds (In Production)',
      desc: 'The Pulavar lineage chanting Kamba Ramayana behind oil-lit cotton screens.',
      image: '/discoveries/11-tholpavakoothu.jpg'
    },
    {
      id: 13,
      name: 'Nadavaramba Bell-Metal Craft',
      locality: 'Nadavaramba, Irinjalakuda',
      category: 'Craft',
      expectedTitle: 'Nadavaramba: The Lost-Wax Alchemists',
      duration: '50 seconds (In Production)',
      desc: 'Generational bronze founders tuning acoustic bells for temple sanctums.',
      image: '/discoveries/13-nadavaramba-bell-metal.jpg'
    },
    {
      id: 14,
      name: 'Cherpu Wooden Elephant Craft',
      locality: 'Cherpu, Thrissur',
      category: 'Craft',
      expectedTitle: 'Cherpu: Chiseling the Living Pachyderm',
      duration: '45 seconds (In Production)',
      desc: 'Master woodcarvers shaping teak and rosewood elephants with millimeter anatomy.',
      image: '/discoveries/14-cherpu-wooden-elephants.jpg'
    }
  ];

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
              <button
                onClick={() => onNavigateHome('discoveries')}
                className="hover:text-[#5A1827] transition-colors cursor-pointer"
              >
                Discoveries
              </button>
              <span>/</span>
              <span className="text-[#5A1827] font-semibold">Story Mode</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
              Immersive Archival Storytelling
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#5A1827] tracking-tight mt-1">
              STORIES THAT KEEP CULTURE ALIVE
            </h1>
            <p className="text-sm sm:text-base text-[#221E1F]/75 mt-2 max-w-2xl font-light italic">
              Every place has a story. Every tradition carries a memory.
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
          </div>
        </div>
      </div>

      {/* 2. Editorial Introduction Narrative Banner */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-gradient-to-r from-[#5A1827] via-[#4A1521] to-[#3F101B] rounded-3xl p-6 sm:p-10 text-[#FAF8F5] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#B8973D]/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4B257] mb-4 backdrop-blur-sm">
              <SparklesIcon className="w-3.5 h-3.5 text-[#D4B257]" />
              <span>Cinematic Visual Story Player</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-snug mb-3">
              Explore Thrissur&apos;s Living Traditions Scene by Scene
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/85 leading-relaxed font-light mb-6">
              Unlike static catalog entries, Story Mode unpacks cultural heritage into time-coded narrative progressions. Experience early-morning pigment preparation, the thunderous acceleration of Ilanjithara Melam, and the mortar-free timber joints of centuries-old sanctuaries.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenStory(STORIES_DATA[0])}
                className="bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-lg active:scale-95 cursor-pointer inline-flex items-center space-x-2"
              >
                <PlayIcon className="w-4 h-4 text-[#3F101B]" />
                <span>Watch Featured: Pulikali ({STORIES_DATA[0].duration})</span>
              </button>
              <span className="text-xs text-[#FAF8F5]/60 pl-2">
                3 Featured Story Breakdowns • 12 Curated Scenes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The Three Featured Story Experiences */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex items-center justify-between mb-8 pb-2 border-b border-[#B8973D]/25">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
              Featured Stories
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A1827]">
              Three Signature Narratives
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#5A1827] bg-[#5A1827]/10 px-3 py-1 rounded-full border border-[#5A1827]/20">
            3 Full Experiences
          </span>
        </div>

        <div className="space-y-10">
          {STORIES_DATA.map((story, index) => {
            const isReversed = index % 2 === 1;
            const relatedDiscovery = DISCOVERIES_DATA.find((d) => d.id === story.discoveryId);

            return (
              <article
                key={story.id}
                className={`bg-white rounded-3xl border-2 border-[#B8973D]/30 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col ${
                  isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } group`}
              >
                {/* Visual Media Showcase */}
                <div className="lg:w-1/2 relative min-h-[300px] sm:min-h-[380px] bg-[#221E1F] overflow-hidden">
                  <img
                    src={story.heroImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="bg-[#5A1827]/95 text-[#FAF8F5] text-xs uppercase font-bold px-3 py-1 rounded-full border border-[#B8973D]/40 backdrop-blur-md">
                      {story.category}
                    </span>
                    <span className="bg-black/60 text-[#D4B257] font-mono font-bold text-xs px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
                      {story.duration}
                    </span>
                  </div>

                  {/* Play Launcher Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => onOpenStory(story)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 cursor-pointer border-2 border-white/80"
                      title="Launch Story Experience"
                      aria-label={`Play story: ${story.title}`}
                    >
                      <PlayIcon className="w-8 h-8 ml-1 text-[#3F101B]" />
                    </button>
                  </div>

                  {/* Bottom Photo Attribution */}
                  <div className="absolute bottom-3 left-4 right-4 text-[10px] text-white/80 flex items-center justify-between">
                    <span className="truncate max-w-[220px]">Photo: {story.photographer}</span>
                    <span className="text-[#D4B257] font-semibold">{story.license}</span>
                  </div>
                </div>

                {/* Content & Scene Breakdown Column */}
                <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-[#B8973D] mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#5A1827]" />
                      <span>{story.scenesCount} Sequential Scenes</span>
                      <span>•</span>
                      <span>{story.duration}</span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#5A1827] leading-tight mb-3 group-hover:text-[#7A2236] transition-colors">
                      {story.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#221E1F]/80 leading-relaxed font-light mb-6">
                      {story.description}
                    </p>

                    {/* Scene Breakdown Pills */}
                    <div className="mb-6 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8973D] block mb-2">
                        Scene Progression:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {story.scenes.map((scene) => (
                          <div
                            key={scene.sceneNum}
                            className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#B8973D]/20 text-xs flex items-start space-x-2"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#5A1827] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {scene.sceneNum}
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-[#5A1827] block truncate">
                                {scene.title}
                              </span>
                              <span className="text-[10px] font-mono text-[#B8973D]">
                                {scene.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-[#B8973D]/20 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => onOpenStory(story)}
                      className="bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center space-x-2"
                    >
                      <PlayIcon className="w-3.5 h-3.5" />
                      <span>Launch Story Experience</span>
                      <span>&rarr;</span>
                    </button>

                    {relatedDiscovery && (
                      <button
                        onClick={() => onSelectDiscovery(relatedDiscovery.id)}
                        className="text-xs font-bold text-[#B8973D] hover:text-[#5A1827] underline transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <span>View Discovery Record</span>
                        <ChevronRightIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Upcoming Archival Stories (Coming Soon Pipeline) */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="bg-white rounded-3xl border-2 border-[#B8973D]/30 p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#B8973D]/20">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
                Archival Pipeline
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#5A1827]">
                Upcoming Stories in Production
              </h3>
            </div>
            <span className="text-xs text-[#221E1F]/60">
              Expanding Thrissur&apos;s living oral and visual archive
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingStories.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  setSelectedStoryNotice({
                    name: item.name,
                    title: item.expectedTitle,
                    desc: item.desc,
                    discoveryId: item.id
                  })
                }
                className="bg-[#FAF8F5] rounded-2xl border border-[#B8973D]/25 p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <div>
                  <div className="relative h-32 rounded-xl overflow-hidden mb-3 bg-[#221E1F]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-[#5A1827]/90 text-white px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="absolute bottom-2 right-2 text-[9px] font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-full border border-amber-400/40">
                      In Production
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-[#5A1827] group-hover:text-[#7A2236] transition-colors leading-snug mb-1">
                    {item.expectedTitle}
                  </h4>
                  <p className="text-[11px] text-[#221E1F]/65 flex items-center mb-2">
                    <MapPinIcon className="w-3 h-3 text-[#B8973D] mr-1 shrink-0" />
                    <span className="truncate">{item.locality}</span>
                  </p>
                  <p className="text-xs text-[#221E1F]/75 font-light leading-relaxed mb-4 line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#B8973D]/20 flex items-center justify-between text-[11px] font-semibold text-[#5A1827]">
                  <span className="text-amber-800 font-medium">Coming Soon</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Notice Modal */}
      {selectedStoryNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border-2 border-[#B8973D]/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-left animate-fadeIn">
            <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-wider text-[#B8973D] mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Archival Story In Production</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#5A1827] mb-2">
              {selectedStoryNotice.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#221E1F]/80 leading-relaxed font-light mb-6">
              Field documentation and master artisan interviews for <strong>{selectedStoryNotice.name}</strong> are currently being archived into cinematic scene breakdowns. In the meantime, you can inspect the full verified historical record.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#B8973D]/20">
              <button
                onClick={() => setSelectedStoryNotice(null)}
                className="text-xs text-[#221E1F]/60 hover:text-[#5A1827] px-4 py-2 font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedStoryNotice(null);
                  onSelectDiscovery(selectedStoryNotice.discoveryId);
                }}
                className="bg-[#5A1827] hover:bg-[#7A2236] text-[#FAF8F5] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                View Archival Record &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
