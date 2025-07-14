#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 AuditThis! Icon Setup Guide');
console.log('===============================\n');

console.log('Your build failed because the Windows icon file is invalid.');
console.log('Here\'s how to fix it:\n');

console.log('📋 STEP 1: Prepare your source image');
console.log('   • Create or find a square image (preferably 512x512 pixels)');
console.log('   • Make sure it has a transparent background');
console.log('   • Save it as a high-quality PNG\n');

console.log('🔧 STEP 2: Create Windows .ico file');
console.log('   • Go to: https://www.icoconverter.com/');
console.log('   • Upload your PNG image');
console.log('   • Select "Include all sizes" (16x16, 32x32, 48x48, 256x256)');
console.log('   • Download the .ico file');
console.log('   • Save it as: build/icon.ico\n');

console.log('🐧 STEP 3: Create Linux .png file');
console.log('   • Resize your image to exactly 512x512 pixels');
console.log('   • Save it as: build/icon.png\n');

console.log('🍎 STEP 4: Create macOS .icns file (optional)');
console.log('   • Go to: https://cloudconvert.com/png-to-icns');
console.log('   • Upload your 512x512 PNG');
console.log('   • Download the .icns file');
console.log('   • Save it as: build/icon.icns\n');

console.log('✅ STEP 5: Test the build');
console.log('   • Run: npm run build:win');
console.log('   • The build should now complete successfully\n');

console.log('💡 Pro tip: Keep your source PNG at 1024x1024 for best results!');

// Check current status
const buildDir = path.join(__dirname, '..', 'build');
const icons = ['icon.ico', 'icon.png', 'icon.icns'];

console.log('\n📊 Current icon status:');
icons.forEach(icon => {
  const iconPath = path.join(buildDir, icon);
  const exists = fs.existsSync(iconPath);
  const status = exists ? '✅ Found' : '❌ Missing';
  console.log(`   ${status}: ${icon}`);
});

if (!fs.existsSync(path.join(buildDir, 'icon.ico'))) {
  console.log('\n⚠️  You MUST create a proper icon.ico file before building for Windows!');
}