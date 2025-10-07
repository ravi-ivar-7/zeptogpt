#!/bin/bash

# Icon Generator Script for Next.js Template
# chmod +x /home/ravi/Desktop/Template/public/generate-icons.sh
# Usage: ./generate-icons.sh <input-image>
# Example: ./generate-icons.sh logo.png

if [ $# -eq 0 ]; then
    echo "Usage: $0 <input-image>"
    echo "Example: $0 ravi.jpeg"
    exit 1
fi

INPUT_IMAGE="$1"

if [ ! -f "$INPUT_IMAGE" ]; then
    echo "Error: Input image '$INPUT_IMAGE' not found!"
    exit 1
fi

echo "Generating icons from $INPUT_IMAGE..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed. Please install it first:"
    echo "Ubuntu/Debian: sudo apt install imagemagick"
    echo "macOS: brew install imagemagick"
    exit 1
fi

# Generate favicon.ico (16x16 and 32x32 combined)
echo "Creating favicon.ico..."
convert "$INPUT_IMAGE" -resize 16x16 favicon-16x16.png
convert "$INPUT_IMAGE" -resize 32x32 favicon-32x32.png
convert favicon-16x16.png favicon-32x32.png favicon.ico

# Generate individual PNG favicons
echo "Creating PNG favicons..."
convert "$INPUT_IMAGE" -resize 16x16 favicon-16x16.png
convert "$INPUT_IMAGE" -resize 32x32 favicon-32x32.png
convert "$INPUT_IMAGE" -resize 96x96 favicon-96x96.png
convert "$INPUT_IMAGE" -resize 192x192 android-chrome-192x192.png
convert "$INPUT_IMAGE" -resize 512x512 android-chrome-512x512.png

# Generate Apple touch icons
echo "Creating Apple touch icons..."
convert "$INPUT_IMAGE" -resize 180x180 apple-touch-icon.png
convert "$INPUT_IMAGE" -resize 152x152 apple-touch-icon-152x152.png
convert "$INPUT_IMAGE" -resize 144x144 apple-touch-icon-144x144.png
convert "$INPUT_IMAGE" -resize 120x120 apple-touch-icon-120x120.png
convert "$INPUT_IMAGE" -resize 114x114 apple-touch-icon-114x114.png
convert "$INPUT_IMAGE" -resize 76x76 apple-touch-icon-76x76.png
convert "$INPUT_IMAGE" -resize 72x72 apple-touch-icon-72x72.png
convert "$INPUT_IMAGE" -resize 60x60 apple-touch-icon-60x60.png
convert "$INPUT_IMAGE" -resize 57x57 apple-touch-icon-57x57.png

# Generate Microsoft tile icons
echo "Creating Microsoft tile icons..."
convert "$INPUT_IMAGE" -resize 144x144 mstile-144x144.png
convert "$INPUT_IMAGE" -resize 150x150 mstile-150x150.png
convert "$INPUT_IMAGE" -resize 310x150 mstile-310x150.png
convert "$INPUT_IMAGE" -resize 310x310 mstile-310x310.png
convert "$INPUT_IMAGE" -resize 70x70 mstile-70x70.png

# Generate Safari pinned tab icon (SVG alternative - using PNG)
echo "Creating Safari pinned tab icon..."
convert "$INPUT_IMAGE" -resize 16x16 safari-pinned-tab.png

# Clean up temporary files
rm -f favicon-16x16.png favicon-32x32.png

echo "✅ Icon generation complete!"
echo ""
echo "Generated files:"
echo "- favicon.ico (main favicon)"
echo "- favicon-96x96.png"
echo "- android-chrome-192x192.png"
echo "- android-chrome-512x512.png"
echo "- apple-touch-icon.png (and various sizes)"
echo "- mstile-*.png (Microsoft tiles)"
echo "- safari-pinned-tab.png"
echo ""
echo "Add these to your HTML <head>:"
echo '<link rel="icon" type="image/x-icon" href="/favicon.ico">'
echo '<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">'
echo '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">'
echo '<link rel="manifest" href="/site.webmanifest">'
