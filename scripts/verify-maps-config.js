#!/usr/bin/env node

/**
 * This script verifies that Google Maps API keys are correctly set in the environment
 * and checks if the necessary dependencies are installed.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const chalk = require('chalk') || { green: text => text, red: text => text, yellow: text => text, blue: text => text };

console.log(chalk.blue('🗺️  Verifying Google Maps configuration for FetchQuest...'));

// Check environment variables
const iosKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY;
const androidKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY;

console.log('\n🔑 Checking API keys in environment variables:');
if (iosKey && iosKey !== 'your-ios-api-key') {
  console.log(chalk.green('✅ iOS Google Maps API key is set'));
} else {
  console.log(chalk.red('❌ iOS Google Maps API key is not set or is using the default value'));
  console.log('   Please add your API key to the .env file: EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY=your-actual-key');
}

if (androidKey && androidKey !== 'your-android-api-key') {
  console.log(chalk.green('✅ Android Google Maps API key is set'));
} else {
  console.log(chalk.red('❌ Android Google Maps API key is not set or is using the default value'));
  console.log('   Please add your API key to the .env file: EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY=your-actual-key');
}

// Check app.config.ts
const appConfigPath = path.join(process.cwd(), 'app.config.ts');
try {
  const appConfig = fs.readFileSync(appConfigPath, 'utf8');
  console.log('\n📄 Checking app.config.ts configuration:');
  
  if (appConfig.includes('googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY')) {
    console.log(chalk.green('✅ iOS Google Maps API key is correctly referenced in app.config.ts'));
  } else {
    console.log(chalk.red('❌ iOS Google Maps API key is not correctly referenced in app.config.ts'));
  }
  
  if (appConfig.includes('apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY')) {
    console.log(chalk.green('✅ Android Google Maps API key is correctly referenced in app.config.ts'));
  } else {
    console.log(chalk.red('❌ Android Google Maps API key is not correctly referenced in app.config.ts'));
  }
} catch (error) {
  console.log(chalk.red(`❌ Could not read app.config.ts: ${error.message}`));
}

// Check dependencies in package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('\n📦 Checking necessary dependencies:');
  
  if (packageJson.dependencies['react-native-maps']) {
    console.log(chalk.green(`✅ react-native-maps is installed (version: ${packageJson.dependencies['react-native-maps']})`));
  } else {
    console.log(chalk.red('❌ react-native-maps is not installed'));
    console.log('   Please install it with: npm install react-native-maps --save');
  }
  
  if (packageJson.dependencies['react-native-map-clustering']) {
    console.log(chalk.green(`✅ react-native-map-clustering is installed (version: ${packageJson.dependencies['react-native-map-clustering']})`));
  } else {
    console.log(chalk.yellow('⚠️ react-native-map-clustering is not installed (optional for clustering markers)'));
  }
} catch (error) {
  console.log(chalk.red(`❌ Could not read package.json: ${error.message}`));
}

// Check MapView component
const mapViewPath = path.join(process.cwd(), 'components', 'MapView.tsx');
try {
  const mapViewContent = fs.readFileSync(mapViewPath, 'utf8');
  console.log('\n🧩 Checking MapView component:');
  
  if (mapViewContent.includes('PROVIDER_GOOGLE')) {
    console.log(chalk.green('✅ MapView is configured to use Google Maps provider'));
  } else {
    console.log(chalk.yellow('⚠️ MapView is not configured to use Google Maps provider'));
    console.log('   Consider adding PROVIDER_GOOGLE to your MapView component');
  }
} catch (error) {
  console.log(chalk.red(`❌ Could not read MapView.tsx: ${error.message}`));
}

console.log('\n🧪 Next steps:');
console.log('1. Ensure you have added your actual Google Maps API keys to the .env file');
console.log('2. Run "npx expo prebuild --clean" to regenerate native code with your API keys');
console.log('3. Run "npx expo run:ios" or "npx expo run:android" to test the app with maps');
console.log('\nFor more information on Google Maps setup with Expo, visit:');
console.log('https://docs.expo.dev/versions/latest/sdk/map-view/'); 