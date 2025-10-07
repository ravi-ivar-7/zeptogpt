#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

/**
 * Environment Variable Checker
 * Searches all files for process.env usage and validates against .env file
 */

// Function to recursively find all JS/TS/JSX/TSX files
function findFiles(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (!['node_modules', '.next', '.git'].includes(file)) {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to extract environment variables from file content
function extractEnvVars(content) {
  const envVarRegex = /process\.env\.([A-Z_][A-Z0-9_]*)/g;
  const matches = [];
  let match;
  
  while ((match = envVarRegex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  
  return [...new Set(matches)]; // Remove duplicates
}

// Function to load .env file
function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    return {};
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return envVars;
}

// Main function to check environment variables
function checkEnvironmentVariables() {
  const projectRoot = path.resolve(__dirname, '../../../..');
  const srcDir = path.join(projectRoot, 'src');
  const envPath = path.join(projectRoot, '.env');
  const envLocalPath = path.join(projectRoot, '.env.local');
  
  console.log('🔍 Scanning project for environment variables...\n');
  
  // Find all relevant files
  const files = findFiles(srcDir);
  console.log(`📁 Found ${files.length} files to scan\n`);
  
  // Extract all environment variables used in the project
  const allEnvVars = new Set();
  const fileUsage = {};
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const envVars = extractEnvVars(content);
    
    if (envVars.length > 0) {
      const relativePath = path.relative(projectRoot, file);
      fileUsage[relativePath] = envVars;
      envVars.forEach(envVar => allEnvVars.add(envVar));
    }
  });
  
  console.log(`🎯 Found ${allEnvVars.size} unique environment variables:\n`);
  
  // Load environment files
  const envVars = loadEnvFile(envPath);
  const envLocalVars = loadEnvFile(envLocalPath);
  const allDefinedVars = { ...envVars, ...envLocalVars };
  
  console.log(`📄 Environment files:`);
  console.log(`   .env: ${fs.existsSync(envPath) ? '✅ Found' : '❌ Not found'}`);
  console.log(`   .env.local: ${fs.existsSync(envLocalPath) ? '✅ Found' : '❌ Not found'}\n`);
  
  // Check each environment variable
  const missing = [];
  const defined = [];
  
  Array.from(allEnvVars).sort().forEach(envVar => {
    const isDefined = allDefinedVars.hasOwnProperty(envVar);
    const hasValue = isDefined && allDefinedVars[envVar] && allDefinedVars[envVar].trim() !== '';
    
    if (isDefined && hasValue) {
      defined.push(envVar);
      console.log(`✅ ${envVar}`);
    } else if (isDefined && !hasValue) {
      missing.push(envVar);
      console.log(`⚠️  ${envVar} (defined but empty)`);
    } else {
      missing.push(envVar);
      console.log(`❌ ${envVar} (not defined)`);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Defined: ${defined.length}`);
  console.log(`   ❌ Missing: ${missing.length}`);
  
  if (missing.length > 0) {
    console.log(`\n🚨 Missing Environment Variables:`);
    missing.forEach(envVar => {
      console.log(`   - ${envVar}`);
      
      // Show which files use this variable
      const usingFiles = Object.entries(fileUsage)
        .filter(([file, vars]) => vars.includes(envVar))
        .map(([file]) => file);
      
      if (usingFiles.length > 0) {
        console.log(`     Used in: ${usingFiles.slice(0, 3).join(', ')}${usingFiles.length > 3 ? '...' : ''}`);
      }
    });
    
    console.log(`\n💡 Add these to your .env file:`);
    missing.forEach(envVar => {
      console.log(`${envVar}=`);
    });
    
    return false; // Validation failed
  }
  
  console.log(`\n🎉 All environment variables are properly configured!`);
  return true; // Validation passed
}

// Export for use in other modules
module.exports = { checkEnvironmentVariables };

// Run directly if called from command line
if (require.main === module) {
  const success = checkEnvironmentVariables();
  process.exit(success ? 0 : 1);
}
