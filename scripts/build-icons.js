// Icon generation script for development
// This script helps you convert a single PNG to all required formats

const fs = require('fs');
const path = require('path');

console.log('Icon Generation Helper');
console.log('====================');
console.log('');
console.log('To create proper application icons, you need:');
console.log('');
console.log('1. A high-resolution PNG image (512x512 or larger)');
console.log('2. Convert it to the following formats:');
console.log('   - icon.ico (Windows) - Use https://convertio.co/png-ico/');
console.log('   - icon.icns (macOS) - Use https://cloudconvert.com/png-to-icns');
console.log('   - icon.png (Linux) - Use your original PNG at 512x512');
console.log('');
console.log('Place all files in the electron/assets/ directory');
console.log('');

// Check if icon files exist
const iconDir = path.join(__dirname, '..', 'electron', 'assets');
const requiredIcons = ['icon.ico', 'icon.icns', 'icon.png'];

console.log('Current icon status:');
requiredIcons.forEach(icon => {
  const iconPath = path.join(iconDir, icon);
  const exists = fs.existsSync(iconPath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${icon}`);
});

if (!requiredIcons.every(icon => fs.existsSync(path.join(iconDir, icon)))) {
  console.log('');
  console.log('⚠️  Some icon files are missing. Desktop builds may use default icons.');
}