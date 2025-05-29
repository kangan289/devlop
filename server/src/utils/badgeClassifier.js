export async function classifyBadge(badgeName, skillBadgeCollection = null) {
  const name = badgeName.toLowerCase().trim();

  // Level Badges (1 point) - Progression achievements
  const levelBadgePatterns = [
    /^level \d+:/i,
    /level \d+ .*skills/i,
    /level \d+ .*adventures/i,
    /level \d+ .*automation/i,
    /level \d+ .*databases/i,
    /level \d+ .*security/i,
    /level \d+ .*genaius/i,
    /level \d+ .*quiz/i
  ];

  // Trivia Badges (1 point) - Quiz and trivia achievements
  const triviaBadgePatterns = [
    /trivia/i,
    /quiz/i,
    /.*trivia.*week/i,
    /.*trivia.*\d{4}/i,
    /the arcade trivia/i
  ];

  // Completion Badges (0 points) - Event and completion achievements
  const completionBadgePatterns = [
    /diwali in the arcade/i,
    /trick-or-skills/i,
    /base camp/i,
    /certification zone/i,
    /halloween/i,
    /holiday/i,
    /celebration/i,
    /festive/i,
    /seasonal/i,
    /special event/i
  ];

  // Check for level badges first
  if (levelBadgePatterns.some(pattern => pattern.test(badgeName))) {
    return {
      type: 'level',
      points: 1,
      category: 'Level Progression',
      source: 'pattern'
    };
  }

  // Check for trivia badges
  if (triviaBadgePatterns.some(pattern => pattern.test(badgeName))) {
    return {
      type: 'trivia',
      points: 1,
      category: 'Knowledge Assessment',
      source: 'pattern'
    };
  }

  // Check for completion badges
  if (completionBadgePatterns.some(pattern => pattern.test(badgeName))) {
    return {
      type: 'completion',
      points: 0,
      category: 'Event Completion',
      source: 'pattern'
    };
  }

  // Check if this badge exists in the skill badge collection from MongoDB
  if (skillBadgeCollection) {
    try {
      // Try exact match first
      let skillBadge = await skillBadgeCollection.findOne({
        name: { $regex: new RegExp(`^${badgeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      });

      // If no exact match, try partial match
      if (!skillBadge) {
        skillBadge = await skillBadgeCollection.findOne({
          name: { $regex: new RegExp(badgeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
        });
      }

      if (skillBadge) {
        console.log(`Found skill badge in database: "${badgeName}" -> "${skillBadge.name}"`);
        return {
          type: 'skill',
          points: 0.5,
          category: 'Technical Skills',
          source: 'database',
          dbMatch: skillBadge.name
        };
      }
    } catch (error) {
      console.error('Error checking skill badge in database:', error);
    }
  }

  // Additional heuristics for skill badges (fallback)
  if (name.includes('get started with') ||
      name.includes('deploy') ||
      name.includes('implement') ||
      name.includes('configure') ||
      name.includes('build') ||
      name.includes('create') ||
      name.includes('use') ||
      name.includes('analyze') ||
      name.includes('monitor') ||
      name.includes('manage') ||
      name.includes('secure') ||
      name.includes('store') ||
      name.includes('process')) {
    return {
      type: 'skill',
      points: 0.5,
      category: 'Technical Skills',
      source: 'heuristic'
    };
  }

  // Default to skill badge if uncertain
  console.log(`No classification found for badge: "${badgeName}", defaulting to skill badge`);
  return {
    type: 'skill',
    points: 0.5,
    category: 'Technical Skills',
    source: 'default'
  };
}

export async function classifyAllBadges(badges, skillBadgeCollection = null) {
  const classifiedBadges = [];

  for (const badge of badges) {
    const classification = await classifyBadge(badge.name, skillBadgeCollection);
    classifiedBadges.push({
      ...badge,
      type: classification.type,
      points: classification.points,
      category: classification.category,
      source: classification.source,
      dbMatch: classification.dbMatch
    });
  }

  return classifiedBadges;
}

export async function calculateTotalPoints(badges, skillBadgeCollection = null) {
  const classified = await classifyAllBadges(badges, skillBadgeCollection);

  const summary = {
    skillBadges: classified.filter(b => b.type === 'skill').length,
    levelBadges: classified.filter(b => b.type === 'level').length,
    triviaBadges: classified.filter(b => b.type === 'trivia').length,
    completionBadges: classified.filter(b => b.type === 'completion').length,
    skillPoints: classified.filter(b => b.type === 'skill').length * 0.5,
    levelPoints: classified.filter(b => b.type === 'level').length * 1,
    triviaPoints: classified.filter(b => b.type === 'trivia').length * 1,
    completionPoints: 0,
    totalPoints: 0,
    // Classification source breakdown
    databaseMatches: classified.filter(b => b.source === 'database').length,
    patternMatches: classified.filter(b => b.source === 'pattern').length,
    heuristicMatches: classified.filter(b => b.source === 'heuristic').length,
    defaultMatches: classified.filter(b => b.source === 'default').length
  };

  summary.totalPoints = summary.skillPoints + summary.levelPoints + summary.triviaPoints;

  return {
    badges: classified,
    summary
  };
}
