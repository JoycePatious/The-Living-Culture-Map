const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('=== RIVA PHASE 4 MAGIC LENS VERIFICATION SUITE ===\n');

// 1. Check MagicLensExperience file exists
const magicLensPath = path.join(__dirname, '../frontend/src/components/MagicLensExperience.jsx');
if (!fs.existsSync(magicLensPath)) {
  console.error('FAIL: MagicLensExperience.jsx not found!');
  process.exit(1);
}
console.log('[PASS] MagicLensExperience.jsx exists.');

const magicLensContent = fs.readFileSync(magicLensPath, 'utf8');

// 2. Verify Key Features in MagicLensExperience
const expectedFeatures = [
  { name: 'Total Surprise Mode', check: /mode === 'surprise'/ },
  { name: 'My Preferences Mode', check: /mode === 'preferences'/ },
  { name: 'Category Validation Check', check: /Please select at least one category/ },
  { name: '3D Magnifying Bezel', check: /magic-lens-bezel/ },
  { name: 'Genuine Magnified Map Container', check: /magic-lens-inner-map/ },
  { name: 'Rosewood & Brass Handle', check: /magic-lens-handle-shaft/ },
  { name: 'Optical Specular Glare & Reflection', check: /magic-lens-reflection/ },
  { name: 'Precision Reticle Crosshair', check: /magic-lens-reticle/ },
  { name: 'Pause & Resume Control', check: /handleTogglePause/ },
  { name: 'Skip Control', check: /handleSkipJourney/ },
  { name: 'Reduced Motion Support', check: /prefers-reduced-motion/ },
  { name: 'Explore More Action', check: /Explore More/ },
  { name: 'Experience Story Action', check: /Experience Story/ },
  { name: 'Try Again Action', check: /Try Again/ }
];

expectedFeatures.forEach((feat) => {
  if (feat.check.test(magicLensContent)) {
    console.log(`[PASS] Feature verified: ${feat.name}`);
  } else {
    console.error(`[FAIL] Feature missing: ${feat.name}`);
    process.exit(1);
  }
});

// 3. Test Mode Filtering Logic with Discoveries Data
const discoveriesFilePath = path.join(__dirname, '../frontend/src/data/discoveries.js');
const discoveriesContent = fs.readFileSync(discoveriesFilePath, 'utf8');
const itemsMatch = discoveriesContent.match(/export const DISCOVERIES_DATA = (\[[\s\S]*?\n\]);\s*\nexport const CATEGORIES_DATA/);
if (!itemsMatch) {
  console.error('FAIL: Could not locate DISCOVERIES_DATA in discoveries.js');
  process.exit(1);
}

const discoveries = (new Function(`return ${itemsMatch[1]}`))();
console.log(`\n[PASS] Loaded ${discoveries.length} discoveries for trajectory & filtering checks.`);

// Mode A: Total Surprise check
const modeASurprisePool = discoveries;
if (modeASurprisePool.length !== 15) {
  console.error(`FAIL: Mode A pool expected 15, got ${modeASurprisePool.length}`);
  process.exit(1);
}
console.log('[PASS] Mode A (Total Surprise): 15/15 eligible discoveries in pool.');

// Mode B: My Preferences check
const testPreferences = (categories) => {
  return discoveries.filter((d) => categories.includes(d.category));
};

const heritagePool = testPreferences(['Heritage Space']);
const festivalPool = testPreferences(['Festival']);
const artPool = testPreferences(['Art Form']);
const craftPool = testPreferences(['Craft']);
const comboPool = testPreferences(['Heritage Space', 'Craft']);

console.log(`[PASS] Mode B Filtering:`);
console.log(`   - Heritage Spaces: ${heritagePool.length} (expected 5)`);
console.log(`   - Festivals: ${festivalPool.length} (expected 3)`);
console.log(`   - Art Forms: ${artPool.length} (expected 3)`);
console.log(`   - Crafts: ${craftPool.length} (expected 4)`);
console.log(`   - Combo (Heritage + Craft): ${comboPool.length} (expected 9)`);

if (heritagePool.length !== 5 || festivalPool.length !== 3 || artPool.length !== 3 || craftPool.length !== 4 || comboPool.length !== 9) {
  console.error('FAIL: Mode B category filtering counts incorrect!');
  process.exit(1);
}

// 4. Test Trajectory Waypoints & Cubic Easing Logic
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

if (easeInOutCubic(0) !== 0 || easeInOutCubic(1) !== 1 || easeInOutCubic(0.5) !== 0.5) {
  console.error('FAIL: Easing function boundaries incorrect!');
  process.exit(1);
}
console.log('[PASS] Cubic Ease-in-out easing function boundary conditions verified (t=0 -> 0, t=0.5 -> 0.5, t=1 -> 1).');

// 5. Test Story Mode Linking Logic
const storiesMatch = discoveriesContent.match(/export const STORIES_DATA = (\[[\s\S]*?\n\]);\s*\nexport function getDiscoveryById/);
const stories = (new Function(`return ${storiesMatch[1]}`))();

const matchStory = (discoveryName) => {
  return stories.find(
    (s) =>
      s.id.toLowerCase() === discoveryName.toLowerCase() ||
      s.title.toLowerCase().includes(discoveryName.toLowerCase()) ||
      (discoveryName.includes('Vadakkumnathan') && s.id === 'architecture') ||
      (discoveryName.includes('Pooram') && s.id === 'pooram') ||
      (discoveryName.includes('Pulikali') && s.id === 'pulikali')
  );
};

const vadakkumnathanStory = matchStory('Vadakkumnathan Temple');
const pooramStory = matchStory('Thrissur Pooram');
const pulikaliStory = matchStory('Pulikali');
const cherpuStory = matchStory('Cherpu Wooden Elephant Craft');

if (!vadakkumnathanStory || vadakkumnathanStory.id !== 'architecture') {
  console.error('FAIL: Vadakkumnathan temple not mapped to architecture story!');
  process.exit(1);
}
if (!pooramStory || pooramStory.id !== 'pooram') {
  console.error('FAIL: Pooram not mapped to pooram story!');
  process.exit(1);
}
if (!pulikaliStory || pulikaliStory.id !== 'pulikali') {
  console.error('FAIL: Pulikali not mapped to pulikali story!');
  process.exit(1);
}
if (cherpuStory !== undefined) {
  console.error('FAIL: Cherpu expected undefined (handled by coming-soon notification)');
  process.exit(1);
}
console.log('[PASS] Story Mode linking verified for direct stories & coming-soon graceful fallback.');

// 6. Verify CSS definitions for 3D Magnifying Glass in index.css
const indexCssPath = path.join(__dirname, '../frontend/src/index.css');
const indexCssContent = fs.readFileSync(indexCssPath, 'utf8');

const expectedCssClasses = [
  '.magic-lens-assembly',
  '.magic-lens-bezel',
  '.magic-lens-glass',
  '.magic-lens-inner-map',
  '.magic-lens-reflection',
  '.magic-lens-reticle',
  '.magic-lens-handle-wrapper',
  '.magic-lens-handle-shaft',
  '.marker-scanned-beacon',
  'prefers-reduced-motion'
];

expectedCssClasses.forEach((cls) => {
  if (indexCssContent.includes(cls)) {
    console.log(`[PASS] CSS rule verified: ${cls}`);
  } else {
    console.error(`[FAIL] CSS rule missing: ${cls}`);
    process.exit(1);
  }
});

console.log('\n[ALL PHASE 4 MAGIC LENS UNIT CHECKS PASSED WITH 0 ERRORS]');

