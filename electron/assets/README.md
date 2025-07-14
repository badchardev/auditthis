# Icon Assets

This directory contains the application icons for different platforms.

## Required Files

- `icon.ico` - Windows icon (multi-size ICO format)
- `icon.png` - Linux icon (512x512 PNG)
- `icon.icns` - macOS icon (ICNS format)

## Current Status

The current files are placeholders. You need to replace them with actual icon files.

## How to Create Icons

### 1. Source Image
- Create a 512x512 pixel image
- Use PNG format with transparency
- Make it represent your "AuditThis!" brand

### 2. Convert to Required Formats

**Windows (.ico):**
- Use https://www.icoconverter.com/
- Upload your PNG
- Select "Include all sizes"
- Download and save as `icon.ico`

**Linux (.png):**
- Simply save your 512x512 PNG as `icon.png`

**macOS (.icns):**
- Use https://cloudconvert.com/png-to-icns
- Upload your PNG
- Download and save as `icon.icns`

## Icon Ideas for AuditThis!

- Calculator with checkmark
- Magnifying glass over spreadsheet
- Dollar sign with audit symbol
- Professional chart/graph icon
- Clipboard with financial data

## Testing

After creating your icons, run:
```bash
npm run check-icons
```

This will verify your icons are properly formatted.