# Arcade Calculator Integration

This project now uses the Arcade Calculator backend for point calculations instead of MongoDB.

## What Changed

### ✅ Removed
- MongoDB dependencies and database
- Complex user management system
- Badge storage and retrieval from database

### ✅ Added
- Arcade Calculator calculation logic
- Web scraping from Google Arcade profiles
- Real-time point calculation
- Milestone system for facilitators

## Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Build the Server

```bash
npm run server:build
```

### 3. Start the Development Environment

**Terminal 1 - Start the backend server:**
```bash
npm run server:dev
```

**Terminal 2 - Start the frontend:**
```bash
npm run dev
```

### 4. Test the Integration

The server will be running on `http://localhost:5001` and the frontend on `http://localhost:5173`.

## API Endpoints

### Main Endpoint
```
POST /api/calculate-points
```

**Request Body:**
```json
{
  "profileUrl": "https://www.cloudskillsboost.google/public_profiles/...",
  "isFacilitator": false
}
```

**Response:**
```json
{
  "points": 25,
  "badges": [
    {
      "name": "Skills Boost Love Beyond",
      "type": "game",
      "earnedDate": "2025-01-15T00:00:00.000Z"
    }
  ],
  "breakdown": {
    "gameBadges": 10,
    "triviaBadges": 5,
    "skillBadges": 10,
    "milestonePoints": 0
  },
  "milestoneProgress": {
    "currentMilestone": 2,
    "progress": 50
  }
}
```

### Compatibility Endpoints
- `GET /api/calculate-points` - Same as POST but with query parameters
- `GET /api/health` - Server health check
- `GET /api/badges` - Returns empty array (no database storage)
- `GET /api/available-badges` - Returns empty array (no database storage)

## Using the New Service

### In Your React Components

```typescript
import { badgeService } from '../services/badgeService';

// Calculate points for a profile
const calculatePoints = async (profileUrl: string) => {
  try {
    const result = await badgeService.calculatePoints(profileUrl, false);
    console.log('Total points:', result.points);
    console.log('Badges:', result.badges);
    console.log('Breakdown:', result.breakdown);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Get profile points summary
const getSummary = async (profileUrl: string) => {
  try {
    const summary = await badgeService.getProfilePointsSummary(profileUrl, true);
    console.log('Summary:', summary);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Direct API Call

```typescript
const response = await fetch('http://localhost:5001/api/calculate-points', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/...',
    isFacilitator: false
  }),
});

const result = await response.json();
```

## Calculation Logic

### Badge Types
- **Game Badges**: 1 point each (special badges = 2 points)
- **Trivia Badges**: 1 point each
- **Skill Badges**: 1 point per 2 badges (rounded down)
- **Completion Badges**: 0 points
- **Lab-Free Badges**: 0 points

### Milestone System (Facilitators Only)
- **Milestone 1 (25%)**: +2 points
- **Milestone 2 (50%)**: +8 points
- **Milestone 3 (75%)**: +15 points
- **Milestone 4 (100%)**: +25 points

### Date Filtering
- Regular points: Only badges after January 8th, 2025
- Milestone points: Only badges after April 1st, 2025

## Migration Notes

### Old vs New Methods

| Old Method | New Method | Notes |
|------------|------------|-------|
| `calculateUserPoints(userId)` | `calculatePoints(profileUrl)` | Now requires profile URL |
| `getUserBadges(userId)` | `getProfileBadges(profileUrl)` | Now requires profile URL |
| `getUserPointsSummary(userId)` | `getProfilePointsSummary(profileUrl)` | Now requires profile URL |

### Breaking Changes
- All methods now require a Google Arcade profile URL instead of user ID
- No more database storage of badges or users
- Real-time calculation from live profile data
- Badge awarding is not supported (badges are earned through Google Arcade)

## Development

### Server Development
```bash
cd server
npm run dev  # Auto-reload on changes
```

### Frontend Development
```bash
npm run dev  # Vite dev server
```

### Building for Production
```bash
# Build server
npm run server:build

# Build frontend
npm run build

# Start production server
npm run server
```

## Troubleshooting

### Common Issues

1. **Server not starting**: Make sure you've installed server dependencies
   ```bash
   cd server && npm install
   ```

2. **CORS errors**: The server includes CORS configuration, but check if your frontend is calling the correct URL

3. **Profile URL errors**: Ensure the profile URL is valid and accessible

4. **Calculation errors**: Check the server logs for detailed error information

### Testing

Use the existing test files:
- `test_api.js` - Tests the main API endpoint
- `test_profile.js` - Tests with a specific profile
- `test_updated_calculation.js` - Tests various scenarios

## Environment Variables

- `PORT` - Server port (default: 5001)

## Support

For issues with the calculation logic or API, refer to the original Arcade Calculator documentation in the `arcade-calculator-backend` folder. 