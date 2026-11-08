const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('  RIVA – PHASE 7: FINAL COMPREHENSIVE INTEGRATION & TEST SUITE  ');
console.log('================================================================\n');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const srcDir = path.join(frontendDir, 'src');
const componentsDir = path.join(srcDir, 'components');
const publicDir = path.join(frontendDir, 'public');

let totalTests = 0;
let passedTests = 0;

function runTest(testName, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`[PASS] ${testName}`);
  } catch (err) {
    console.error(`[FAIL] ${testName}: ${err.message}`);
    throw err;
  }
}

// -------------------------------------------------------------
// TEST 1: Navigation Integration & Browser Hash Routing
// -------------------------------------------------------------
runTest('1. App.jsx Hash Routing handles all 6 phases and browser history', () => {
  const appPath = path.join(srcDir, 'App.jsx');
  assert(fs.existsSync(appPath), 'App.jsx must exist');
  const appCode = fs.readFileSync(appPath, 'utf-8');

  // Verify routes supported
  const requiredRoutes = [
    '#discovery-',
    '#map',
    '#magic-lens',
    '#stories',
    '#story-mode',
    '#story-',
    '#preservation',
    '#community'
  ];
  for (const route of requiredRoutes) {
    assert(appCode.includes(route), `App.jsx must parse hash pattern: ${route}`);
  }

  // Verify view states
  assert(appCode.includes('isMapView'), 'App tracks isMapView');
  assert(appCode.includes('isStoriesView'), 'App tracks isStoriesView');
  assert(appCode.includes('isPreservationView'), 'App tracks isPreservationView');
  assert(appCode.includes('isMagicLensOpen'), 'App tracks isMagicLensOpen');
  assert(appCode.includes('activeStory'), 'App tracks activeStory');
  assert(appCode.includes('activeDiscovery'), 'App tracks activeDiscovery');
});

runTest('1.b Navbar & Footer have complete cross-phase navigation links', () => {
  const navbarCode = fs.readFileSync(path.join(componentsDir, 'Navbar.jsx'), 'utf-8');
  assert(navbarCode.includes('onNavigateHome'), 'Navbar has onNavigateHome');
  assert(navbarCode.includes('onNavigateMap'), 'Navbar has onNavigateMap');
  assert(navbarCode.includes('onNavigateMagicLens'), 'Navbar has onNavigateMagicLens');
  assert(navbarCode.includes('onNavigateStories'), 'Navbar has onNavigateStories');
  assert(navbarCode.includes('onNavigatePreservation'), 'Navbar has onNavigatePreservation');

  const footerCode = fs.readFileSync(path.join(componentsDir, 'Footer.jsx'), 'utf-8');
  assert(footerCode.includes('onNavigateHome'), 'Footer has onNavigateHome');
  assert(footerCode.includes('onNavigateMap'), 'Footer has onNavigateMap');
  assert(footerCode.includes('onNavigateMagicLens'), 'Footer has onNavigateMagicLens');
  assert(footerCode.includes('onNavigateStories'), 'Footer has onNavigateStories');
  assert(footerCode.includes('onNavigatePreservation'), 'Footer has onNavigatePreservation');
});

// -------------------------------------------------------------
// TEST 2: Discovery Integration (All 15 Discoveries)
// -------------------------------------------------------------
runTest('2. All 15 verified cultural discoveries exist with authentic metadata', () => {
  const discPath = path.join(srcDir, 'data', 'discoveries.js');
  const discCode = fs.readFileSync(discPath, 'utf-8');

  // Load discoveries data dynamically using safe regex matching
  for (let id = 1; id <= 15; id++) {
    assert(discCode.includes(`id: ${id},`), `Discovery ID ${id} must exist in discoveries.js`);
  }

  // Verify all 15 authentic images exist on disk in frontend/public/discoveries/
  const expectedImages = [
    '01-vadakkumnathan-temple.jpg',
    '02-sakthan-thampuran-palace.jpg',
    '03-district-heritage-museum.jpg',
    '04-punnathur-kotta.jpg',
    '05-kerala-kalamandalam.jpg',
    '06-thrissur-pooram.jpg',
    '07-arattupuzha-pooram.jpg',
    '08-kodungallur-bharani.jpg',
    '09-pulikali.jpg',
    '10-kummattikali.jpg',
    '11-tholpavakoothu.jpg',
    '12-kalamezhuthu.jpg',
    '13-nadavaramba-bell-metal.jpg',
    '14-cherpu-wooden-elephants.jpg',
    '15-pathramangalam-pottery.jpg'
  ];

  for (const img of expectedImages) {
    const fullImgPath = path.join(publicDir, 'discoveries', img);
    assert(fs.existsSync(fullImgPath), `Image file must exist: ${img}`);
  }
});

