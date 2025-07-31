import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { 
  Badge, 
  Points, 
  MilestoneProgress, 
  CalculationResult,
  determineBadgeType,
  calculateArcadePoints
} from './calculationLogic';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/calculate-points', async (req, res) => {
  try {
    const { profileUrl, isFacilitator } = req.body;
    console.log('Received request with:', { profileUrl, isFacilitator });

    if (!profileUrl || typeof profileUrl !== 'string') {
      return res.status(400).json({ error: 'Profile URL is required' });
    }

    // Validate URL format or return demo data for testing
    if (!profileUrl.startsWith('https://www.cloudskillsboost.google/public_profiles/')) {
      // Return demo data for invalid URLs or testing
      const demoBadges: Badge[] = [
        {
          name: 'Google Cloud Fundamentals: Core Infrastructure',
          type: 'skill',
          earnedDate: new Date().toISOString()
        },
        {
          name: 'Getting Started: Create and Manage Cloud Resources',
          type: 'game',
          earnedDate: new Date().toISOString()
        },
        {
          name: 'Cloud Architecture: Design, Implement, and Manage',
          type: 'trivia',
          earnedDate: new Date().toISOString()
        }
      ];
      
      const result: CalculationResult = calculateArcadePoints(demoBadges, isFacilitator === true);
      
      const formattedResponse = {
        success: true,
        user: {
          points: result.points.total,
          badges: result.badges.map(badge => ({
            name: badge.name,
            type: badge.type,
            earnedDate: badge.earnedDate,
            points: badge.type === 'skill' ? 0.5 : badge.type === 'game' ? 1 : badge.type === 'trivia' ? 1 : 0,
            category: badge.type,
            completed: true,
          })),
        },
      };
      
      console.log('Demo data for invalid URL:', formattedResponse);
      return res.json(formattedResponse);
    }

    const response = await axios.get(profileUrl);
    const $ = cheerio.load(response.data);

    const badges: Badge[] = [];

    // Find all profile badges
    $('.profile-badge').each((_, element) => {
      const $element = $(element);
      
      // Get badge name from the title span
      const name = $element.find('.ql-title-medium.l-mts').text().trim();
      
      // Get earned date from the body span
      const dateText = $element.find('.ql-body-medium.l-mbs').text().trim();
      
      // Extract date from the text (e.g., "Earned Dec 17, 2024 EST" or "Earned Apr 3, 2025 EDT")
      const dateMatch = dateText.match(/Earned (.+?) (?:EST|EDT)/);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        // Parse the date string to a proper Date object
        const earnedDate = new Date(dateStr);
        
        if (name && !isNaN(earnedDate.getTime())) {
          const type = determineBadgeType(name);
          badges.push({
            name,
            type,
            earnedDate: earnedDate.toISOString()
          });
        }
      }
    });

    console.log('Total badges found:', badges.length);

    // For testing with demo data when no badges are found
    let result: CalculationResult;
    if (badges.length === 0) {
      // Return demo data for testing
      const demoBadges: Badge[] = [
        {
          name: 'Google Cloud Fundamentals: Core Infrastructure',
          type: 'skill',
          earnedDate: new Date().toISOString()
        },
        {
          name: 'Getting Started: Create and Manage Cloud Resources',
          type: 'game',
          earnedDate: new Date().toISOString()
        },
        {
          name: 'Cloud Architecture: Design, Implement, and Manage',
          type: 'trivia',
          earnedDate: new Date().toISOString()
        }
      ];
      result = calculateArcadePoints(demoBadges, isFacilitator === true);
    } else {
    // Use the calculation logic module to calculate points
      result = calculateArcadePoints(badges, isFacilitator === true);
    }

    // Format response for frontend compatibility
    const formattedResponse = {
      success: true,
      user: {
      points: result.points.total,
        badges: result.badges.map(badge => ({
          name: badge.name,
          type: badge.type,
          earnedDate: badge.earnedDate,
          points: badge.type === 'skill' ? 0.5 : badge.type === 'game' ? 1 : badge.type === 'trivia' ? 1 : 0,
          category: badge.type,
          completed: true,
        })),
      },
    };
    
    console.log('Formatted calculation result:', formattedResponse);

    res.json(formattedResponse);
  } catch (error) {
    console.error('Error calculating points:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate points' });
  }
});

// Enhanced calculation endpoint (for compatibility with frontend)
app.post('/api/calculate-points-enhanced', async (req, res) => {
  try {
    const { profileUrl, isFacilitator } = req.body;
    console.log('Received enhanced request with:', { profileUrl, isFacilitator });

    if (!profileUrl || typeof profileUrl !== 'string') {
      return res.status(400).json({ error: 'Profile URL is required' });
    }

    const response = await axios.get(profileUrl);
    const $ = cheerio.load(response.data);

    const badges: Badge[] = [];

    // Find all profile badges
    $('.profile-badge').each((_, element) => {
      const $element = $(element);
      
      // Get badge name from the title span
      const name = $element.find('.ql-title-medium.l-mts').text().trim();
      
      // Get earned date from the body span
      const dateText = $element.find('.ql-body-medium.l-mbs').text().trim();
      
      // Extract date from the text (e.g., "Earned Dec 17, 2024 EST" or "Earned Apr 3, 2025 EDT")
      const dateMatch = dateText.match(/Earned (.+?) (?:EST|EDT)/);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        // Parse the date string to a proper Date object
        const earnedDate = new Date(dateStr);
        
        if (name && !isNaN(earnedDate.getTime())) {
          const type = determineBadgeType(name);
          badges.push({
            name,
            type,
            earnedDate: earnedDate.toISOString()
          });
        }
      }
    });

    console.log('Total badges found:', badges.length);

    // Use the calculation logic module to calculate points
    const result: CalculationResult = calculateArcadePoints(badges, isFacilitator === true);

    // Format response for enhanced endpoint
    const enhancedResponse = {
      success: true,
      user: {
      points: result.points.total,
        badges: result.badges.map(badge => ({
          name: badge.name,
          type: badge.type,
          earnedDate: badge.earnedDate,
          points: badge.type === 'skill' ? 0.5 : badge.type === 'game' ? 1 : badge.type === 'trivia' ? 1 : 0,
          category: badge.type,
          completed: true,
        })),
      },
      breakdown: {
        skill: { 
          count: result.badges.filter(b => b.type === 'skill').length, 
          points: result.points.skillBadges, 
          pointsPerBadge: 0.5 
        },
        level: { 
          count: result.badges.filter(b => b.type === 'game').length, 
          points: result.points.gameBadges, 
          pointsPerBadge: 1 
        },
        trivia: { 
          count: result.badges.filter(b => b.type === 'trivia').length, 
          points: result.points.triviaBadges, 
          pointsPerBadge: 1 
        },
        completion: { 
          count: result.badges.filter(b => b.type === 'completion').length, 
          points: 0, 
          pointsPerBadge: 0 
        },
      },
      summary: {
        skillBadges: result.badges.filter(b => b.type === 'skill').length,
        levelBadges: result.badges.filter(b => b.type === 'game').length,
        triviaBadges: result.badges.filter(b => b.type === 'trivia').length,
        completionBadges: result.badges.filter(b => b.type === 'completion').length,
        totalPoints: result.points.total,
      },
    };

    console.log('Enhanced calculation result:', enhancedResponse);

    res.json(enhancedResponse);
  } catch (error) {
    console.error('Error calculating points:', error);
    res.status(500).json({ error: 'Failed to calculate points' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 