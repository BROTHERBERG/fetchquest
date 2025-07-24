#!/bin/bash

# Exit on error
set -e

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== 🚀 Building FetchQuest for TestFlight ===${NC}"

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${RED}EAS CLI is not installed. Installing now...${NC}"
    npm install -g eas-cli
fi

# Make sure we have the latest dependencies
echo -e "${YELLOW}=== 📦 Installing dependencies ===${NC}"
npm install

# Ensure CocoaPods are installed for iOS
echo -e "${YELLOW}=== 🍎 Installing CocoaPods dependencies ===${NC}"
cd ios && bundle exec pod install && cd ..

# Ensure environment variables are set
if [ ! -f .env ]; then
    echo -e "${RED}⚠️ No .env file found. Creating a template .env file.${NC}"
    cat > .env << EOL
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EOL
    echo -e "${RED}⚠️ Please fill in the Firebase configuration in the .env file and run this script again.${NC}"
    exit 1
fi

# Build for TestFlight
echo -e "${YELLOW}=== 🏗️ Building for TestFlight ===${NC}"
eas build --platform ios --profile testflight

echo -e "${GREEN}=== ✅ Build submitted! ===${NC}"
echo -e "${YELLOW}Once the build is complete, you can submit it to TestFlight with:${NC}"
echo -e "${GREEN}eas submit -p ios --latest${NC}" 