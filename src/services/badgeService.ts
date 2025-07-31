import { api } from './api';

export interface Badge {
  name: string;
  type: 'game' | 'trivia' | 'skill' | 'completion' | 'lab-free';
  earnedDate?: string;
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

export interface CalculationResponse {
  points: number;
  badges: Badge[];
  breakdown: {
    gameBadges: number;
    triviaBadges: number;
    skillBadges: number;
    milestonePoints: number;
  };
  milestoneProgress?: {
    currentMilestone: number;
    progress: number;
  };
}

class BadgeService {
  // Calculate points for a profile URL
  async calculatePoints(profileUrl: string, isFacilitator: boolean = false): Promise<CalculationResponse> {
    // Demo calculation response
    return Promise.resolve({
      points: 87,
      badges: [
        { name: 'Skill Badge 1', type: 'skill', earnedDate: '2024-01-01' },
        { name: 'Level Badge 1', type: 'game', earnedDate: '2024-01-02' },
        { name: 'Trivia Badge 1', type: 'trivia', earnedDate: '2024-01-03' },
      ],
      breakdown: {
        gameBadges: 1,
        triviaBadges: 1,
        skillBadges: 1,
        milestonePoints: 5,
      },
      milestoneProgress: {
        currentMilestone: 2,
        progress: 60,
      },
    });
  }

  // Calculate points for a user (compatibility method)
  async calculateUserPoints(userId: string): Promise<number> {
    // Demo points
    return Promise.resolve(87);
  }

  // Get all badges for a profile URL
  async getProfileBadges(profileUrl: string, isFacilitator: boolean = false): Promise<Badge[]> {
    // Demo badges
    return Promise.resolve([
      { name: 'Skill Badge 1', type: 'skill', earnedDate: '2024-01-01' },
      { name: 'Level Badge 1', type: 'game', earnedDate: '2024-01-02' },
      { name: 'Trivia Badge 1', type: 'trivia', earnedDate: '2024-01-03' },
    ]);
  }

  // Get all badges for a user (compatibility method)
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    // Demo user badges
    return Promise.resolve([
      { badgeId: '1', earnedAt: new Date('2024-01-01'), badge: { name: 'Skill Badge 1', type: 'skill', earnedDate: '2024-01-01' } },
      { badgeId: '2', earnedAt: new Date('2024-01-02'), badge: { name: 'Level Badge 1', type: 'game', earnedDate: '2024-01-02' } },
      { badgeId: '3', earnedAt: new Date('2024-01-03'), badge: { name: 'Trivia Badge 1', type: 'trivia', earnedDate: '2024-01-03' } },
    ]);
  }

  // Get all available badges (returns demo badges)
  async getAllBadges(): Promise<Badge[]> {
    return Promise.resolve([
      { name: 'Skill Badge 1', type: 'skill', earnedDate: '2024-01-01' },
      { name: 'Level Badge 1', type: 'game', earnedDate: '2024-01-02' },
      { name: 'Trivia Badge 1', type: 'trivia', earnedDate: '2024-01-03' },
    ]);
  }

  // Award a badge to a user (not supported in this implementation)
  async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
    throw new Error('Badge awarding not supported in this implementation');
  }

  // Get user's complete points summary including badges
  async getUserPointsSummary(userId: string): Promise<UserPoints> {
    // Demo user points summary
    return Promise.resolve({
      totalPoints: 87,
      badges: [
        { badgeId: '1', earnedAt: new Date('2024-01-01'), badge: { name: 'Skill Badge 1', type: 'skill', earnedDate: '2024-01-01' } },
        { badgeId: '2', earnedAt: new Date('2024-01-02'), badge: { name: 'Level Badge 1', type: 'game', earnedDate: '2024-01-02' } },
        { badgeId: '3', earnedAt: new Date('2024-01-03'), badge: { name: 'Trivia Badge 1', type: 'trivia', earnedDate: '2024-01-03' } },
      ],
    });
  }

  // Get profile points summary (new method)
  async getProfilePointsSummary(profileUrl: string, isFacilitator: boolean = false): Promise<CalculationResponse> {
    // Demo calculation response
    return this.calculatePoints(profileUrl, isFacilitator);
  }
}

export const badgeService = new BadgeService(); 