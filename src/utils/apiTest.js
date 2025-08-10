import cricketDataService from '../services/CricketDataService.js';
import { validateConfig } from '../config/apiKeys.js';

// Simple test function to verify API setup
export const testAPISetup = async () => {
  console.log('🏏 Testing CrickDex API Setup...\n');
  
  // 1. Validate configuration
  console.log('1. Validating Configuration...');
  const config = validateConfig();
  
  if (!config.isValid) {
    console.warn('⚠️  Configuration Issues Found:');
    config.issues.forEach(issue => console.warn(`   - ${issue}`));
    console.log('   Please update your API keys before testing.\n');
  } else {
    console.log('✅ Configuration looks good!\n');
  }
  
  // 2. Test API Health
  console.log('2. Testing API Health...');
  try {
    const health = await cricketDataService.healthCheck();
    Object.entries(health).forEach(([api, status]) => {
      if (status.status === 'healthy') {
        console.log(`✅ ${api.toUpperCase()}: Working`);
      } else {
        console.log(`❌ ${api.toUpperCase()}: ${status.error}`);
      }
    });
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
  
  console.log('\n3. Usage Statistics:');
  try {
    const stats = cricketDataService.getUsageStats();
    Object.entries(stats).forEach(([api, data]) => {
      if (Array.isArray(data)) {
        console.log(`📊 ${api.toUpperCase()}: ${data.length} keys configured`);
      } else if (api === 'cache') {
        console.log(`💾 Cache: ${data.size} entries`);
      }
    });
  } catch (error) {
    console.error('❌ Stats retrieval failed:', error.message);
  }
  
  console.log('\n🎯 Test Complete! Check the admin dashboard at /admin for detailed monitoring.');
};

// Test individual API services
export const testRapidAPI = async () => {
  try {
    console.log('Testing RapidAPI...');
    const data = await cricketDataService.getLiveMatches();
    console.log('✅ RapidAPI working:', data.source);
    return true;
  } catch (error) {
    console.error('❌ RapidAPI failed:', error.message);
    return false;
  }
};

export const testCricAPI = async () => {
  try {
    console.log('Testing CricAPI...');
    const data = await cricketDataService.getRecentMatches();
    console.log('✅ CricAPI working:', data.source);
    return true;
  } catch (error) {
    console.error('❌ CricAPI failed:', error.message);
    return false;
  }
};

// Export for use in components or console
if (typeof window !== 'undefined') {
  window.testCrickDexAPIs = testAPISetup;
  window.cricketDataService = cricketDataService;
}
