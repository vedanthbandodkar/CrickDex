// API Key Manager - Handles rotation and rate limiting
class APIKeyManager {
  constructor(keys, rateLimit) {
    this.keys = keys || [];
    this.rateLimit = rateLimit;
    this.currentKeyIndex = 0;
    this.keyUsage = new Map(); // Track usage per key
    this.keyErrors = new Map(); // Track errors per key
    
    // Initialize usage tracking
    this.keys.forEach((key, index) => {
      this.keyUsage.set(index, {
        requestsThisMinute: 0,
        requestsToday: 0,
        lastReset: Date.now(),
        lastDayReset: new Date().setHours(0, 0, 0, 0),
        isBlocked: false,
        blockUntil: null
      });
      this.keyErrors.set(index, 0);
    });
  }

  // Get the next available API key
  getNextAvailableKey() {
    const now = Date.now();
    const today = new Date().setHours(0, 0, 0, 0);

    // Reset counters if needed
    this.keys.forEach((key, index) => {
      const usage = this.keyUsage.get(index);
      
      // Reset minute counter
      if (now - usage.lastReset >= 60000) {
        usage.requestsThisMinute = 0;
        usage.lastReset = now;
      }
      
      // Reset daily counter
      if (today > usage.lastDayReset) {
        usage.requestsToday = 0;
        usage.lastDayReset = today;
      }
      
      // Check if key should be unblocked
      if (usage.isBlocked && usage.blockUntil && now > usage.blockUntil) {
        usage.isBlocked = false;
        usage.blockUntil = null;
      }
    });

    // Find available key starting from current index
    for (let i = 0; i < this.keys.length; i++) {
      const keyIndex = (this.currentKeyIndex + i) % this.keys.length;
      const usage = this.keyUsage.get(keyIndex);
      
      if (!usage.isBlocked && 
          usage.requestsThisMinute < this.rateLimit.requestsPerMinute &&
          usage.requestsToday < this.rateLimit.requestsPerDay) {
        
        this.currentKeyIndex = keyIndex;
        return {
          key: this.keys[keyIndex],
          index: keyIndex
        };
      }
    }

    // All keys are rate limited
    throw new Error('All API keys are rate limited. Please wait.');
  }

  // Record API usage
  recordUsage(keyIndex, success = true) {
    const usage = this.keyUsage.get(keyIndex);
    if (usage) {
      usage.requestsThisMinute++;
      usage.requestsToday++;
      
      if (!success) {
        const errors = this.keyErrors.get(keyIndex) + 1;
        this.keyErrors.set(keyIndex, errors);
        
        // Block key if too many errors (more than 10 in a row)
        if (errors > 10) {
          usage.isBlocked = true;
          usage.blockUntil = Date.now() + this.rateLimit.cooldownTime;
        }
      } else {
        // Reset error count on success
        this.keyErrors.set(keyIndex, 0);
      }
    }
  }

  // Get usage statistics
  getUsageStats() {
    const stats = [];
    this.keys.forEach((key, index) => {
      const usage = this.keyUsage.get(index);
      const errors = this.keyErrors.get(index);
      stats.push({
        keyIndex: index,
        requestsThisMinute: usage.requestsThisMinute,
        requestsToday: usage.requestsToday,
        isBlocked: usage.isBlocked,
        errors: errors,
        key: key.substring(0, 8) + '...' // Partial key for identification
      });
    });
    return stats;
  }
}

export default APIKeyManager;
