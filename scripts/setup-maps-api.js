#!/usr/bin/env node

/**
 * This script helps set up Google Maps API keys for your FetchQuest app.
 * It will guide you through the process of updating your .env file.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const dotenv = require('dotenv');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for prettier output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m'
};

console.log(`\n${colors.cyan}${colors.bold}=== FetchQuest Maps API Setup ===${colors.reset}\n`);
console.log(`${colors.yellow}This script will help you set up Google Maps API keys for your FetchQuest app.${colors.reset}`);
console.log(`${colors.yellow}You'll need API keys for both iOS and Android platforms.${colors.reset}\n`);

// Load current .env file
const envPath = path.resolve(process.cwd(), '.env');
let envConfig = {};

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envConfig = dotenv.parse(envFile);
}

// Get current values or set defaults
const currentIosKey = envConfig.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY || '';
const currentAndroidKey = envConfig.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY || '';

// Display instructions
console.log(`${colors.magenta}How to get Google Maps API keys:${colors.reset}`);
console.log('1. Go to Google Cloud Console (https://console.cloud.google.com/)');
console.log('2. Create or select a project');
console.log('3. Enable the Maps SDK for iOS and Android');
console.log('4. Go to APIs & Services > Credentials');
console.log('5. Create API keys for each platform\n');

// Prompt for iOS API key
rl.question(`Enter your Google Maps iOS API key ${currentIosKey ? `(current: ${currentIosKey.substring(0, 4)}...${currentIosKey.substring(currentIosKey.length - 4)})` : ''}: `, (iosKey) => {
  const newIosKey = iosKey.trim() || currentIosKey;
  
  // Prompt for Android API key
  rl.question(`Enter your Google Maps Android API key ${currentAndroidKey ? `(current: ${currentAndroidKey.substring(0, 4)}...${currentAndroidKey.substring(currentAndroidKey.length - 4)})` : ''}: `, (androidKey) => {
    const newAndroidKey = androidKey.trim() || currentAndroidKey;
    
    // Update .env file
    const updatedEnvConfig = { ...envConfig };
    updatedEnvConfig.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY = newIosKey;
    updatedEnvConfig.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY = newAndroidKey;
    
    // Convert to string
    const newEnvContent = Object.entries(updatedEnvConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    try {
      // Create backup
      if (fs.existsSync(envPath)) {
        fs.copyFileSync(envPath, `${envPath}.backup`);
        console.log(`\n${colors.green}✅ Created backup of your .env file at ${envPath}.backup${colors.reset}`);
      }
      
      // Write new .env file
      fs.writeFileSync(envPath, newEnvContent);
      console.log(`\n${colors.green}✅ Updated your .env file with the new API keys${colors.reset}`);
      
      console.log(`\n${colors.blue}${colors.bold}Next steps:${colors.reset}`);
      console.log(`1. Run ${colors.cyan}npx expo prebuild --clean${colors.reset} to regenerate native code with your API keys`);
      console.log(`2. Run ${colors.cyan}npx expo run:ios${colors.reset} or ${colors.cyan}npx expo run:android${colors.reset} to test the app with maps`);
      console.log(`3. Verify your configuration with ${colors.cyan}node scripts/verify-maps-config.js${colors.reset}\n`);
      
    } catch (error) {
      console.error(`\n${colors.red}Error updating .env file: ${error.message}${colors.reset}`);
    }
    
    rl.close();
  });
}); 