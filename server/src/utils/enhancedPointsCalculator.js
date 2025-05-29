import axios from 'axios';
import { calculateTotalPoints } from './badgeClassifier.js';

export async function calculatePointsEnhanced(profileUrl, AvailableBadge = null) {
  try {
    console.log('Fetching profile URL:', profileUrl);

    // Fetch the profile page with timeout and user agent
    const response = await axios.get(profileUrl, {
      timeout: 15000, // 15 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = response.data;

    console.log('Received HTML length:', html.length);

    // Extract total points from the profile (keep this as reference)
    const totalPointsMatch = html.match(/<strong>(\d+)\s*points<\/strong>/i);
    const profileTotalPoints = totalPointsMatch ? parseInt(totalPointsMatch[1]) : 0;

    console.log('Profile total points found:', profileTotalPoints);

    // Extract badges using improved approach
    const foundBadgeNames = new Set(); // Use Set to avoid duplicates

    console.log('Starting badge extraction...');

    // More robust approach: First extract all profile-badge divs, then get badge names from within them
    const profileBadgeRegex = /<div class=['"]profile-badge['"][^>]*>([\s\S]*?)<\/div>/g;
    const badgeNameRegex = /<span class=['"]ql-title-medium l-mts['"][^>]*>\s*([^<]+)\s*<\/span>/;

    let badgeCount = 0;
    let profileBadgeMatch;

    // First, find all profile-badge divs
    while ((profileBadgeMatch = profileBadgeRegex.exec(html)) !== null && badgeCount < 200) {
      const badgeDiv = profileBadgeMatch[1];

      // Within each badge div, extract the badge name
      const nameMatch = badgeDiv.match(badgeNameRegex);

      if (nameMatch) {
        badgeCount++;
        const badgeName = nameMatch[1].trim();

        // More robust filtering
        if (badgeName &&
            badgeName.length > 2 &&
            !badgeName.toLowerCase().includes('points') &&
            !badgeName.toLowerCase().includes('earned') &&
            !badgeName.toLowerCase().includes('view') &&
            !badgeName.toLowerCase().includes('profile') &&
            !foundBadgeNames.has(badgeName)) {

          foundBadgeNames.add(badgeName);
          console.log(`Found badge ${foundBadgeNames.size}: "${badgeName}"`);
        }
      }
    }

    console.log(`Extraction complete. Found ${foundBadgeNames.size} unique badges to process`);

    // Convert to array and create badge objects
    const badgeNamesArray = Array.from(foundBadgeNames);
    const rawBadges = badgeNamesArray.map(badgeName => ({
      name: badgeName,
      completed: true,
      earnedDate: null // Could be enhanced to extract dates
    }));

    // Debug: Check if we have access to the AvailableBadge collection
    if (AvailableBadge) {
      try {
        const badgeCount = await AvailableBadge.countDocuments();
        console.log(`Database collection contains ${badgeCount} skill badges for classification`);

        // Sample a few badges to verify structure
        const sampleBadges = await AvailableBadge.find().limit(3);
        console.log('Sample badges from database:', sampleBadges.map(b => b.name));
      } catch (dbError) {
        console.error('Error accessing badge database:', dbError);
      }
    } else {
      console.log('No AvailableBadge collection provided - using fallback classification');
    }

    // Use the new classification system with database collection
    const classificationResult = await calculateTotalPoints(rawBadges, AvailableBadge);
    const badges = classificationResult.badges;
    const summary = classificationResult.summary;

    // Log classified badges
    badges.forEach(badge => {
      console.log(`Badge: "${badge.name}" = ${badge.points} points (${badge.type} - ${badge.category})`);
    });

    console.log('Badge Classification Summary:', {
      skillBadges: summary.skillBadges,
      levelBadges: summary.levelBadges,
      triviaBadges: summary.triviaBadges,
      completionBadges: summary.completionBadges,
      skillPoints: summary.skillPoints,
      levelPoints: summary.levelPoints,
      triviaPoints: summary.triviaPoints,
      totalCalculatedPoints: summary.totalPoints,
      profileTotalPoints: profileTotalPoints,
      totalBadgeCount: badges.length
    });

    return {
      badges,
      summary,
      totalPoints: summary.totalPoints,
      badgeCount: badges.length,
      profileTotalPoints: profileTotalPoints, // Keep for reference
      breakdown: {
        skill: {
          count: summary.skillBadges,
          points: summary.skillPoints,
          pointsPerBadge: 0.5
        },
        level: {
          count: summary.levelBadges,
          points: summary.levelPoints,
          pointsPerBadge: 1
        },
        trivia: {
          count: summary.triviaBadges,
          points: summary.triviaPoints,
          pointsPerBadge: 1
        },
        completion: {
          count: summary.completionBadges,
          points: summary.completionPoints,
          pointsPerBadge: 0
        }
      }
    };
  } catch (error) {
    console.error('Error calculating points:', error);
    throw new Error('Failed to calculate points: ' + error.message);
  }
}
