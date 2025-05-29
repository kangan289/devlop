const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : '/.netlify/functions';

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
    const response = await fetch(`${API_BASE_URL}/get-user/${encodeURIComponent(profileUrl)}`);
    return response.json();
  },

  async getLeaderboard() {
    const response = await fetch(`${API_BASE_URL}/leaderboard`);
    return response.json();
  },

  async getAvailableBadges() {
    const response = await fetch(`${API_BASE_URL}/available-badges`);
    return response.json();
  },
};
