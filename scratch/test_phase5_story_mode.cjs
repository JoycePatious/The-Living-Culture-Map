const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 RIVA PHASE 5: STORY MODE COMPREHENSIVE TEST SUITE');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    if (details) console.error(`   Details: ${details}`);
  }
}

// 1. Inspect data in discoveries.js
const discoveriesFilePath = path.join(__dirname, '../frontend/src/data/discoveries.js');
assert(fs.existsSync(discoveriesFilePath), 'discoveries.js exists');

const discoveriesContent = fs.readFileSync(discoveriesFilePath, 'utf8');

// Parse STORIES_DATA items from file
assert(discoveriesContent.includes('export const STORIES_DATA'), 'STORIES_DATA exported in discoveries.js');

// Check 3 featured stories
assert(discoveriesContent.includes('Pulikali – The Roar of Swaraj Round'), 'Story 1: Pulikali title configured');
assert(discoveriesContent.includes('75 seconds'), 'Story 1: 75 seconds duration configured');
assert(discoveriesContent.includes('scenesCount: 4'), 'Story 1: 4 scenes configured');

assert(discoveriesContent.includes('Thrissur Pooram – The 36-Hour Melam Symphony'), 'Story 2: Thrissur Pooram title configured');
assert(discoveriesContent.includes('90 seconds'), 'Story 2: 90 seconds duration configured');
assert(discoveriesContent.includes('scenesCount: 5'), 'Story 2: 5 scenes configured');

assert(discoveriesContent.includes('Vadakkumnathan – Geometry Without Nails'), 'Story 3: Vadakkumnathan title configured');
assert(discoveriesContent.includes('60 seconds'), 'Story 3: 60 seconds duration configured');
assert(discoveriesContent.includes('scenesCount: 3'), 'Story 3: 3 scenes configured');

// Check exact scene sequences:
// Pulikali:
assert(discoveriesContent.includes('Before the Roar'), 'Pulikali scene 1: "Before the Roar"');
assert(discoveriesContent.includes('The Transformation'), 'Pulikali scene 2: "The Transformation"');
assert(discoveriesContent.includes('The Rhythm'), 'Pulikali scene 3: "The Rhythm"');
assert(discoveriesContent.includes('Streets Come Alive'), 'Pulikali scene 4: "Streets Come Alive"');

// Check video-ready architecture fields:
assert(discoveriesContent.includes('video: null'), 'Video-ready architecture: video field supported');
assert(discoveriesContent.includes('narration:'), 'Video-ready architecture: narration field supported');
assert(discoveriesContent.includes('subtitle:'), 'Video-ready architecture: subtitle field supported');
assert(discoveriesContent.includes('mediaAttribution:'), 'Video-ready architecture: mediaAttribution field supported');
assert(discoveriesContent.includes('mediaLicense:'), 'Video-ready architecture: mediaLicense field supported');

// Pooram:
assert(discoveriesContent.includes('A Festival Begins'), 'Pooram scene 1: "A Festival Begins"');
assert(discoveriesContent.includes('The Gathering'), 'Pooram scene 2: "The Gathering"');
assert(discoveriesContent.includes('The Melam'), 'Pooram scene 3: "The Melam"');
assert(discoveriesContent.includes('The Grand Spectacle'), 'Pooram scene 4: "The Grand Spectacle"');
assert(discoveriesContent.includes('A Living Tradition'), 'Pooram scene 5: "A Living Tradition"');

// Vadakkumnathan:
assert(discoveriesContent.includes('A Temple Through Time'), 'Vadakkumnathan scene 1: "A Temple Through Time"');
assert(discoveriesContent.includes('Geometry Without Nails'), 'Vadakkumnathan scene 2: "Geometry Without Nails"');
assert(discoveriesContent.includes('A Legacy Preserved'), 'Vadakkumnathan scene 3: "A Legacy Preserved"');

// 2. Check photographic assets existence
const publicDir = path.join(__dirname, '../frontend/public');
const storyAssets = [
  'stories/story-1-pulikali.jpg',
  'stories/story-2-pooram.jpg',
  'stories/story-3-vadakkumnathan-timber.jpg',
  'discoveries/01-vadakkumnathan-temple.jpg',
  'discoveries/06-thrissur-pooram.jpg',
  'discoveries/09-pulikali.jpg',
  'kerala-festival-gathering.jpg',
  'kerala-temple-woodcraft.jpg'
];

