import { api } from './api';

export interface Badge {
  _id: string;
  name: string;
  description: string;
  points: number;
  imageUrl: string;
  createdAt: Date;
  category: 'achievement' | 'skill' | 'special';
}

export interface UserBadge {
  badgeId: string;
  earnedAt: Date;
  badge?: Badge; // Populated when fetching user badges
}

export interface UserPoints {
  totalPoints: number;
  badges: UserBadge[];
}

class BadgeService {
  private readonly API_BASE_URL = 'http://localhost:5001/api';

  // Calculate points for a user
  async calculateUserPoints(userId: string): Promise<number> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}/points`);
      if (!response.ok) {
        throw new Error('Failed to calculate points');
      }
      const data = await response.json();
      return data.totalPoints;
    } catch (error) {
      console.error('Error calculating points:', error);
      throw error;
    }
  }

  // Get all badges for a user with their details
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}/badges`);
      if (!response.ok) {
        throw new Error('Failed to fetch user badges');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user badges:', error);
      throw error;
    }
  }

  // Get all available badges
  async getAllBadges(): Promise<Badge[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/badges`);
      if (!response.ok) {
        throw new Error('Failed to fetch badges');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching badges:', error);
      throw error;
    }
  }

  // Award a badge to a user
  async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}/badges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badgeId }),
      });
      if (!response.ok) {
        throw new Error('Failed to award badge');
      }
      return await response.json();
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw error;
    }
  }

  // Get user's complete points summary including badges
  async getUserPointsSummary(userId: string): Promise<UserPoints> {
    try {
      const [totalPoints, badges] = await Promise.all([
        this.calculateUserPoints(userId),
        this.getUserBadges(userId),
      ]);

      return {
        totalPoints,
        badges,
      };
    } catch (error) {
      console.error('Error getting user points summary:', error);
      throw error;
    }
  }
}

export const badgeService = new BadgeService(); 