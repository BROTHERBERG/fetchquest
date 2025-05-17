#!/bin/bash
# fix-incompatible-pointer.sh

# Usage: ./fix-incompatible-pointer.sh [path/to/ios/directory]

IOS_DIR=${1:-"ios"}

# Check if the directory exists
if [ ! -d "$IOS_DIR" ]; then
  echo "Error: iOS directory not found at $IOS_DIR"
  exit 1
fi

# Find the Xcode project file
PBXPROJ=$(find "$IOS_DIR" -name "project.pbxproj")

if [ -z "$PBXPROJ" ]; then
  echo "Error: Could not find project.pbxproj file"
  exit 1
fi

echo "Modifying $PBXPROJ to suppress incompatible function pointer warnings..."

# Add warning flag to suppress incompatible function pointer types
sed -i '' 's/OTHER_CFLAGS = (/OTHER_CFLAGS = (\n\t\t\t\t\t"-Wno-incompatible-function-pointer-types",/g' "$PBXPROJ"

echo "Done! The incompatible function pointer warnings should be suppressed now."