storyAssets.forEach((asset) => {
  const fullPath = path.join(publicDir, asset);
  assert(fs.existsSync(fullPath), `Verified archival photograph exists: ${asset}`);
});

// 3. Check StoryModePage.jsx component
const storyModePagePath = path.join(__dirname, '../frontend/src/components/StoryModePage.jsx');
assert(fs.existsSync(storyModePagePath), 'StoryModePage.jsx exists');
const storyModePageContent = fs.readFileSync(storyModePagePath, 'utf8');
assert(storyModePageContent.includes('STORIES THAT KEEP CULTURE ALIVE'), 'StoryModePage has exact title: "STORIES THAT KEEP CULTURE ALIVE"');
assert(storyModePageContent.includes('Every place has a story. Every tradition carries a memory.'), 'StoryModePage has exact subtitle: "Every place has a story. Every tradition carries a memory."');
assert(storyModePageContent.includes('Upcoming Stories in Production'), 'StoryModePage has upcoming stories pipeline');

// 4. Check CinematicStoryPlayer.jsx component
const playerPath = path.join(__dirname, '../frontend/src/components/CinematicStoryPlayer.jsx');
assert(fs.existsSync(playerPath), 'CinematicStoryPlayer.jsx exists');
const playerContent = fs.readFileSync(playerPath, 'utf8');
assert(playerContent.includes('sceneProgress'), 'CinematicStoryPlayer tracks sceneProgress');
assert(playerContent.includes('handleNextScene'), 'CinematicStoryPlayer has handleNextScene');
assert(playerContent.includes('handlePrevScene'), 'CinematicStoryPlayer has handlePrevScene');
assert(playerContent.includes('handleJumpToScene'), 'CinematicStoryPlayer has handleJumpToScene');
assert(playerContent.includes('Explore Full Archival Record'), 'CinematicStoryPlayer links to discovery detail record');
assert(playerContent.includes('Sources & Licensing Credits'), 'CinematicStoryPlayer includes photograph licensing credits drawer');
assert(playerContent.includes('playTransitionChime'), 'CinematicStoryPlayer includes ambient chime feedback');
assert(playerContent.includes('showSubtitles'), 'CinematicStoryPlayer includes subtitle toggle');
assert(playerContent.includes('animate-kenburns'), 'CinematicStoryPlayer uses Ken Burns documentary pan & zoom');

// 5. Check App.jsx wiring & hash routing
const appPath = path.join(__dirname, '../frontend/src/App.jsx');
const appContent = fs.readFileSync(appPath, 'utf8');
assert(appContent.includes('#story-'), 'App.jsx supports #story-* direct hash routing');
assert(appContent.includes('#stories') || appContent.includes('#story-mode'), 'App.jsx supports #stories hash routing');
assert(appContent.includes('StoryModePage'), 'App.jsx renders StoryModePage');
assert(appContent.includes('CinematicStoryPlayer'), 'App.jsx renders CinematicStoryPlayer');

// 6. Check DiscoveryDetailPage integration
const detailPath = path.join(__dirname, '../frontend/src/components/DiscoveryDetailPage.jsx');
const detailContent = fs.readFileSync(detailPath, 'utf8');
assert(detailContent.includes('matchingStory'), 'DiscoveryDetailPage detects matchingStory');
assert(detailContent.includes('Story Mode In Production'), 'DiscoveryDetailPage displays coming-soon notice for non-featured discoveries');
assert(detailContent.includes('Launch Story'), 'DiscoveryDetailPage launches featured stories');

// 7. Check Navbar integration
const navbarPath = path.join(__dirname, '../frontend/src/components/Navbar.jsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');
assert(navbarContent.includes('onNavigateStories'), 'Navbar accepts onNavigateStories');
assert(navbarContent.includes('isStoriesView'), 'Navbar tracks isStoriesView active state');

console.log('\n====================================================');
console.log(`📊 RESULTS: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}

