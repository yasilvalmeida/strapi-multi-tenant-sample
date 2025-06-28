#!/usr/bin/env node

/**
 * Multi-Tenancy Test Script
 * This script demonstrates how to create and test multi-tenant content
 */

const jwt = require('jsonwebtoken');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-here';

// Test tenants
const tenants = [
  {
    id: 'tenant-a',
    name: 'Tech Blog',
    user: { id: 1, username: 'tech-admin', email: 'tech@example.com' },
  },
  {
    id: 'tenant-b',
    name: 'Fashion Magazine',
    user: { id: 2, username: 'fashion-admin', email: 'fashion@example.com' },
  },
  {
    id: 'tenant-c',
    name: 'Food Blog',
    user: { id: 3, username: 'food-admin', email: 'food@example.com' },
  },
];

// Sample content for each tenant
const sampleContent = {
  'tenant-a': [
    {
      title: 'The Future of AI in 2024',
      content:
        '# AI Revolution\n\nArtificial Intelligence is transforming every industry...',
      slug: 'future-of-ai-2024',
      author: 'Tech Writer',
    },
    {
      title: 'JavaScript Performance Tips',
      content:
        '# Optimizing JavaScript\n\nHere are the best practices for JavaScript performance...',
      slug: 'javascript-performance-tips',
      author: 'Dev Expert',
    },
  ],
  'tenant-b': [
    {
      title: 'Spring Fashion Trends 2024',
      content: '# Fashion Forward\n\nThis season brings exciting new trends...',
      slug: 'spring-fashion-2024',
      author: 'Fashion Editor',
    },
    {
      title: 'Sustainable Fashion Movement',
      content:
        '# Eco-Friendly Style\n\nThe fashion industry is embracing sustainability...',
      slug: 'sustainable-fashion',
      author: 'Style Guru',
    },
  ],
  'tenant-c': [
    {
      title: 'Perfect Pasta Recipe',
      content:
        '# Homemade Pasta\n\nStep-by-step guide to making perfect pasta from scratch...',
      slug: 'perfect-pasta-recipe',
      author: 'Chef Master',
    },
    {
      title: 'Mediterranean Diet Benefits',
      content:
        '# Healthy Eating\n\nDiscover the amazing benefits of Mediterranean cuisine...',
      slug: 'mediterranean-diet-benefits',
      author: 'Nutrition Expert',
    },
  ],
};

/**
 * Generate JWT token for a tenant
 */
function generateTenantToken(tenant) {
  const payload = {
    id: tenant.user.id,
    tenant_id: tenant.id,
    username: tenant.user.username,
    email: tenant.user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
  };

  return jwt.sign(payload, JWT_SECRET);
}

/**
 * Make API request
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${STRAPI_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error.message);
    return null;
  }
}

/**
 * Create content for a tenant
 */
async function createTenantContent(tenant) {
  const token = generateTenantToken(tenant);
  const articles = sampleContent[tenant.id];

  console.log(`\n📝 Creating content for ${tenant.name} (${tenant.id})...`);

  for (const article of articles) {
    const result = await apiRequest('/api/articles', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: article }),
    });

    if (result) {
      console.log(`   ✅ Created: "${article.title}"`);
    } else {
      console.log(`   ❌ Failed: "${article.title}"`);
    }
  }
}

/**
 * Test tenant isolation
 */
async function testTenantIsolation(tenant) {
  const token = generateTenantToken(tenant);

  console.log(`\n🔒 Testing isolation for ${tenant.name} (${tenant.id})...`);

  const result = await apiRequest('/api/articles', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (result && result.data) {
    console.log(
      `   📊 Found ${result.data.length} articles for ${tenant.name}`
    );
    result.data.forEach((article) => {
      console.log(
        `   - ${article.attributes.title} (tenant: ${article.attributes.tenant_id})`
      );
    });
  } else {
    console.log(`   ❌ Failed to fetch articles for ${tenant.name}`);
  }
}

/**
 * Test webhook configuration
 */
async function testWebhookConfig(tenant) {
  const token = generateTenantToken(tenant);

  console.log(
    `\n🪝 Testing webhook config for ${tenant.name} (${tenant.id})...`
  );

  const result = await apiRequest('/api/webhooks/config', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (result && result.data) {
    console.log(`   ✅ Webhook URL: ${result.data.webhook_url}`);
    console.log(
      `   📋 Supported events: ${result.data.supported_events.join(', ')}`
    );
  } else {
    console.log(`   ❌ Failed to fetch webhook config for ${tenant.name}`);
  }
}

/**
 * Display JWT tokens for manual testing
 */
function displayJWTokens() {
  console.log('\n🔑 Generated JWT Tokens for Testing:\n');

  tenants.forEach((tenant) => {
    const token = generateTenantToken(tenant);
    console.log(`${tenant.name} (${tenant.id}):`);
    console.log(`${token}\n`);
  });

  console.log('💡 Use these tokens in your API requests:');
  console.log(
    'curl -H "Authorization: Bearer [token]" http://localhost:1337/api/articles\n'
  );
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting Multi-Tenancy Tests...');
  console.log(`📡 Strapi URL: ${STRAPI_URL}`);

  // Check if Strapi is running
  const healthCheck = await apiRequest('/admin/plugins/upload/settings');
  if (!healthCheck && !healthCheck?.error) {
    console.log('\n❌ Strapi server is not running or not accessible');
    console.log('Please start Strapi with: npm run develop');
    return;
  }

  console.log('✅ Strapi server is running');

  // Display JWT tokens
  displayJWTokens();

  // Create content for each tenant
  for (const tenant of tenants) {
    await createTenantContent(tenant);
  }

  // Test tenant isolation
  for (const tenant of tenants) {
    await testTenantIsolation(tenant);
  }

  // Test webhook configuration
  for (const tenant of tenants) {
    await testWebhookConfig(tenant);
  }

  console.log('\n🎉 Multi-tenancy tests completed!');
  console.log('\n💡 Next steps:');
  console.log(
    '1. Visit http://localhost:1337/admin to see the created content'
  );
  console.log('2. Use the JWT tokens above to test API access');
  console.log('3. Try creating content with different tenant tokens');
  console.log('4. Configure webhook URLs in your .env file');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error(
    '❌ This script requires Node.js 18+ with built-in fetch support'
  );
  console.error('Or install node-fetch: npm install node-fetch');
  process.exit(1);
}

// Run the tests
runTests().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
