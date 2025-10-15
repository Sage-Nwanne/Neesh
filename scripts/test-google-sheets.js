#!/usr/bin/env node

/**
 * Google Sheets Integration Test Script
 * Tests the sync-to-sheets function and validates the setup
 */

const https = require('https');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testGoogleSheetsIntegration() {
  log('\n🚀 NEESH Google Sheets Integration Test', 'cyan');
  log('=====================================\n', 'cyan');

  try {
    // Get project details from user
    logInfo('Please provide your Supabase project details:');
    
    const projectRef = await askQuestion('Enter your Supabase project reference (from URL): ');
    const anonKey = await askQuestion('Enter your Supabase anon key: ');

    if (!projectRef || !anonKey) {
      logError('Project reference and anon key are required');
      process.exit(1);
    }

    // Construct function URL
    const functionUrl = `https://${projectRef}.supabase.co/functions/v1/sync-to-sheets`;
    
    logInfo(`Testing function at: ${functionUrl}`);
    logInfo('Making request...\n');

    // Test the function
    const response = await makeRequest(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Analyze response
    log(`Status Code: ${response.statusCode}`, response.statusCode === 200 ? 'green' : 'red');
    
    let responseData;
    try {
      responseData = JSON.parse(response.body);
    } catch (e) {
      logError('Invalid JSON response');
      log(`Raw response: ${response.body}`, 'yellow');
      process.exit(1);
    }

    if (response.statusCode === 200) {
      logSuccess('Function executed successfully!');
      
      if (responseData.success) {
        logSuccess('Google Sheets sync completed successfully');
        
        if (responseData.results) {
          log('\n📊 Sync Results:', 'blue');
          responseData.results.forEach(result => {
            if (result.status === 'success') {
              logSuccess(`${result.sheetName}: ${result.rowsUpdated} rows, ${result.columnsUpdated} columns`);
            } else if (result.status === 'skipped') {
              logWarning(`${result.sheetName}: ${result.reason}`);
            } else {
              logError(`${result.sheetName}: ${result.error}`);
            }
          });
        }
        
        log(`\n🕒 Sync completed at: ${responseData.timestamp}`, 'cyan');
        
      } else {
        logError('Sync failed');
        if (responseData.error) {
          logError(`Error: ${responseData.error}`);
        }
      }
      
    } else {
      logError(`Function returned error status: ${response.statusCode}`);
      
      if (responseData.error) {
        logError(`Error: ${responseData.error}`);
        
        // Provide specific help based on error type
        if (responseData.error.includes('Missing Google Sheets configuration')) {
          log('\n🔧 Setup Required:', 'yellow');
          log('1. Set GOOGLE_SHEETS_ID environment variable');
          log('2. Set GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable');
          log('3. Set GOOGLE_PRIVATE_KEY environment variable');
          log('\nSee: scripts/setup-google-sheets-complete.md for details');
        }
        
        if (responseData.error.includes('Permission denied')) {
          log('\n🔧 Permission Issue:', 'yellow');
          log('1. Make sure you shared the Google Sheets document with the service account');
          log('2. Verify the service account has Editor permissions');
          log('3. Check that the spreadsheet ID is correct');
        }
      }
    }

  } catch (error) {
    logError(`Test failed: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      logError('Could not connect to Supabase. Check your project reference.');
    } else if (error.code === 'ECONNREFUSED') {
      logError('Connection refused. Check if the function is deployed.');
    }
  }

  rl.close();
}

// Additional utility functions
async function validateEnvironmentSetup() {
  log('\n🔍 Environment Validation Checklist', 'cyan');
  log('==================================\n', 'cyan');

  const checklist = [
    'Google Cloud Project created',
    'Google Sheets API enabled',
    'Service Account created',
    'Service Account key downloaded',
    'Google Sheets document created with proper tabs',
    'Google Sheets document shared with service account',
    'GOOGLE_SHEETS_ID environment variable set in Supabase',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable set in Supabase',
    'GOOGLE_PRIVATE_KEY environment variable set in Supabase',
    'sync-to-sheets function deployed to Supabase'
  ];

  for (const item of checklist) {
    const completed = await askQuestion(`✓ ${item}? (y/n): `);
    if (completed.toLowerCase() !== 'y') {
      logWarning(`Please complete: ${item}`);
      log('See: scripts/setup-google-sheets-complete.md for instructions\n');
      return false;
    }
  }

  logSuccess('All environment setup items completed!');
  return true;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--validate') || args.includes('-v')) {
    const isValid = await validateEnvironmentSetup();
    if (!isValid) {
      process.exit(1);
    }
  }
  
  await testGoogleSheetsIntegration();
  
  log('\n🎉 Test completed!', 'green');
  log('If the test was successful, your Google Sheets integration is working correctly.', 'blue');
  log('You can now use the sync button in your CMS interface.\n', 'blue');
}

// Handle script execution
if (require.main === module) {
  main().catch(error => {
    logError(`Script failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  testGoogleSheetsIntegration,
  validateEnvironmentSetup
};
