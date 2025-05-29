import axios from 'axios';
import { classifyAllBadges, calculateTotalPoints } from './badgeClassifier.js';

export async function calculatePoints(profileUrl, AvailableBadge = null) { // Add AvailableBadge parameter
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
    const badges = [];
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

    // If we found badges, convert to array and process
    const badgeNamesArray = Array.from(foundBadgeNames);

    // Batch lookup badges from database if available
    const badgePointsMap = {};

    if (AvailableBadge && badgeNamesArray.length > 0) {
      try {
        console.log('Looking up badges in database...');
        const availableBadges = await AvailableBadge.find({ name: { $in: badgeNamesArray } });
        console.log(`Found ${availableBadges.length} badges in database matching ${badgeNamesArray.length} profile badges`);

        // Create a map of badge name to points
        availableBadges.forEach(badge => {
          badgePointsMap[badge.name] = badge.defaultPoints;
          console.log(`DB Points: "${badge.name}" = ${badge.defaultPoints}`);
        });

        // Find missing badges that need to be created (or have default points assigned if creation fails)
        const missingBadges = badgeNamesArray.filter(name => !badgePointsMap.hasOwnProperty(name));

        if (missingBadges.length > 0) {
          console.log(`${missingBadges.length} badges not found in DB: ${missingBadges.join(", ")}. Will attempt to create with default points.`);

          const newBadgeEntries = missingBadges.map(name => ({
            name: name,
            description: `Auto-discovered badge from profile: ${profileUrl}`,
            defaultPoints: 1, // UPDATED: Default points for new badges is now 1
            sourceUrl: profileUrl // Store the profile URL as the source
          }));

          try {
            // Use bulkWrite for upsert behavior (insert if not exists, don't update if exists)
            const operations = newBadgeEntries.map(entry => ({
              updateOne: {
                filter: { name: entry.name },
                update: { $setOnInsert: entry }, // Only insert if name doesn't exist
                upsert: true
              }
            }));
            const bulkResult = await AvailableBadge.bulkWrite(operations, { ordered: false });
            console.log(`Bulk write result: ${bulkResult.upsertedCount} upserted, ${bulkResult.matchedCount} matched.`);

            // Add to our map with default points after successful upsert or if already existed
            missingBadges.forEach(name => {
              if (!badgePointsMap.hasOwnProperty(name)) { // Check again in case it was matched by another process
                 badgePointsMap[name] = 1; // UPDATED: Assign default of 1 if it was truly new or failed to map earlier
                 console.log(`Assigned default points (1) to new/unmapped badge: "${name}"`);
              }
            });
          } catch (createError) {
            console.error(`Error creating new badge entries:`, createError);
            // Fallback: assign default points if creation failed for any reason
            missingBadges.forEach(name => {
              if (!badgePointsMap.hasOwnProperty(name)) {
                badgePointsMap[name] = 1; // UPDATED: Assign fallback default of 1
                console.log(`Assigned fallback default points (1) to "${name}" after DB error.`);
              }
            });
          }
        }
      } catch (dbError) {
        console.error(`Database lookup/creation operation failed:`, dbError);
        // Fallback: use default points for all badges if DB operations fail
        badgeNamesArray.forEach(name => {
          if (!badgePointsMap.hasOwnProperty(name)) {
            badgePointsMap[name] = 1; // Fallback default points
             console.log(`Assigned critical fallback default points (1) to "${name}" due to major DB error.`);
          }
        });
      }
    } else if (badgeNamesArray.length > 0) {
      console.log('No Database model (AvailableBadge) provided or no badges found on profile. Using default points (1) for all found badges.');
      badgeNamesArray.forEach(name => {
        badgePointsMap[name] = 1; // UPDATED: Default points is now 1
      });
    }

    // Create final badge objects
    badgeNamesArray.forEach(badgeName => {
      const points = badgePointsMap[badgeName] !== undefined ? badgePointsMap[badgeName] : 1; // UPDATED: Ensure default is 1
      badges.push({
        name: badgeName,
        completed: true,
        points: points,
        earnedDate: null // Could be enhanced to extract dates
      });
      console.log(`Badge: "${badgeName}" = ${points} points`);
    });

    // Calculate total points based on badge points from database
    const calculatedBadgePoints = badges.reduce((total, badge) => total + badge.points, 0);

    // Use calculated badge points
    const totalPoints = calculatedBadgePoints;

    console.log('Final calculation result:', {
      calculatedBadgePoints: calculatedBadgePoints,
      profileTotalPoints: profileTotalPoints,
      totalPointsUsed: totalPoints,
      badgeCount: badges.length
    });

    return {
      badges,
      totalPoints: totalPoints,
      badgeCount: badges.length,
      profileTotalPoints: profileTotalPoints // Keep for reference
    };
  } catch (error) {
    console.error('Error calculating points:', error);
    throw new Error('Failed to calculate points: ' + error.message);
  }
}
