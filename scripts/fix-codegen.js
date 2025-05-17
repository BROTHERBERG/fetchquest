const fs = require('fs');
const path = require('path');

// Path to the file we need to modify
const filePath = path.join(
  __dirname, 
  '../node_modules/react-native/scripts/generate-codegen-artifacts.js'
);

try {
  if (fs.existsSync(filePath)) {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the problematic line
    content = content.replace(
      'executor.generateSchemaType(process.argv.slice(2));',
      '// Skip generating schema types to avoid the error'
    );
    
    // Write the modified content back
    fs.writeFileSync(filePath, content);
    console.log('Successfully patched generate-codegen-artifacts.js');
  } else {
    console.log('File not found:', filePath);
  }
} catch (error) {
  console.error('Error patching file:', error);
}