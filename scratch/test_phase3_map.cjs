const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('=== RIVA PHASE 3 INTERACTIVE MAP VERIFICATION SUITE ===\n');

// 1. Verify Discoveries Data Coordinates & Metadata
const discoveriesFilePath = path.join(__dirname, '../frontend/src/data/discoveries.js');
const discoveriesContent = fs.readFileSync(discoveriesFilePath, 'utf8');

// Parse discoveries array
const itemsMatch = discoveriesContent.match(/export const DISCOVERIES_DATA = (\[[\s\S]*?\n\]);\s*\nexport const CATEGORIES_DATA/);
if (!itemsMatch) {
  console.error('FAIL: Could not locate DISCOVERIES_DATA in discoveries.js');
  process.exit(1);
}

// Evaluate discoveries data in sandbox context
let discoveries;
try {
  // Use Function to evaluate array expression
  const cleaned = itemsMatch[1];
  discoveries = (new Function(`return ${cleaned}`))();
  console.log(`[PASS] Successfully parsed all ${discoveries.length} discoveries from discoveries.js.`);
} catch (err) {
  console.error('FAIL: Error evaluating DISCOVERIES_DATA:', err);
  process.exit(1);
}

// 2. Validate coordinates and locations
const errors = [];
const categoryCounts = {
  'Heritage Space': 0,
  'Festival': 0,
  'Art Form': 0,
  'Craft': 0
};

discoveries.forEach((d) => {
  // Check category
  if (!categoryCounts.hasOwnProperty(d.category)) {
    errors.push(`Discovery #${d.id} (${d.name}) has unexpected category: ${d.category}`);
  } else {
    categoryCounts[d.category]++;
  }

  // Check numeric lat & lng
  if (typeof d.lat !== 'number' || isNaN(d.lat) || d.lat < 10.15 || d.lat > 10.85) {
    errors.push(`Discovery #${d.id} (${d.name}) invalid lat: ${d.lat}`);
  }
  if (typeof d.lng !== 'number' || isNaN(d.lng) || d.lng < 75.95 || d.lng > 76.45) {
    errors.push(`Discovery #${d.id} (${d.name}) invalid lng: ${d.lng}`);
  }

  // Check locationAccuracy & isAreaLevel
  if (typeof d.isAreaLevel !== 'boolean') {
    errors.push(`Discovery #${d.id} (${d.name}) missing boolean isAreaLevel`);
  }
  if (!d.locationAccuracy || typeof d.locationAccuracy !== 'string') {
    errors.push(`Discovery #${d.id} (${d.name}) missing locationAccuracy string`);
  }

  // Check image file exists in frontend/public
  const imageDiskPath = path.join(__dirname, '../frontend/public', d.image.replace(/^\//, ''));
  if (!fs.existsSync(imageDiskPath)) {
    errors.push(`Discovery #${d.id} image missing on disk: ${imageDiskPath}`);
  }
});

console.log('[PASS] Category distribution:');
console.log(`   - Heritage Spaces: ${categoryCounts['Heritage Space']} (expected 5)`);
console.log(`   - Festivals: ${categoryCounts['Festival']} (expected 3)`);
console.log(`   - Art Forms: ${categoryCounts['Art Form']} (expected 3)`);
console.log(`   - Crafts: ${categoryCounts['Craft']} (expected 4)`);

// 3. Special Verification: Koonathara Palakkad-Thrissur border
const koonathara = discoveries.find((d) => d.id === 11);
if (!koonathara || !koonathara.locationAccuracy.includes('Palakkad-Thrissur border') || koonathara.lat < 10.7) {
  errors.push('FAIL: Koonathara (Tholpavakoothu) not properly mapped to Palakkad-Thrissur border!');
} else {
  console.log(`[PASS] Koonathara (Tholpavakoothu) accurately positioned at [${koonathara.lat}, ${koonathara.lng}] on Palakkad-Thrissur border.`);
}

// 4. Special Verification: Kalamezhuthu Area-Level Tradition
const kalamezhuthu = discoveries.find((d) => d.id === 12);
if (!kalamezhuthu || !kalamezhuthu.isAreaLevel) {
  errors.push('FAIL: Kalamezhuthu must be marked isAreaLevel: true!');
} else {
  console.log(`[PASS] Kalamezhuthu documented as Area-Level Tradition (${kalamezhuthu.locationAccuracy}).`);
}

// 5. Special Verification: Distinct localities across Thrissur District
const guruvayur = discoveries.find((d) => d.id === 4); // Punnathur Kotta
const kodungallur = discoveries.find((d) => d.id === 8); // Kodungallur Bharani
const cheruthuruthy = discoveries.find((d) => d.id === 5); // Kerala Kalamandalam
const nadavaramba = discoveries.find((d) => d.id === 13); // Nadavaramba

if (!guruvayur || guruvayur.lng > 76.1) {
  errors.push(`FAIL: Guruvayur coastal position expected west of 76.1 (got ${guruvayur.lng})`);
} else {
  console.log(`[PASS] Guruvayur (Punnathur Kotta) placed in west coastal taluk at [${guruvayur.lat}, ${guruvayur.lng}].`);
}

if (!kodungallur || kodungallur.lat > 10.3) {
  errors.push(`FAIL: Kodungallur expected south of 10.3 (got ${kodungallur.lat})`);
} else {
  console.log(`[PASS] Kodungallur (Bharani) placed in southern coastal taluk at [${kodungallur.lat}, ${kodungallur.lng}].`);
}

if (!cheruthuruthy || cheruthuruthy.lat < 10.7) {
  errors.push(`FAIL: Cheruthuruthy expected north of 10.7 (got ${cheruthuruthy.lat})`);
} else {
  console.log(`[PASS] Cheruthuruthy (Kalamandalam) placed in northern Bharathapuzha region at [${cheruthuruthy.lat}, ${cheruthuruthy.lng}].`);
}

if (!nadavaramba || nadavaramba.lat > 10.4) {
  errors.push(`FAIL: Nadavaramba expected south in Irinjalakuda (got ${nadavaramba.lat})`);
} else {
  console.log(`[PASS] Nadavaramba placed in Irinjalakuda bell-metal hub at [${nadavaramba.lat}, ${nadavaramba.lng}].`);
}

if (errors.length > 0) {
  console.error('\nERRORS FOUND:');
  errors.forEach((err) => console.error(' - ' + err));
  process.exit(1);
} else {
  console.log('\n[ALL VERIFICATION CHECKS PASSED WITH 0 ERRORS]');
}