runTest('2.b Discovery detail page connects to Map, Story Mode, and Preservation', () => {
  const detailCode = fs.readFileSync(path.join(componentsDir, 'DiscoveryDetailPage.jsx'), 'utf-8');
  assert(detailCode.includes('onOpenMap'), 'Detail page connects to Cultural Map');
  assert(detailCode.includes('onOpenStory'), 'Detail page connects to Story Mode');
  assert(detailCode.includes('onNavigatePreservation'), 'Detail page connects to Community Preservation');
  assert(detailCode.includes('Have a story, photograph, or memory about'), 'Detail page has community preservation callout banner');
});

// -------------------------------------------------------------
// TEST 3: Interactive Cultural Map Integration
// -------------------------------------------------------------
runTest('3. CulturalMapPage uses Leaflet & OpenStreetMap without API key', () => {
  const mapCode = fs.readFileSync(path.join(componentsDir, 'CulturalMapPage.jsx'), 'utf-8');
  assert(mapCode.includes('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'), 'Uses standard OpenStreetMap tile URL');
  assert(mapCode.includes('OpenStreetMap'), 'Includes OpenStreetMap attribution');
  assert(!mapCode.includes('apiKey') && !mapCode.includes('access_token'), 'Does not require an API key');
  assert(mapCode.includes('DEFAULT_CENTER = [10.5244, 76.2138]'), 'Centered on Thrissur District coordinates');
  assert(mapCode.includes('createDivIcon'), 'Custom RIVA DivIcon generator exists');
  assert(mapCode.includes('createPopupContent'), 'Custom RIVA popup generator exists');
  assert(mapCode.includes('data-discovery-id'), 'Popup markers include data-discovery-id for detail navigation');
});

// -------------------------------------------------------------
// TEST 4: Magic Lens Signature Experience Integration
// -------------------------------------------------------------
runTest('4. MagicLensExperience provides dual discovery modes and auto-scanner', () => {
  const lensCode = fs.readFileSync(path.join(componentsDir, 'MagicLensExperience.jsx'), 'utf-8');
  assert(lensCode.includes("initialMode = 'surprise'"), 'Supports Surprise Me mode');
  assert(lensCode.includes("'preferences'"), 'Supports Preferences mode');
  assert(lensCode.includes('startScanningJourney'), 'Kinetic scanner loop exists');
  assert(lensCode.includes('finishAndReveal'), 'Reveal state exists');
  assert(lensCode.includes('onSelectDiscovery'), 'Connects to Discovery Detail');
  assert(lensCode.includes('onOpenStory'), 'Connects to Story Mode');
  assert(lensCode.includes('easeInOutCubic'), 'Uses smooth cubic bezier easing');
});

