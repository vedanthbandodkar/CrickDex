# CrickDex Real-time API Integration Setup Guide

This guide will help you set up real-time cricket data APIs for your CrickDex application.

## 🚀 Quick Start

### 1. API Keys Setup

You can configure API keys in two ways:

#### Option A: Environment Variables (Recommended for Production)
1. Copy `.env.example` to `.env.local`
2. Replace placeholder values with your actual API keys
3. Restart your development server

#### Option B: Direct Configuration (Development Only)
1. Open `src/config/apiKeys.js`
2. Replace the placeholder strings with your actual API keys
3. **Never commit actual keys to version control!**

### 2. Getting API Keys

#### RapidAPI (CricBuzz Cricket API)
1. Go to [RapidAPI CricBuzz](https://rapidapi.com/cricketapi/api/cricbuzz-cricket)
2. Subscribe to the API (they have free tiers)
3. Copy your API key from the dashboard
4. You can create multiple accounts to get more keys

#### CricAPI
1. Visit [CricAPI](https://www.cricapi.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Consider getting multiple accounts for higher limits

## 🔧 Features Implemented

### Real-time Data Components
- **Live Matches Widget**: Shows currently ongoing matches with live updates
- **Live Rankings Widget**: Displays current team rankings across formats
- **API Status Dashboard**: Monitor API health and usage statistics

### Smart API Management
- **Multiple Key Rotation**: Automatically rotates between API keys to avoid rate limits
- **Fallback Support**: If one API fails, it tries another
- **Caching**: Reduces API calls with intelligent caching
- **Rate Limiting**: Built-in rate limiting to stay within API quotas

### Integration Points

#### Home Page (`src/pages/Home.jsx`)
- Added live matches and rankings widgets
- Real-time data updates every 30 seconds

#### Admin Dashboard (`/admin`)
- Monitor all API keys usage
- View system health
- Check recent matches data
- Configuration management

## 📊 API Services Available

### 1. RapidAPI Service
- Live matches
- Player statistics  
- Current rankings
- Match details with commentary
- Recent matches

### 2. CricAPI Service
- Current matches
- Player information
- Match information
- Fantasy summary
- Match squads

## 🎯 Usage Examples

### Using Hooks in Components
```jsx
import { useLiveMatches, useRankings } from '../hooks/useCricketData.js';

const MyComponent = () => {
  const { liveMatches, loading, error, refresh } = useLiveMatches(30000);
  const { rankings } = useRankings('odi');
  
  // Your component logic
};
```

### Direct Service Usage
```jsx
import cricketDataService from '../services/CricketDataService.js';

// Get live matches
const liveData = await cricketDataService.getLiveMatches();

// Get player stats with fallback
const playerData = await cricketDataService.getPlayerStats(playerId);
```

## 🔐 Security Best Practices

1. **Never commit API keys** to version control
2. Use **environment variables** for production
3. Add `.env.local` to your `.gitignore`
4. Rotate keys periodically
5. Monitor usage to detect abuse

## 🚨 Rate Limiting Strategy

The system automatically:
- Rotates between multiple API keys
- Tracks usage per key
- Blocks overused keys temporarily
- Caches responses to reduce calls
- Falls back to alternative APIs

## 📈 Monitoring & Debugging

Visit `/admin` in your application to:
- Check API health status
- Monitor key usage statistics
- View recent API calls
- Test API connections
- Clear cache if needed

## 🛠️ Customization

### Adding New APIs
1. Add endpoints to `src/config/apiKeys.js`
2. Create a service class in `src/services/`
3. Update `CricketDataService.js` to include the new service
4. Add corresponding hooks in `src/hooks/useCricketData.js`

### Modifying Rate Limits
Update the `RATE_LIMITS` object in `src/config/apiKeys.js`:

```javascript
export const RATE_LIMITS = {
  rapidapi: {
    requestsPerMinute: 100,
    requestsPerDay: 1000,
    cooldownTime: 60000
  }
};
```

## 🔍 Troubleshooting

### Common Issues

1. **"All API keys are rate limited"**
   - Add more API keys
   - Wait for rate limit reset
   - Check admin dashboard for key status

2. **"Unable to fetch data from any source"**
   - Verify API keys are correct
   - Check network connectivity
   - Visit admin dashboard for detailed errors

3. **High API usage**
   - Increase cache timeout
   - Reduce refresh intervals
   - Monitor usage patterns in admin dashboard

### Debug Mode
Set `VITE_ENABLE_DEVELOPMENT_MODE=true` in your environment to see detailed console logs.

## 📞 Support

- Check the admin dashboard first for detailed error messages
- Review console logs for API call details
- Verify API key validity on respective provider websites
- Monitor rate limiting status

## 🎉 Next Steps

1. Get your API keys from the providers
2. Configure them in the application
3. Visit `/admin` to verify setup
4. Start using real-time cricket data!

The system is designed to be robust and handle failures gracefully. With multiple API keys and fallback mechanisms, you'll have reliable access to cricket data for your CrickDex application.
