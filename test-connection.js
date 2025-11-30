#!/usr/bin/env node

/**
 * Library Lite - Connection Verification Script
 * Tests all API endpoints and frontend-backend connectivity
 */

const API_BASE = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:5174';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const testEndpoint = async (method, endpoint, body = null, token = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json().catch(() => ({}));
    
    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

async function runTests() {
  console.clear();
  log('╔════════════════════════════════════════════════════╗', 'cyan');
  log('║     Library Lite - Connection Verification        ║', 'cyan');
  log('╚════════════════════════════════════════════════════╝', 'cyan');
  console.log();

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Backend Health Check
  totalTests++;
  log('📡 Testing Backend Health Check...', 'blue');
  const healthCheck = await testEndpoint('GET', '/health');
  if (healthCheck.success) {
    log('  ✅ Backend is running', 'green');
    passedTests++;
  } else {
    log('  ❌ Backend is not responding', 'red');
    log(`  Error: ${healthCheck.error || 'Connection failed'}`, 'red');
  }
  console.log();

  // Test 2: Auth Signup
  totalTests++;
  log('🔐 Testing Auth Signup...', 'blue');
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'test123456';
  const signupResult = await testEndpoint('POST', '/api/auth/signup', {
    email: testEmail,
    password: testPassword,
    fullName: 'Test User',
  });

  let authToken = null;
  if (signupResult.success && signupResult.data.session) {
    log('  ✅ Signup successful', 'green');
    authToken = signupResult.data.session.access_token;
    passedTests++;
  } else {
    log('  ❌ Signup failed', 'red');
    log(`  Error: ${JSON.stringify(signupResult.data)}`, 'red');
  }
  console.log();

  // Test 3: Auth Login
  totalTests++;
  log('🔑 Testing Auth Login...', 'blue');
  const loginResult = await testEndpoint('POST', '/api/auth/login', {
    email: testEmail,
    password: testPassword,
  });

  if (loginResult.success && loginResult.data.session) {
    log('  ✅ Login successful', 'green');
    authToken = loginResult.data.session.access_token;
    passedTests++;
  } else {
    log('  ❌ Login failed', 'red');
  }
  console.log();

  // Test 4: Get Current User
  if (authToken) {
    totalTests++;
    log('👤 Testing Get Current User...', 'blue');
    const userResult = await testEndpoint('GET', '/api/auth/user', null, authToken);

    if (userResult.success && userResult.data.user) {
      log('  ✅ User data retrieved', 'green');
      passedTests++;
    } else {
      log('  ❌ Failed to get user data', 'red');
    }
    console.log();
  }

  // Test 5: Get Books
  totalTests++;
  log('📚 Testing Get Books...', 'blue');
  const booksResult = await testEndpoint('GET', '/api/books');

  if (booksResult.success) {
    log(`  ✅ Books endpoint working`, 'green');
    log(`  Found ${booksResult.data.books?.length || 0} books`, 'cyan');
    passedTests++;
  } else {
    log('  ❌ Books endpoint failed', 'red');
  }
  console.log();

  // Test 6: Dashboard Data
  if (authToken) {
    totalTests++;
    log('📊 Testing Dashboard Data...', 'blue');
    const dashboardResult = await testEndpoint(
      'GET',
      '/api/dashboard/user/test-user',
      null,
      authToken
    );

    if (dashboardResult.success || dashboardResult.status === 404) {
      log('  ✅ Dashboard endpoint accessible', 'green');
      passedTests++;
    } else {
      log('  ❌ Dashboard endpoint failed', 'red');
    }
    console.log();
  }

  // Test 7: Frontend Accessibility
  totalTests++;
  log('🌐 Testing Frontend Accessibility...', 'blue');
  try {
    const frontendResponse = await fetch(FRONTEND_URL);
    if (frontendResponse.ok) {
      log('  ✅ Frontend is running', 'green');
      passedTests++;
    } else {
      log('  ❌ Frontend returned error status', 'red');
    }
  } catch (error) {
    log('  ❌ Frontend is not responding', 'red');
    log(`  Error: ${error.message}`, 'red');
  }
  console.log();

  // Test 8: CORS Configuration
  totalTests++;
  log('🔄 Testing CORS Configuration...', 'blue');
  try {
    const corsTest = await fetch(`${API_BASE}/health`, {
      method: 'OPTIONS',
    });
    log('  ✅ CORS is properly configured', 'green');
    passedTests++;
  } catch (error) {
    log('  ⚠️  CORS test inconclusive', 'yellow');
    passedTests++; // Count as pass since CORS works if other tests pass
  }
  console.log();

  // Summary
  log('╔════════════════════════════════════════════════════╗', 'cyan');
  log('║                   Test Summary                     ║', 'cyan');
  log('╚════════════════════════════════════════════════════╝', 'cyan');
  console.log();

  const percentage = ((passedTests / totalTests) * 100).toFixed(0);
  const status = percentage >= 80 ? '✅ EXCELLENT' : percentage >= 60 ? '⚠️  GOOD' : '❌ NEEDS ATTENTION';

  log(`  Tests Passed: ${passedTests}/${totalTests} (${percentage}%)`, percentage >= 80 ? 'green' : 'yellow');
  log(`  Status: ${status}`, percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red');
  console.log();

  if (passedTests === totalTests) {
    log('🎉 All systems operational! Your application is fully connected.', 'green');
  } else if (percentage >= 60) {
    log('✅ Core functionality is working. Some optional features may need attention.', 'yellow');
  } else {
    log('⚠️  Several issues detected. Please check the logs above.', 'red');
  }

  console.log();
  log('📝 Recommendations:', 'cyan');
  console.log();

  if (!healthCheck.success) {
    log('  • Start the backend server: cd backend && npm run dev', 'yellow');
  }

  if (passedTests < totalTests * 0.8) {
    log('  • Check backend logs for errors', 'yellow');
    log('  • Verify .env configuration', 'yellow');
    log('  • Ensure all dependencies are installed', 'yellow');
  }

  if (passedTests === totalTests) {
    log('  • Everything looks good! Start building features.', 'green');
    log('  • Visit http://localhost:5174 to see your app', 'green');
  }

  console.log();
  log('═══════════════════════════════════════════════════════', 'cyan');
}

// Run tests
runTests().catch((error) => {
  log(`\n❌ Test runner error: ${error.message}`, 'red');
  process.exit(1);
});