// -------------------------------------------------------------
// TEST 5: Story Mode Integration
// -------------------------------------------------------------
runTest('5. Story Mode satisfies all 3 featured stories, scenes, and durations', () => {
  const discCode = fs.readFileSync(path.join(srcDir, 'data', 'discoveries.js'), 'utf-8');
  assert(discCode.includes('id: "pulikali"'), 'Pulikali story exists');
  assert(discCode.includes('duration: "75 seconds"') && discCode.includes('scenesCount: 4'), 'Pulikali: 75 seconds, 4 scenes');
  assert(discCode.includes('id: "pooram"'), 'Thrissur Pooram story exists');
  assert(discCode.includes('duration: "90 seconds"') && discCode.includes('scenesCount: 5'), 'Pooram: 90 seconds, 5 scenes');
  assert(discCode.includes('id: "architecture"'), 'Vadakkumnathan story exists');
  assert(discCode.includes('duration: "60 seconds"') && discCode.includes('scenesCount: 3'), 'Vadakkumnathan: 60 seconds, 3 scenes');

  // Verify all 3 story hero images exist on disk
  const storyImages = [
    'story-1-pulikali.jpg',
    'story-2-pooram.jpg',
    'story-3-vadakkumnathan-timber.jpg'
  ];
  for (const sImg of storyImages) {
    const sPath = path.join(publicDir, 'stories', sImg);
    assert(fs.existsSync(sPath), `Story image file must exist: ${sImg}`);
  }

  // Verify CinematicStoryPlayer video fallback to photo with Ken Burns pan/zoom
  const playerCode = fs.readFileSync(path.join(componentsDir, 'CinematicStoryPlayer.jsx'), 'utf-8');
  assert(playerCode.includes('currentScene?.video ?'), 'Player handles video if available');
  assert(playerCode.includes('currentScene?.image ?'), 'Player falls back to authentic photograph if video null');
  assert(playerCode.includes('animate-kenburns-zoom') || playerCode.includes('animate-kenburns-pan'), 'Applies cinematic motion to photographs');
});

// -------------------------------------------------------------
// TEST 6: Community Preservation Integration
// -------------------------------------------------------------
runTest('6. Community Preservation has 7 categories, 4-stage review, and ethical notice', () => {
  const presCode = fs.readFileSync(path.join(componentsDir, 'CommunityPreservationPage.jsx'), 'utf-8');
  assert(presCode.includes('Every Story Deserves to Be Remembered.'), 'Preservation main heading verified');
  assert(presCode.includes('Culture lives through the people who practise it, remember it and pass it on.'), 'Preservation supporting text verified');
  assert(presCode.includes('Our Four-Stage Archival Review Process'), 'Four-stage archival review workflow present');
  assert(presCode.includes('Stage 1') && presCode.includes('Stage 2') && presCode.includes('Stage 3') && presCode.includes('Stage 4'), 'Stages 1-4 documented');
  assert(presCode.includes('Stories From Our Communities'), 'Community stories gallery present');
  assert(presCode.includes('Sample Demonstration Content'), 'Demo contributions clearly labeled');
  assert(presCode.includes('isCulturallySensitive'), 'Cultural sensitivity safeguard toggle present');
  assert(presCode.includes('Tracking Ref Code:'), 'Tracking reference receipt code generated');
  assert(presCode.includes('Frontend Architecture Note') || presCode.includes('prototype'), 'Clear prototype disclosure without false persistence claims');
});

// -------------------------------------------------------------
// TEST 7: Visual Palette & Responsive CSS Standards
// -------------------------------------------------------------
runTest('7. Visual identity adheres to royal burgundy, antique gold, and ivory palette', () => {
  const indexCss = fs.readFileSync(path.join(srcDir, 'index.css'), 'utf-8');
  assert(indexCss.includes('#FAF8F5'), 'Ivory #FAF8F5 token defined');
  assert(indexCss.includes('#5A1827'), 'Royal Burgundy #5A1827 token defined');
  assert(indexCss.includes('#3F101B'), 'Dark Burgundy #3F101B token defined');
  assert(indexCss.includes('#B8973D'), 'Antique Gold #B8973D token defined');
  assert(indexCss.includes('Cormorant Garamond'), 'Cormorant Garamond font specified');
  assert(indexCss.includes('Plus Jakarta Sans'), 'Plus Jakarta Sans font specified');
});

console.log('\n================================================================');
console.log(`  ALL ${passedTests}/${totalTests} INTEGRATION TESTS PASSED SUCCESSFULLY! `);
console.log('================================================================\n');

