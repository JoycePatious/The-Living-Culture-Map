import { STORIES_DATA } from '../data/discoveries';
import { PlayIcon, BookOpenIcon } from './Icons';

export default function StoryModeSection({ onOpenStory, onNavigateStories }) {
  return (
    <section
      id="story-mode"
      className="py-24 bg-gradient-to-r from-[#5A1827] via-[#4A1420] to-[#3F101B] text-[#FAF8F5] relative overflow-hidden"
    >
      {/* Decorative Gold Rings & Light Flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#B8973D]/30 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#B8973D] font-bold">
            Immersive Storytelling
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-bold mt-2 mb-6 text-[#FAF8F5] leading-tight">
            Story Mode: Pulikali, Pooram & Architecture
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#FAF8F5]/80 mb-10 leading-relaxed font-light">
            Dive deep into 60-90 second cinematic scene breakdowns, narration scripts, and historical backstories for Thrissur's premier cultural icons.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenStory(STORIES_DATA[0])}
              className="bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] font-bold px-8 py-4 rounded-full text-xs md:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95 cursor-pointer inline-flex items-center space-x-2"
            >
              <PlayIcon className="w-4 h-4 text-[#3F101B]" />
              <span>Watch Featured: Pulikali</span>
            </button>
            {onNavigateStories && (
              <button
                onClick={onNavigateStories}
                className="bg-white/10 hover:bg-white/20 border border-[#B8973D]/40 text-[#FAF8F5] font-bold px-7 py-4 rounded-full text-xs md:text-sm uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95 cursor-pointer inline-flex items-center space-x-2"
              >
                <BookOpenIcon className="w-4 h-4 text-[#D4B257]" />
                <span>Explore Story Mode Page</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Story Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {STORIES_DATA.map((story) => (
            <div
              key={story.id}
              onClick={() => onOpenStory(story)}
              className="group cursor-pointer rounded-2xl bg-white/5 border border-[#B8973D]/30 hover:border-[#B8973D] p-5 transition-all duration-300 hover:bg-white/10 backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 rounded-xl overflow-hidden mb-4 border border-[#B8973D]/20">
                  <img
                    src={story.heroImage}
                    alt={story.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-wider bg-[#5A1827]/90 text-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#B8973D]/40">
                    {story.duration}
                  </span>
                  <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[#B8973D] text-[#3F101B] flex items-center justify-center shadow-md">
                      <PlayIcon className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                    <span className="text-xs text-[#FAF8F5] font-semibold">
                      {story.scenesCount} Curated Scenes
                    </span>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold text-[#B8973D] tracking-widest">
                  {story.category}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#FAF8F5] mt-1 mb-2 group-hover:text-[#D4B257] transition-colors">
                  {story.title}
                </h3>
                <p className="text-xs text-[#FAF8F5]/70 leading-relaxed line-clamp-2">
                  {story.summary}
                </p>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#FAF8F5]/60">
                  <span className="truncate max-w-[160px]">Photo: {story.photographer}</span>
                  <span className="text-[#D4B257] font-semibold">{story.license}</span>
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#D4B257] font-semibold">
                <span>View Scene Breakdown</span>
                <span>&rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
