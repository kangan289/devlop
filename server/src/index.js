import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { calculatePoints } from './utils/pointsCalculator.js';
import { calculatePointsEnhanced } from './utils/enhancedPointsCalculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arcadeverse';
console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  profileUrl: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  badges: [{
    name: String,
    completed: Boolean,
    points: Number,
    type: { type: String, enum: ['skill', 'level', 'trivia', 'completion'], default: 'skill' },
    category: String,
    earnedDate: Date
  }],
  summary: {
    skillBadges: { type: Number, default: 0 },
    levelBadges: { type: Number, default: 0 },
    triviaBadges: { type: Number, default: 0 },
    completionBadges: { type: Number, default: 0 },
    skillPoints: { type: Number, default: 0 },
    levelPoints: { type: Number, default: 0 },
    triviaPoints: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 }
  },
  lastUpdated: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// AvailableBadge Schema - for catalog badges
const availableBadgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Name of the badge from the catalog
  description: { type: String }, // Optional description
  imageUrl: { type: String }, // Optional image URL for the badge
  sourceUrl: { type: String }, // URL of the catalog page or badge detail page
  defaultPoints: { type: Number, required: true, default: 0.5 } // Default points for this badge type
});

const AvailableBadge = mongoose.model('AvailableBadge', availableBadgeSchema);

// Routes
app.post('/api/admin/seed-available-badges', async (req, res) => {
  try {
    const { badges } = req.body; // Expect an array of badge objects: [{ name: "Badge Name 1" }, { name: "Badge Name 2" }]
    if (!badges || !Array.isArray(badges) || badges.length === 0) {
      return res.status(400).json({ success: false, message: 'Badge data is required and should be an array.' });
    }

    const results = [];
    for (const badgeData of badges) {
      if (!badgeData.name) {
        results.push({ name: badgeData.name || 'Unnamed Badge', status: 'skipped', reason: 'Missing name' });
        continue;
      }
      try {
        const newBadge = await AvailableBadge.findOneAndUpdate(
          { name: badgeData.name },
          {
            name: badgeData.name,
            description: badgeData.description || '',
            imageUrl: badgeData.imageUrl || '',
            sourceUrl: badgeData.sourceUrl || 'https://www.cloudskillsboost.google/catalog?skill-badge%5B%5D=skill-badge', // Default source
            defaultPoints: badgeData.defaultPoints || 0.5 // Ensure this uses the provided points
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        results.push({ name: newBadge.name, status: 'success', id: newBadge._id });
      } catch (error) {
        results.push({ name: badgeData.name, status: 'error', reason: error.message });
      }
    }
    res.status(201).json({ success: true, message: 'Available badges seeded.', results });
  } catch (error) {
    console.error('Error seeding available badges:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to get all available badges
app.get('/api/available-badges', async (req, res) => {
  try {
    const availableBadges = await AvailableBadge.find().sort({ name: 1 });
    res.json({ success: true, availableBadges });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug endpoint to check skill badges in collection
app.get('/api/debug/skill-badges', async (req, res) => {
  try {
    const count = await AvailableBadge.countDocuments();
    const sample = await AvailableBadge.find().limit(10).sort({ name: 1 });
    res.json({
      success: true,
      totalCount: count,
      sampleBadges: sample,
      message: `Found ${count} badges in the collection`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enhanced endpoint with badge classification
app.post('/api/calculate-points-enhanced', async (req, res) => {
  try {
    console.log('Received request to calculate points (enhanced)');
    const { profileUrl } = req.body;

    if (!profileUrl) {
      console.log('No profile URL provided');
      return res.status(400).json({ success: false, message: 'Profile URL is required' });
    }

    console.log('Calculating points for:', profileUrl);

    // Use enhanced calculator with classification
    const result = await calculatePointsEnhanced(profileUrl, AvailableBadge);
    const { badges, summary, totalPoints, breakdown } = result;

    console.log('Enhanced points calculated:', {
      totalPoints,
      breakdown,
      badgeCount: badges.length
    });

    // Check if user exists
    let user = await User.findOne({ profileUrl });
    console.log('Existing user found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('Creating new user');
      user = new User({ profileUrl });
    }

    // Update user data with enhanced information
    user.points = totalPoints;
    user.badges = badges;
    user.summary = summary;
    user.lastUpdated = new Date();

    console.log('Saving enhanced user data');
    await user.save();

    console.log('Successfully saved enhanced user data');
    res.json({
      success: true,
      user,
      breakdown,
      summary
    });
  } catch (error) {
    console.error('Error in enhanced calculate-points endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Legacy endpoint (keeping for backward compatibility)
app.post('/api/calculate-points', async (req, res) => {
  try {
    console.log('Received request to calculate points (legacy)');
    const { profileUrl } = req.body;

    if (!profileUrl) {
      console.log('No profile URL provided');
      return res.status(400).json({ success: false, message: 'Profile URL is required' });
    }

    console.log('Calculating points for:', profileUrl);
    // Calculate points
    const { badges, totalPoints } = await calculatePoints(profileUrl, AvailableBadge); // Pass AvailableBadge model
    console.log('Points calculated:', { badges, totalPoints });

    // Check if user exists
    let user = await User.findOne({ profileUrl });
    console.log('Existing user found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('Creating new user');
      // Create new user
      user = new User({ profileUrl });
    }

    // Update user data
    user.points = totalPoints;
    user.badges = badges;
    user.lastUpdated = new Date();
    console.log('Saving user data:', user);
    await user.save();

    console.log('Successfully saved user data');
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error in calculate-points endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/user/:profileUrl', async (req, res) => {
  try {
    const user = await User.findOne({ profileUrl: req.params.profileUrl });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a route to get all users (for leaderboard)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ points: -1 })
      .limit(100)
      .select('profileUrl points lastUpdated');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
