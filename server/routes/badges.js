const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db');

// Get all badges
router.get('/badges', async (req, res) => {
  try {
    const db = getDb();
    const badges = await db.collection('badges').find({}).toArray();
    res.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// Get user's badges
router.get('/users/:userId/badges', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDb();
    
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { badges: 1 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const badgeIds = user.badges.map(b => b.badgeId);
    const badges = await db.collection('badges')
      .find({ _id: { $in: badgeIds } })
      .toArray();

    const userBadges = user.badges.map(userBadge => ({
      ...userBadge,
      badge: badges.find(b => b._id.toString() === userBadge.badgeId.toString())
    }));

    res.json(userBadges);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({ error: 'Failed to fetch user badges' });
  }
});

// Calculate user's total points
router.get('/users/:userId/points', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDb();

    const result = await db.collection('users').aggregate([
      { $match: { _id: new ObjectId(userId) } },
      { $unwind: '$badges' },
      {
        $lookup: {
          from: 'badges',
          localField: 'badges.badgeId',
          foreignField: '_id',
          as: 'badgeDetails'
        }
      },
      { $unwind: '$badgeDetails' },
      {
        $group: {
          _id: '$_id',
          totalPoints: { $sum: '$badgeDetails.points' }
        }
      }
    ]).toArray();

    const totalPoints = result[0]?.totalPoints || 0;
    res.json({ totalPoints });
  } catch (error) {
    console.error('Error calculating points:', error);
    res.status(500).json({ error: 'Failed to calculate points' });
  }
});

// Award a badge to a user
router.post('/users/:userId/badges', async (req, res) => {
  try {
    const { userId } = req.params;
    const { badgeId } = req.body;
    const db = getDb();

    // Check if badge exists
    const badge = await db.collection('badges').findOne({ _id: new ObjectId(badgeId) });
    if (!badge) {
      return res.status(404).json({ error: 'Badge not found' });
    }

    // Check if user already has the badge
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId),
      'badges.badgeId': new ObjectId(badgeId)
    });

    if (user) {
      return res.status(400).json({ error: 'User already has this badge' });
    }

    // Add badge to user
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      {
        $push: {
          badges: {
            badgeId: new ObjectId(badgeId),
            earnedAt: new Date()
          }
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      badgeId,
      earnedAt: new Date()
    });
  } catch (error) {
    console.error('Error awarding badge:', error);
    res.status(500).json({ error: 'Failed to award badge' });
  }
});

// Create a new badge (admin only)
router.post('/badges', async (req, res) => {
  try {
    const { name, description, points, imageUrl, category } = req.body;
    const db = getDb();

    const result = await db.collection('badges').insertOne({
      name,
      description,
      points,
      imageUrl,
      category,
      createdAt: new Date()
    });

    res.status(201).json({
      _id: result.insertedId,
      name,
      description,
      points,
      imageUrl,
      category,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error creating badge:', error);
    res.status(500).json({ error: 'Failed to create badge' });
  }
});

module.exports = router; 