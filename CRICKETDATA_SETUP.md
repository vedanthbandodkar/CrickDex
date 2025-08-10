# 🏏 CrickDex - CricketData.org FREE API Setup Guide

## 📋 Overview
Your CrickDex application is configured to use **CricketData.org FREE TIER** for real-time cricket data. This setup is optimized for the free tier limitations with smart caching and conservative request patterns.

## 🆓 Free Tier Specifications
- **Daily Limit:** 100 requests per day
- **Rate Limit:** 25 requests per minute (conservative)
- **Features:** Basic match data, player info, series data
- **Cost:** Completely FREE!

## 🔑 Getting API Keys

### Step 1: Sign Up at CricketData.org
1. Visit: https://cricketdata.org/member.aspx
2. Create a free account (or choose a paid plan for higher limits)
3. Get your API key(s) from the member dashboard

### Step 2: Configure Your FREE API Key
Choose one of these methods:

#### Method A: Environment Variables (Recommended)
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual FREE API key
VITE_CRICKETDATA_FREE_KEY=your_actual_free_cricketdata_key
```

#### Method B: Direct Configuration
Edit `src/config/apiKeys.js`:
```javascript
export const API_KEYS = {
  cricketdata: [
    'your_actual_free_cricketdata_key'
  ]
};
```

## 🚀 Available API Endpoints

Your CrickDex now supports these real-time cricket data features:

### 📊 Live Data
- **Current Matches** - Live ongoing matches
- **Recent Matches** - Recently completed matches  
- **Cricket Series** - Ongoing and upcoming series

### 👥 Players & Teams
- **Player Search** - Search through cricket players database
- **Player Info** - Detailed player statistics and info
- **Squad Information** - Team squads for series

### 🏆 Match Details
- **Match Information** - Detailed match data
- **Live Scorecard** - Real-time match scores
- **Fantasy Data** - Fantasy cricket points and analysis

## 🎯 Using the API in Components

### Example: Get Live Matches
```jsx
import { useLiveMatches } from '../hooks/useCricketData.js';

const MyComponent = () => {
  const { liveMatches, loading, error } = useLiveMatches();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {liveMatches.map(match => (
        <div key={match.id}>{match.name}</div>
      ))}
    </div>
  );
};
```

### Example: Search Players
```jsx
import cricketDataService from '../services/CricketDataService.js';

const searchPlayers = async (searchTerm) => {
  try {
    const result = await cricketDataService.searchPlayers(searchTerm);
    console.log('Players found:', result.data);
  } catch (error) {
    console.error('Search failed:', error.message);
  }
};
```

## 🔧 Available Methods

### CricketDataService Methods:
- `getLiveMatches()` - Get currently running matches
- `getRecentMatches()` - Get recently completed matches  
- `getAllSeries()` - Get all cricket series
- `searchSeries(term)` - Search for specific series
- `searchPlayers(term)` - Search for players
- `getPlayerStats(playerId)` - Get player details
- `getMatchDetails(matchId)` - Get detailed match info
- `getSeriesInfo(seriesId)` - Get series information
- `getFantasySquad(matchId)` - Get fantasy squad data

## 📱 Where to See Live Data

### Home Page (`/`)
- Live matches widget (auto-refreshes every 30 seconds)
- Recent cricket series widget
- Real-time updates

### Admin Dashboard (`/admin`)
- API usage monitoring
- Key rotation status  
- System health checks
- Configuration management

### Player Profiles (can be enhanced)
- Live player statistics
- Recent performance data

## ⚙️ FREE Tier Optimizations

### Smart Caching (10 minutes)
- **Cache timeout:** 10 minutes (vs 5 for paid)
- **Fewer API calls:** Data is cached longer to preserve your daily limit
- **Intelligent refresh:** Components refresh every 2 minutes (vs 30 seconds)

### Rate Limits (FREE TIER)
- **Requests per minute:** 25 (conservative)
- **Requests per day:** 100 (FREE tier limit)
- **Cache strategy:** Aggressive caching to maximize data freshness within limits
- **Auto-pause:** System automatically pauses when nearing daily limit

### Recommended Usage Pattern
```javascript
// ✅ GOOD - Use cached data when possible
const { liveMatches } = useLiveMatches(); // Auto-cached for 10 minutes

// ✅ GOOD - Manual refresh only when needed  
const refresh = () => {
  // Only refresh if really needed
  window.location.reload();
};

// ❌ AVOID - Frequent manual API calls
// Don't call service methods repeatedly in short intervals
```

### API Response Format
```javascript
{
  "apikey": "your-key",
  "status": "success",
  "data": [...], // Your actual data
  "info": {
    "hitsToday": 10,
    "hitsLimit": 500,
    // ... more metadata
  }
}
```

## 🐛 Testing & Debugging

### Test Your Setup
```javascript
// In browser console
window.testCrickDexAPIs()

// Or test individual APIs
const service = window.cricketDataService;
const matches = await service.getLiveMatches();
console.log(matches);
```

### Health Check
Visit `/admin` in your application to see:
- API connection status
- Usage statistics per key
- Error logs and debugging info
- Cache performance

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for production
3. **Monitor usage** in admin dashboard
4. **Rotate keys regularly** if needed

## 📈 Upgrade Path

### Free Tier Benefits
- **100 API calls per day** - Perfect for personal projects
- **All basic features** - Live matches, player data, series info
- **Smart caching** - Maximizes data freshness within limits
- **No credit card required** - Completely free signup

### What You Get FREE
- ✅ Current live matches
- ✅ Recent match results  
- ✅ Player information & search
- ✅ Cricket series data
- ✅ Basic match details
- ✅ Team/squad information

### Upgrade Benefits (if needed later)
- 🚀 Higher daily limits (500+ requests)
- 🚀 Ball-by-ball commentary
- 🚀 Historical match data  
- 🚀 Advanced analytics
- 🚀 Fantasy points data

## 🆘 Troubleshooting

### Common Issues:

1. **"Daily limit reached"**
   - Wait for next day reset (midnight UTC)
   - Check `/admin` dashboard for usage stats
   - Consider upgrading if you need more requests

2. **"API request failed"** 
   - Check if your free API key is valid
   - Visit admin dashboard for diagnostics
   - Verify internet connection

3. **"Data seems old"**
   - Normal with 10-minute caching (FREE tier optimization)
   - Manual refresh available in admin dashboard
   - Live matches still update every 2 minutes

### Getting Help
- Check `/admin` dashboard first
- Look at browser console for errors
- Visit cricketdata.org for API documentation
- Contact: contact@cricketdata.org

## 🎊 You're Ready with FREE Tier!

Once you add your FREE API key, your CrickDex will have:
- ✅ Real-time live match data (refreshed every 2 minutes)
- ✅ Comprehensive player database with search
- ✅ Series and tournament information  
- ✅ Smart rate limit management (100 requests/day)
- ✅ 10-minute intelligent caching for optimal performance
- ✅ Admin dashboard for usage monitoring

Perfect for personal use, learning, or small projects! 🏏

**Daily Usage Tips:**
- Check `/admin` to monitor your 100 daily requests
- Data updates automatically every 2 minutes for live matches
- 10-minute cache means you get fresh data without wasting requests
- Upgrade anytime if you need higher limits
