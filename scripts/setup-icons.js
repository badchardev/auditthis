#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 AuditThis! Icon Setup Guide');
console.log('===============================\n');

console.log('Your build failed because proper icon files are missing.');
console.log('Here\'s how to create them:\n');

console.log('📋 STEP 1: Get your source image');
console.log('   • Create or find a square image (512x512 pixels minimum)');
console.log('   • Make sure it represents your "AuditThis!" brand');
console.log('   • Save it as a high-quality PNG with transparent background\n');

console.log('🔧 STEP 2: Create Windows .ico file');
console.log('   • Go to: https://www.icoconverter.com/');
console.log('   • Upload your PNG image');
console.log('   • Select "Include all sizes" (16x16, 32x32, 48x48, 256x256)');
console.log('   • Download the .ico file');
console.log('   • Save it as: electron/assets/icon.ico\n');

console.log('🐧 STEP 3: Create Linux .png file');
console.log('   • Resize your image to exactly 512x512 pixels');
console.log('   • Save it as: electron/assets/icon.png\n');

console.log('🍎 STEP 4: Create macOS .icns file');
console.log('   • Go to: https://cloudconvert.com/png-to-icns');
console.log('   • Upload your 512x512 PNG');
console.log('   • Download the .icns file');
console.log('   • Save it as: electron/assets/icon.icns\n');

console.log('✅ STEP 5: Test the build');
console.log('   • Run: npm run build:win');
console.log('   • The build should now complete successfully\n');

// Check current status
const assetsDir = path.join(__dirname, '..', 'electron', 'assets');
const icons = ['icon.ico', 'icon.png', 'icon.icns'];

console.log('📊 Current icon status:');
icons.forEach(icon => {
  const iconPath = path.join(assetsDir, icon);
  const exists = fs.existsSync(iconPath);
  let status = '❌ Missing';
  
  if (exists) {
    const stats = fs.statSync(iconPath);
    // Check if it's likely a real icon file (not just text)
    if (stats.size > 1000) {
      status = '✅ Found (looks good)';
    } else {
      status = '⚠️  Found (but seems to be placeholder)';
    }
  }
  
  console.log(`   ${status}: ${icon}`);
});

console.log('\n💡 Quick icon ideas for AuditThis!:');
console.log('   • Calculator with checkmark');
console.log('   • Magnifying glass over spreadsheet');
console.log('   • Dollar sign with audit symbol');
console.log('   • Professional chart/graph icon');

if (!fs.existsSync(path.join(assetsDir, 'icon.ico')) || 
    fs.statSync(path.join(assetsDir, 'icon.ico')).size < 1000) {
  console.log('\n⚠️  You MUST create proper icon files before building!');
  console.log('    The current files are just placeholders.');
}