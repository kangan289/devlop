const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  async calculatePoints(profileUrl) {
    const response = await fetch(`${API_BASE_URL}/calculate-points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profileUrl }),
    });
    return response.json();
  },

  async calculatePointsEnhanced(profileUrl) {
    const response = await fetch(`${API_BASE_URL}/calculate-points-enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profileUrl }),
    });
    return response.json();
  },

  async getUser(profileUrl) {
    // Demo user data
    return Promise.resolve({
      id: 'demo-user',
      profileUrl,
      name: 'Demo User',
      email: 'demo@example.com',
    });
  },

  async getLeaderboard() {
    // Demo leaderboard data
    return Promise.resolve([
      { userId: 'demo-user', points: 87, rank: 1 },
      { userId: 'user2', points: 75, rank: 2 },
      { userId: 'user3', points: 60, rank: 3 },
    ]);
  },

  async getAvailableBadges() {
    // Demo available badges
    return Promise.resolve([
      { name: 'Skill Badge 1', type: 'skill', points: 0.5, category: 'Skill', completed: true },
      { name: 'Level Badge 1', type: 'level', points: 1, category: 'Level', completed: true },
      { name: 'Trivia Badge 1', type: 'trivia', points: 1, category: 'Trivia', completed: true },
    ]);
  },
};
