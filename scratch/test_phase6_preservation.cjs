const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- RUNNING PHASE 6: COMMUNITY PRESERVATION VERIFICATION SUITE ---');

const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'frontend', 'src', 'components');

// 1. Check CommunityPreservationPage.jsx exists
const preservationPagePath = path.join(componentsDir, 'CommunityPreservationPage.jsx');
assert(fs.existsSync(preservationPagePath), 'CommunityPreservationPage.jsx must exist');
const pageContent = fs.readFileSync(preservationPagePath, 'utf-8');

// 2. Verify Exact Headings and Subtitles
assert(pageContent.includes('Every Story Deserves to Be Remembered.'), 'Must include exact main heading: "Every Story Deserves to Be Remembered."');
assert(pageContent.includes('Culture lives through the people who practise it, remember it and pass it on. Share your knowledge and help preserve the living heritage of Thrissur.'), 'Must include exact supporting text');
console.log('✓ Heading & supporting text verified');

// 3. Verify All 7 Official Contribution Categories
const expectedCategories = [
  'Local Stories and Oral Histories',
  'Festivals and Traditions',
  'Traditional Art Forms',
  'Crafts and Vanishing Skills',
  'Heritage Places',
  'Photographs and Videos',
  'Corrections or Additional Information'
];

for (const cat of expectedCategories) {
  assert(pageContent.includes(cat), `Category "${cat}" must be present in CommunityPreservationPage`);
}
console.log('✓ All 7 contribution categories verified');

// 4. Verify 4-Stage Archival Review Process
assert(pageContent.includes('Stage 1') && pageContent.includes('Submission'), 'Must contain Stage 1 Submission');
assert(pageContent.includes('Stage 2') && pageContent.includes('Under Archival Review'), 'Must contain Stage 2 Under Archival Review');
assert(pageContent.includes('Stage 3') && pageContent.includes('Sensitivity Safeguard'), 'Must contain Stage 3 Sensitivity Safeguard');
assert(pageContent.includes('Stage 4') && pageContent.includes('Approved / Published'), 'Must contain Stage 4 Approved');
assert(pageContent.includes('do <strong>not</strong> appear automatically'), 'Must explicitly document that submissions do not automatically appear');
console.log('✓ 4-Stage Archival Review workflow verified');

// 5. Verify "Stories From Our Communities" Section
assert(pageContent.includes('Stories From Our Communities'), 'Must contain "Stories From Our Communities" section title');
assert(pageContent.includes('Sample Demonstration Content'), 'Must clearly label sample stories as demonstration content');
assert(pageContent.includes('Editorial Integrity Notice'), 'Must include editorial disclaimer that RIVA does not invent identities');
console.log('✓ "Stories From Our Communities" section and transparency labels verified');

// 6. Verify Form Modal & Fields
assert(pageContent.includes('Contribution Title *'), 'Form must have title field');
assert(pageContent.includes('Contribution Category *'), 'Form must have category field');
assert(pageContent.includes('Location or Locality in Thrissur *'), 'Form must have locality field');
assert(pageContent.includes('Detailed Description or Story *'), 'Form must have description field');
assert(pageContent.includes('Historical Background or Additional Context'), 'Form must have background/context field');
assert(pageContent.includes('Your Name (Optional)'), 'Form must have optional contributor name');
assert(pageContent.includes('Contact Email (Private & Optional)'), 'Form must have optional private email');
assert(pageContent.includes('Display my name with the contribution'), 'Form must support display name credit');
assert(pageContent.includes('Keep me anonymous'), 'Form must support anonymous credit');
assert(pageContent.includes('handleFileUpload') && pageContent.includes('handleRemoveFile'), 'Form must support file upload and removal');
assert(pageContent.includes('confirmOwnership') && pageContent.includes('agreeTerms'), 'Form must require ownership and terms consent');
assert(pageContent.includes('isCulturallySensitive'), 'Form must have cultural sensitivity toggle');
assert(pageContent.includes('tracking reference code') || pageContent.includes('Tracking Ref Code'), 'Receipt must display reference code');
assert(pageContent.includes('Frontend Architecture Note') || pageContent.includes('prototype'), 'Receipt must disclose frontend prototype status');
console.log('✓ Comprehensive Contribution Form & receipt modal verified');

// 7. Verify Cultural Sensitivity & Ethical Preservation Section
assert(pageContent.includes('Cultural Sensitivity & Responsible Stewardship') || pageContent.includes('Preservation Charter'), 'Must include Cultural Sensitivity Charter');
assert(pageContent.includes('Respect for Sacred Traditions'), 'Must include Respect for Sacred Traditions');
assert(pageContent.includes('Honoring Oral Provenance'), 'Must include Honoring Oral Provenance');
assert(pageContent.includes('Fair Contributor Attribution'), 'Must include Fair Contributor Attribution');
console.log('✓ Cultural Sensitivity & Ethical Preservation section verified');

// 8. Verify Navigation & Routing in App.jsx
const appPath = path.join(rootDir, 'frontend', 'src', 'App.jsx');
const appContent = fs.readFileSync(appPath, 'utf-8');
assert(appContent.includes('isPreservationView'), 'App.jsx must track isPreservationView state');
assert(appContent.includes("'#preservation'") && appContent.includes("'#community'"), 'App.jsx must support #preservation and #community hashes');
assert(appContent.includes('<CommunityPreservationPage'), 'App.jsx must render CommunityPreservationPage');
assert(appContent.includes('handleOpenPreservationPage'), 'App.jsx must have handleOpenPreservationPage handler');
console.log('✓ App.jsx routing and view switching verified');

// 9. Verify Navbar & Footer integration
const navbarPath = path.join(componentsDir, 'Navbar.jsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf-8');
assert(navbarContent.includes('onNavigatePreservation'), 'Navbar must accept onNavigatePreservation prop');
assert(navbarContent.includes('isPreservationView'), 'Navbar must track active preservation state');
assert(navbarContent.includes('#preservation'), 'Navbar must link to #preservation');

const footerPath = path.join(componentsDir, 'Footer.jsx');
const footerContent = fs.readFileSync(footerPath, 'utf-8');
assert(footerContent.includes('onNavigatePreservation'), 'Footer must accept onNavigatePreservation prop');
assert(footerContent.includes('#preservation'), 'Footer must link to #preservation');
console.log('✓ Navbar and Footer integration verified');

// 10. Verify DiscoveryDetailPage callout banner and top button
const detailPath = path.join(componentsDir, 'DiscoveryDetailPage.jsx');
const detailContent = fs.readFileSync(detailPath, 'utf-8');
assert(detailContent.includes('onNavigatePreservation'), 'DiscoveryDetailPage must accept onNavigatePreservation');
assert(detailContent.includes('Have a story, photograph, or memory about'), 'DiscoveryDetailPage must have callout banner');
assert(detailContent.includes('Community Preservation Archive'), 'DiscoveryDetailPage must indicate Community Preservation Archive');
console.log('✓ DiscoveryDetailPage top button and callout banner verified');

console.log('\n======================================================');
console.log('ALL PHASE 6: COMMUNITY PRESERVATION TESTS PASSED! (10/10)');
console.log('======================================================\n');

