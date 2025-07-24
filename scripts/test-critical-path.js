/**
 * FetchQuest Critical Path Test
 * 
 * This script tests critical user flows to ensure they're working before TestFlight submission.
 * Run with: node scripts/test-critical-path.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m"
};

// Critical paths to test
const criticalPaths = [
  { name: 'Firebase Configuration', test: checkFirebaseConfig },
  { name: 'React Navigation Setup', test: checkNavigationSetup },
  { name: 'Task Store', test: checkTaskStore },
  { name: 'User Store', test: checkUserStore },
  { name: 'Map Integration', test: checkMapIntegration },
  { name: 'Image Picker', test: checkImagePicker },
  { name: 'Location Services', test: checkLocationServices },
];

async function runTests() {
  console.log(`${colors.bright}${colors.cyan}=== FetchQuest Critical Path Tests ===${colors.reset}\n`);
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const path of criticalPaths) {
    try {
      process.stdout.write(`${colors.blue}Testing: ${colors.bright}${path.name}${colors.reset} ... `);
      const result = await path.test();
      if (result.success) {
        console.log(`${colors.green}✅ PASS${colors.reset}`);
        if (result.message) {
          console.log(`   ${colors.dim}${result.message}${colors.reset}`);
        }
        passedTests++;
      } else {
        console.log(`${colors.red}❌ FAIL${colors.reset}`);
        console.log(`   ${colors.red}${result.message}${colors.reset}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`${colors.red}❌ ERROR${colors.reset}`);
      console.log(`   ${colors.red}${error.message}${colors.reset}`);
      failedTests++;
    }
    console.log(''); // Empty line for readability
  }
  
  // Summary
  console.log(`${colors.cyan}=== Test Summary ===${colors.reset}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  
  if (failedTests === 0) {
    console.log(`\n${colors.green}${colors.bright}All critical paths passed! Ready for TestFlight submission.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}${colors.bright}Some critical paths failed. Please fix issues before submitting to TestFlight.${colors.reset}`);
    process.exit(1);
  }
}

// Test implementations

async function checkFirebaseConfig() {
  // Check if Firebase config is present in app.config.ts
  const appConfigPath = path.join(process.cwd(), 'app.config.ts');
  const content = fs.readFileSync(appConfigPath, 'utf8');
  
  if (!content.includes('FIREBASE_API_KEY')) {
    return { 
      success: false, 
      message: 'Firebase configuration not found in app.config.ts' 
    };
  }
  
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return { 
      success: false, 
      message: '.env file not found. Firebase credentials need to be configured.' 
    };
  }
  
  return { 
    success: true, 
    message: 'Firebase configuration found' 
  };
}

async function checkNavigationSetup() {
  // Check if navigation setup is correct
  const layoutFile = path.join(process.cwd(), 'app', '_layout.tsx');
  
  if (!fs.existsSync(layoutFile)) {
    return { 
      success: false, 
      message: 'Main layout file not found at app/_layout.tsx' 
    };
  }
  
  const content = fs.readFileSync(layoutFile, 'utf8');
  
  if (!content.includes('expo-router')) {
    return { 
      success: false, 
      message: 'expo-router not found in _layout.tsx' 
    };
  }
  
  return { 
    success: true, 
    message: 'Navigation setup looks correct' 
  };
}

async function checkTaskStore() {
  // Check if task store is present
  const taskStorePath = path.join(process.cwd(), 'store', 'task-store.ts');
  
  if (!fs.existsSync(taskStorePath)) {
    return { 
      success: false, 
      message: 'Task store not found at store/task-store.ts' 
    };
  }
  
  const content = fs.readFileSync(taskStorePath, 'utf8');
  
  if (!content.includes('addTask') || !content.includes('acceptTask')) {
    return { 
      success: false, 
      message: 'Task store is missing critical methods' 
    };
  }
  
  return { 
    success: true, 
    message: 'Task store implementation found' 
  };
}

async function checkUserStore() {
  // Check if user store is present
  const userStorePath = path.join(process.cwd(), 'store', 'user-store.ts');
  
  if (!fs.existsSync(userStorePath)) {
    return { 
      success: false, 
      message: 'User store not found at store/user-store.ts' 
    };
  }
  
  const content = fs.readFileSync(userStorePath, 'utf8');
  
  if (!content.includes('login') || !content.includes('register')) {
    return { 
      success: false, 
      message: 'User store is missing critical authentication methods' 
    };
  }
  
  return { 
    success: true, 
    message: 'User store implementation found with authentication methods' 
  };
}

async function checkMapIntegration() {
  // Check if map components are present
  const mapViewPath = path.join(process.cwd(), 'components', 'MapView.tsx');
  
  if (!fs.existsSync(mapViewPath)) {
    return { 
      success: false, 
      message: 'MapView component not found' 
    };
  }
  
  const packageJson = require(path.join(process.cwd(), 'package.json'));
  
  if (!packageJson.dependencies['react-native-maps']) {
    return { 
      success: false, 
      message: 'react-native-maps dependency not found in package.json' 
    };
  }
  
  return { 
    success: true, 
    message: 'Map integration found' 
  };
}

async function checkImagePicker() {
  // Check if image picker is configured
  const packageJson = require(path.join(process.cwd(), 'package.json'));
  
  if (!packageJson.dependencies['expo-image-picker']) {
    return { 
      success: false, 
      message: 'expo-image-picker dependency not found in package.json' 
    };
  }
  
  // Check if image picker component exists
  const imagePickerPath = path.join(process.cwd(), 'components', 'ImagePicker.tsx');
  
  if (!fs.existsSync(imagePickerPath)) {
    return { 
      success: false, 
      message: 'ImagePicker component not found' 
    };
  }
  
  return { 
    success: true, 
    message: 'Image picker integration found' 
  };
}

async function checkLocationServices() {
  // Check if location services are configured
  const packageJson = require(path.join(process.cwd(), 'package.json'));
  
  if (!packageJson.dependencies['expo-location']) {
    return { 
      success: false, 
      message: 'expo-location dependency not found in package.json' 
    };
  }
  
  // Check if location permissions are defined in app.config.ts
  const appConfigPath = path.join(process.cwd(), 'app.config.ts');
  const content = fs.readFileSync(appConfigPath, 'utf8');
  
  if (!content.includes('NSLocationWhenInUseUsageDescription')) {
    return { 
      success: false, 
      message: 'Location permissions not defined in app.config.ts' 
    };
  }
  
  return { 
    success: true, 
    message: 'Location services configured' 
  };
}

// Run the tests
runTests().catch(error => {
  console.error(`${colors.red}Error running tests: ${error.message}${colors.reset}`);
  process.exit(1);
}); 