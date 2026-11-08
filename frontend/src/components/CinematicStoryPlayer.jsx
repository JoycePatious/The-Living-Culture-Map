import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  SkipBackIcon,
  XIcon,
  Volume2Icon,
  VolumeXIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
  CompassIcon,
  BookOpenIcon,
  InfoIcon,
  SparklesIcon
} from './Icons';
import { STORIES_DATA } from '../data/discoveries';

export default function CinematicStoryPlayer({
  story,
  onClose,
  onSelectDiscovery,
  onSelectStory
}) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100 percentage of current scene
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showCredits, setShowCredits] = useState(false);
  const [showSceneList, setShowSceneList] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Audio Context Ref for subtle ambient sound feedback
  const audioCtxRef = useRef(null);

  // Current active scene
  const scenes = story?.scenes || [];
  const currentScene = scenes[currentSceneIndex] || scenes[0];
  const totalScenes = scenes.length;

  // Scene duration calculation based on total story duration
  // E.g. 75s / 4 scenes = ~18.75s, 90s / 5 scenes = 18s, 60s / 3 scenes = 20s
  const parseTotalDuration = (durationStr) => {
    const match = durationStr?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 75;
  };
  const totalSeconds = parseTotalDuration(story?.duration);
  const sceneDurationSeconds = totalScenes > 0 ? totalSeconds / totalScenes : 18;
  const SCENE_DURATION_MS = sceneDurationSeconds * 1000;

  // Gentle ambient chime on scene transition (Web Audio API)
  const playTransitionChime = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioCtxRef.current = new AudioContext();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        // Traditional temple bell pentatonic frequency (C#5 or E5)
        osc.frequency.setValueAtTime(554.37, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(277.18, audioCtxRef.current.currentTime + 0.8);
        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.85);
      }
    } catch {
      // AudioContext unavailable or blocked by browser policy
    }
  }, [isMuted]);

  // Next Scene Handler
  const handleNextScene = useCallback(() => {
    if (currentSceneIndex < totalScenes - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
      setSceneProgress(0);
      playTransitionChime();
    } else {
      // End of story
      setSceneProgress(100);
      setIsPlaying(false);
      setIsComplete(true);
    }
  }, [currentSceneIndex, totalScenes, playTransitionChime]);

  // Previous Scene Handler
  const handlePrevScene = useCallback(() => {
    setIsComplete(false);
    if (sceneProgress > 15) {
      // If more than 15% through current scene, restart current scene
      setSceneProgress(0);
    } else if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
      setSceneProgress(0);
      playTransitionChime();
    }
  }, [sceneProgress, currentSceneIndex, playTransitionChime]);

  // Jump to specific scene
  const handleJumpToScene = useCallback((index) => {
    if (index >= 0 && index < totalScenes) {
      setCurrentSceneIndex(index);
      setSceneProgress(0);
      setIsComplete(false);
      setIsPlaying(true);
      setShowSceneList(false);
      playTransitionChime();
    }
  }, [totalScenes, playTransitionChime]);

  // Toggle Play / Pause
  const handleTogglePlay = useCallback(() => {
    if (isComplete) {
      // Replay from beginning
      setCurrentSceneIndex(0);
      setSceneProgress(0);
      setIsComplete(false);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [isComplete]);

  // Timer interval for auto-advance
  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const intervalTime = 60; // ms per tick
    const progressIncrement = (intervalTime / SCENE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setSceneProgress((prev) => {
        const next = prev + progressIncrement;
        if (next >= 100) {
          handleNextScene();
          return 0;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, isComplete, SCENE_DURATION_MS, handleNextScene]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextScene();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevScene();
      } else if (e.key.toLowerCase() === 'm') {
        setIsMuted((prev) => !prev);
      } else if (e.key.toLowerCase() === 'c') {
        setShowCredits((prev) => !prev);
      } else if (e.key.toLowerCase() === 's') {
        setShowSubtitles((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleTogglePlay, handleNextScene, handlePrevScene]);

  if (!story) return null;

  // Next and Previous Stories in curated catalog
  const currentStoryIdx = STORIES_DATA.findIndex((s) => s.id === story.id);
  const nextStory = STORIES_DATA[(currentStoryIdx + 1) % STORIES_DATA.length];
  const prevStory =
    STORIES_DATA[(currentStoryIdx - 1 + STORIES_DATA.length) % STORIES_DATA.length];

  return (
    <div className="fixed inset-0 z-[120] bg-black text-[#FAF8F5] flex flex-col font-sans select-none overflow-hidden animate-fadeIn">
      {/* 1. Large Background Photographic/Video Canvas with Subtle Ken Burns Documentary Pan & Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {currentScene?.video ? (
          <video
            key={`${story.id}-${currentSceneIndex}-video`}
            src={currentScene.video}
            autoPlay
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover object-center"
          />
        ) : currentScene?.image ? (
          <img
            key={`${story.id}-${currentSceneIndex}-img`}
            src={currentScene.image}
            alt={currentScene.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/kerala-temple-woodcraft.jpg';
            }}
            className={`w-full h-full object-cover object-center transition-all duration-1000 ${
              isPlaying
                ? currentSceneIndex % 2 === 0
                  ? 'animate-kenburns-zoom'
                  : 'animate-kenburns-pan'
                : 'scale-100'
            }`}
          />
        ) : null}

        {/* Cinematic Vignette and Darkening Gradients for High Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none" />
      </div>

      {/* 2. Top Navigation & Story Metadata Bar */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#5A1827] border border-[#B8973D]/60 flex items-center justify-center text-[#B8973D] shadow-md">
            <SparklesIcon className="w-4 h-4 text-[#B8973D]" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
              <span className="bg-[#B8973D]/20 px-2 py-0.5 rounded text-[#D4B257] border border-[#B8973D]/30">
                {story.category}
              </span>
              <span>•</span>
              <span>{story.duration}</span>
              <span>•</span>
              <span className="text-[#FAF8F5]/80">
                Scene {currentSceneIndex + 1} of {totalScenes}
              </span>
            </div>
            <h1 className="font-serif text-lg md:text-2xl font-bold text-[#FAF8F5] tracking-wide truncate max-w-sm sm:max-w-md md:max-w-xl">
              {story.title}
            </h1>
          </div>
        </div>

        {/* Action Controls & Close */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Subtitles (CC) Toggle */}
          <button
            onClick={() => setShowSubtitles(!showSubtitles)}
            title={showSubtitles ? 'Hide Subtitles (S)' : 'Show Subtitles (S)'}
            className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border transition-all cursor-pointer ${
              showSubtitles
                ? 'bg-[#B8973D] text-[#3F101B] border-[#B8973D]'
                : 'bg-white/10 border-white/20 text-[#FAF8F5]/60 hover:text-white'
            }`}
          >
            CC
          </button>

          {/* Audio Chime Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute Ambient Bell Chimes (M)' : 'Mute Ambient Bell Chimes (M)'}
            className={`p-2.5 rounded-full border transition-all cursor-pointer ${
              isMuted
                ? 'bg-white/10 border-white/20 text-white/50 hover:text-white'
                : 'bg-[#B8973D]/20 border-[#B8973D]/50 text-[#D4B257] hover:bg-[#B8973D]/30'
            }`}
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeXIcon className="w-4 h-4" /> : <Volume2Icon className="w-4 h-4" />}
          </button>

          {/* Photographic Credits Button */}
          <button
            onClick={() => setShowCredits(!showCredits)}
            title="View Photographer & Licensing Credits (C)"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer hidden sm:flex items-center space-x-1.5 ${
              showCredits
                ? 'bg-[#B8973D] text-[#3F101B] border-[#B8973D]'
                : 'bg-white/10 border-white/20 text-[#FAF8F5]/80 hover:bg-white/20'
            }`}
          >
            <ShieldCheckIcon className="w-3.5 h-3.5 text-[#B8973D]" />
            <span>Licensing Credits</span>
          </button>

          {/* Scene List Selector Drawer Toggle */}
          <button
            onClick={() => setShowSceneList(!showSceneList)}
            title="Browse all scenes"
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-[#FAF8F5]/80 transition-all cursor-pointer hidden md:flex items-center space-x-1.5"
          >
            <BookOpenIcon className="w-3.5 h-3.5 text-[#B8973D]" />
            <span>Scenes ({totalScenes})</span>
          </button>

          {/* Exit / Close Player */}
          <button
            onClick={onClose}
            title="Exit Story Mode (Esc)"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#5A1827] border border-white/20 hover:border-[#B8973D] text-[#FAF8F5] flex items-center justify-center transition-all cursor-pointer shadow-md"
            aria-label="Close story player"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 3. Segmented Progress Bar (Shows All Scenes & Real-time Progress) */}
      <div className="relative z-20 px-6 pt-2 pb-1 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center space-x-1.5 sm:space-x-2">
          {scenes.map((sc, idx) => {
            const isPast = idx < currentSceneIndex;
            const isCurrent = idx === currentSceneIndex;
            const fillWidth = isPast ? 100 : isCurrent ? sceneProgress : 0;

            return (
              <button
                key={idx}
                onClick={() => handleJumpToScene(idx)}
                title={`Jump to Scene ${idx + 1}: ${sc.title}`}
                className="group relative flex-1 h-2 sm:h-2.5 bg-white/20 hover:bg-white/30 rounded-full overflow-hidden transition-all cursor-pointer focus:outline-none"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#B8973D] to-[#D4B257] transition-all duration-75"
                  style={{ width: `${fillWidth}%` }}
                />
              </button>
            );
          })}
        </div>

        {/* Scene Labels Row */}
        <div className="max-w-5xl mx-auto flex items-center justify-between text-[11px] text-[#FAF8F5]/60 mt-1.5 px-1 font-mono">
          <span>{currentScene?.time || '00:00'}</span>
          <span className="text-[#D4B257] font-sans font-bold">
            Scene {currentSceneIndex + 1} of {totalScenes}: {currentScene?.title}
          </span>
          <span>{story.duration}</span>
        </div>
      </div>

      {/* 4. Center Interactive Area / Story Completed Celebration Dialog */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-4 overflow-y-auto">
        {isComplete ? (
          /* Completion Celebration Card */
          <div className="bg-[#3F101B]/95 border-2 border-[#B8973D]/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl backdrop-blur-xl animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-[#B8973D]/20 border border-[#B8973D] text-[#D4B257] mx-auto flex items-center justify-center mb-4">
              <SparklesIcon className="w-8 h-8 text-[#D4B257]" />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
              Story Completed
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#FAF8F5] mt-1 mb-3">
              {story.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/80 leading-relaxed font-light mb-6">
              You have experienced all {totalScenes} archival scenes documenting this cultural tradition of Thrissur.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Explore Archival Record on Discovery Detail Page */}
              <button
                onClick={() => {
                  onClose();
                  if (onSelectDiscovery) {
                    onSelectDiscovery(story.discoveryId);
                  }
                }}
                className="w-full bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] font-bold py-3 px-6 rounded-full text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CompassIcon className="w-4 h-4 text-[#3F101B]" />
                <span>Explore Full Archival Record</span>
                <span className="font-serif text-sm">&rarr;</span>
              </button>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* Replay Current Story */}
                <button
                  onClick={handleTogglePlay}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-[#FAF8F5] py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Replay Story
                </button>

                {/* Next Story in Series */}
                <button
                  onClick={() => {
                    if (onSelectStory && nextStory) {
                      onSelectStory(nextStory);
                    }
                  }}
                  className="bg-[#5A1827] hover:bg-[#7A2236] border border-[#B8973D]/50 text-[#FAF8F5] py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer truncate"
                >
                  Next Story &rarr;
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Main Scene Narration Card */
          <div className="max-w-3xl w-full">
            <div className="bg-[#3F101B]/85 hover:bg-[#3F101B]/95 border border-[#B8973D]/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all">
              {/* Scene Number & Timing Badge */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#B8973D]/20">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#B8973D] animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8973D]">
                    Scene 0{currentSceneIndex + 1} • {currentScene?.time}
                  </span>
                </div>
                <span className="text-[10px] text-[#FAF8F5]/60 font-mono">
                  {Math.round(sceneProgress)}%
                </span>
              </div>

              {/* Scene Title */}
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#FAF8F5] leading-tight mb-3">
                {currentScene?.title}
              </h2>

              {/* Scene Narration Script */}
              <p className="text-sm sm:text-base md:text-lg text-[#FAF8F5]/90 font-light leading-relaxed mb-4">
                {currentScene?.desc}
              </p>

              {/* Photographic Caption / Archival Context */}
              {currentScene?.caption && (
                <div className="bg-black/40 border border-white/10 rounded-2xl p-3 text-xs text-[#FAF8F5]/70 flex items-start space-x-2 font-light italic">
                  <InfoIcon className="w-4 h-4 text-[#B8973D] shrink-0 mt-0.5" />
                  <span>{currentScene.caption}</span>
                </div>
              )}

              {/* Quick Jump to Discovery Record */}
              <div className="mt-5 pt-3 border-t border-[#B8973D]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[#B8973D] text-[11px] font-semibold flex items-center space-x-1">
                  <SparklesIcon className="w-3.5 h-3.5 text-[#B8973D]" />
                  <span>Press Space to {isPlaying ? 'Pause' : 'Resume'} • Arrow keys to jump</span>
                </span>

                <button
                  onClick={() => {
                    onClose();
                    if (onSelectDiscovery) {
                      onSelectDiscovery(story.discoveryId);
                    }
                  }}
                  className="text-xs font-bold text-[#D4B257] hover:text-[#FAF8F5] underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>Explore Archival Record</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Subtitle / Narration Banner (Accessible & Toggleable) */}
      {showSubtitles && (currentScene?.subtitle || currentScene?.narration) && !isComplete && (
        <div className="relative z-20 px-6 pb-2 flex justify-center pointer-events-none">
          <div className="bg-black/85 backdrop-blur-md border border-[#B8973D]/40 rounded-full px-5 py-2 max-w-2xl text-center shadow-lg pointer-events-auto">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4B257] mr-2">
              Subtitle:
            </span>
            <span className="text-xs sm:text-sm text-[#FAF8F5] font-light leading-relaxed">
              {currentScene.subtitle || currentScene.narration}
            </span>
          </div>
        </div>
      )}

      {/* 5. Bottom Media Controls Bar */}
      <footer className="relative z-20 px-6 py-4 bg-gradient-to-t from-black via-black/90 to-transparent shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Previous Story Shortcut */}
          <div className="hidden sm:flex items-center space-x-2">
            {prevStory && onSelectStory && (
              <button
                onClick={() => onSelectStory(prevStory)}
                className="text-xs text-[#FAF8F5]/60 hover:text-[#D4B257] flex items-center space-x-1 cursor-pointer transition-colors"
                title={`Previous Story: ${prevStory.title}`}
              >
                <span>&larr;</span>
                <span className="truncate max-w-[120px]">{prevStory.category}</span>
              </button>
            )}
          </div>

          {/* Center: Playback Controls (Prev, Play/Pause, Next) */}
          <div className="flex items-center space-x-4 mx-auto">
            {/* Previous Scene Button */}
            <button
              onClick={handlePrevScene}
              disabled={currentSceneIndex === 0 && sceneProgress <= 5}
              title="Previous Scene (Left Arrow)"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-[#FAF8F5] flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label="Previous scene"
            >
              <SkipBackIcon className="w-4 h-4" />
            </button>

            {/* Play / Pause Toggle Button */}
            <button
              onClick={handleTogglePlay}
              title={isPlaying ? 'Pause Narration (Space)' : 'Play Narration (Space)'}
              className="w-14 h-14 rounded-full bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95"
              aria-label={isPlaying ? 'Pause story' : 'Play story'}
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6 text-[#3F101B]" />
              ) : (
                <PlayIcon className="w-6 h-6 text-[#3F101B] ml-0.5" />
              )}
            </button>

            {/* Next Scene Button */}
            <button
              onClick={handleNextScene}
              title="Next Scene (Right Arrow)"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF8F5] flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label="Next scene"
            >
              <SkipForwardIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Next Story Shortcut */}
          <div className="hidden sm:flex items-center space-x-2">
            {nextStory && onSelectStory && (
              <button
                onClick={() => onSelectStory(nextStory)}
                className="text-xs text-[#FAF8F5]/60 hover:text-[#D4B257] flex items-center space-x-1 cursor-pointer transition-colors"
                title={`Next Story: ${nextStory.title}`}
              >
                <span className="truncate max-w-[120px]">{nextStory.category}</span>
                <span>&rarr;</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* 6. Photographic Sources & Licensing Credits Modal / Drawer */}
      {showCredits && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#3F101B] border-2 border-[#B8973D]/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-left shadow-2xl relative">
            <button
              onClick={() => setShowCredits(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              aria-label="Close credits dialog"
            >
              <XIcon className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-wider text-[#B8973D] mb-2">
              <ShieldCheckIcon className="w-4 h-4 text-[#B8973D]" />
              <span>Photograph Archival Audit</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#FAF8F5] mb-4">
              Sources & Licensing Credits
            </h3>

            <div className="space-y-3 bg-black/40 rounded-2xl p-4 border border-white/10 text-xs text-[#FAF8F5]/80 mb-6">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#B8973D]">Story Feature:</span>
                <span className="font-semibold text-right">{story.title}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#B8973D]">Active Scene:</span>
                <span className="font-semibold text-right">Scene {currentSceneIndex + 1}: {currentScene?.title}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#B8973D]">Scene Photographer:</span>
                <span className="font-semibold text-right">{currentScene?.mediaAttribution || story.photographer}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#B8973D]">Archive Source:</span>
                <a
                  href={currentScene?.mediaSourceUrl || story.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4B257] hover:underline flex items-center space-x-1"
                >
                  <span>{story.sourceName}</span>
                  <ExternalLinkIcon className="w-3 h-3 ml-0.5" />
                </a>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#B8973D]">License:</span>
                <a
                  href={story.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>{currentScene?.mediaLicense || story.license}</span>
                  <ExternalLinkIcon className="w-3 h-3 ml-0.5" />
                </a>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#B8973D]">Commercial Reuse:</span>
                <span className="text-emerald-400 font-bold">{story.commercialUse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B8973D]">Attribution:</span>
                <span className="text-right text-[11px] text-[#FAF8F5]/70">
                  {currentScene?.mediaAttribution || story.attribution}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowCredits(false)}
              className="w-full bg-[#B8973D] hover:bg-[#D4B257] text-[#3F101B] font-bold py-2.5 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Back to Story
            </button>
          </div>
        </div>
      )}

      {/* 7. Scene Selector Drawer / Modal */}
      {showSceneList && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#3F101B] border-2 border-[#B8973D]/60 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-left shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowSceneList(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              aria-label="Close scenes list"
            >
              <XIcon className="w-4 h-4" />
            </button>

            <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8973D]">
              Scene Directory
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#FAF8F5] mb-4">
              All Scenes in {story.title}
            </h3>

            <div className="space-y-3 mb-6">
              {scenes.map((sc, idx) => {
                const isSelected = idx === currentSceneIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => handleJumpToScene(idx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#B8973D]/25 border-[#B8973D] text-[#FAF8F5]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#FAF8F5]/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? 'bg-[#B8973D] text-[#3F101B]'
                            : 'bg-white/10 text-[#FAF8F5]'
                        }`}
                      >
                        0{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#FAF8F5]">
                          {sc.title}
                        </h4>
                        <span className="text-[11px] text-[#D4B257] font-mono">
                          {sc.time}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-xs font-bold text-[#D4B257] uppercase tracking-wider">
                        Now Playing
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowSceneList(false)}
              className="w-full bg-white/10 hover:bg-white/20 text-[#FAF8F5] font-bold py-2.5 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Close Scene Directory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
