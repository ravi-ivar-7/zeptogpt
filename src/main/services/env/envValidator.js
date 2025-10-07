/* eslint-disable @typescript-eslint/no-require-imports */
const { checkEnvironmentVariables } = require('./envChecker');

/**
 * Environment Validator for Server Startup
 * Automatically validates all environment variables when imported
 */

let validationRun = false;

function validateEnvironment() {
  if (validationRun) return;
  validationRun = true;

  console.log('\n🔧 Validating environment variables...');
  
  const isValid = checkEnvironmentVariables();
  
  if (!isValid) {
    console.warn('\n⚠️  Environment validation completed with missing variables.');
    console.warn('Server will continue running, but some features may not work properly.');
    console.warn('Please add the missing variables to your .env file for full functionality.\n');
  } else {
    console.log('✅ Environment validation passed!\n');
  }
}

// Run validation immediately when this module is imported
validateEnvironment();

module.exports = { validateEnvironment };
