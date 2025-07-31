import React, { createContext, useContext, useState, useEffect } from 'react';
import { CalculationResult, calculateArcadePoints } from './calculationLogic';

interface User {
  name: string;
  avatar: string;
  memberSince: string;
  league: string;
  arcadePoints: number;
  leaderboardRank: number;
  totalBadges: number;
}

interface SwagTier {
  name: string;
  pointsRequired: number;
  currentPoints: number;
  rewards: string[];
  isUnlocked: boolean;
}

interface BadgeCategory {
  name: string;
  icon: React.ComponentType<any>;
  badges: number;
  points: number;
  color: string;
}

interface IncompleteBadge {
  id: string;
  title: string;
  category: string;
  difficulty: 'Introductory' | 'Intermediate' | 'Advanced';
  labsRequired: number;
  points: number;
  image: string;
  level?: string;
}

interface WeeklyData {
  day: string;
  points: number;
}

interface DashboardContextType {
  user: User;
  swagTiers: SwagTier[];
  badgeCategories: BadgeCategory[];
  incompleteBadges: IncompleteBadge[];
  weeklyProgress: WeeklyData[];
  lastCalculations: CalculationResult[];
  totalPointsThisSeason: number;
  isLoading: boolean;
  refreshData: () => void;
  onStartChallenge: (badgeId: string) => void;
  onCategoryClick: (category: string) => void;
  onViewFullReport: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: React.ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  const [user] = useState<User>({
    name: 'Aniket Yadav',
    avatar: 'A',
    memberSince: '2025',
    league: 'Gold League',
    arcadePoints: 9,
    leaderboardRank: 7050,
    totalBadges: 8
  });

  // Mock swag tiers data
  const [swagTiers] = useState<SwagTier[]>([
    {
      name: 'Arcade Novice',
      pointsRequired: 20,
      currentPoints: 9,
      rewards: ['Black T-Shirt', 'Water Bottle'],
      isUnlocked: false
    },
    {
      name: 'Arcade Trooper',
      pointsRequired: 40,
      currentPoints: 9,
      rewards: ['Black Backpack', 'Black Baseball Cap'],
      isUnlocked: false
    },
    {
      name: 'Arcade Ranger',
      pointsRequired: 65,
      currentPoints: 9,
      rewards: ['Black Hoodie', 'Pen', 'Notebook'],
      isUnlocked: false
    },
    {
      name: 'Arcade Champion',
      pointsRequired: 75,
      currentPoints: 9,
      rewards: ['Trophy', 'Black T-Shirt', 'Black Backpack'],
      isUnlocked: false
    },
    {
      name: 'Arcade Legend',
      pointsRequired: 90,
      currentPoints: 9,
      rewards: ['Drone', 'Black T-Shirt', 'Trophy'],
      isUnlocked: false
    }
  ]);

  // Mock badge categories data
  const [badgeCategories] = useState<BadgeCategory[]>([
    {
      name: 'Skill Badges',
      icon: () => null,
      badges: 0,
      points: 0,
      color: 'bg-blue-500'
    },
    {
      name: 'Base Camp Badges',
      icon: () => null,
      badges: 1,
      points: 1,
      color: 'bg-green-500'
    },
    {
      name: 'Level Badges',
      icon: () => null,
      badges: 0,
      points: 0,
      color: 'bg-purple-500'
    },
    {
      name: 'Certification Badges',
      icon: () => null,
      badges: 0,
      points: 0,
      color: 'bg-yellow-500'
    },
    {
      name: 'Special Badges',
      icon: () => null,
      badges: 2,
      points: 3,
      color: 'bg-pink-500'
    },
    {
      name: 'Trivia Badges',
      icon: () => null,
      badges: 4,
      points: 4,
      color: 'bg-indigo-500'
    },
    {
      name: 'Work Meets Play',
      icon: () => null,
      badges: 1,
      points: 0,
      color: 'bg-orange-500'
    },
    {
      name: 'Unknown Badges',
      icon: () => null,
      badges: 0,
      points: 0,
      color: 'bg-gray-500'
    }
  ]);

  // Mock incomplete badges data
  const [incompleteBadges] = useState<IncompleteBadge[]>([
    {
      id: '1',
      title: 'Level 1: Core Infrastructure and Security',
      category: 'Game',
      difficulty: 'Introductory',
      labsRequired: 1,
      points: 1,
      image: '',
      level: 'Level 1'
    },
    {
      id: '2',
      title: 'Level 2: Modern Application Deployment',
      category: 'Game',
      difficulty: 'Introductory',
      labsRequired: 1,
      points: 1,
      image: '',
      level: 'Level 2'
    },
    {
      id: '3',
      title: 'Work Meets Play: Banking With Empathy',
      category: 'Game',
      difficulty: 'Introductory',
      labsRequired: 0,
      points: 0,
      image: '',
      level: 'Work Meets Play'
    },
    {
      id: '4',
      title: 'Tag and Discover BigLake Data',
      category: 'Skill',
      difficulty: 'Introductory',
      labsRequired: 4,
      points: 1,
      image: ''
    },
    {
      id: '5',
      title: 'Get Started with Dataplex',
      category: 'Skill',
      difficulty: 'Introductory',
      labsRequired: 4,
      points: 1,
      image: ''
    },
    {
      id: '6',
      title: 'Cloud Architecture: Design, Implement, and Manage',
      category: 'Skill',
      difficulty: 'Intermediate',
      labsRequired: 6,
      points: 1,
      image: ''
    },
    {
      id: '7',
      title: 'App Engine: 3 Ways',
      category: 'Skill',
      difficulty: 'Introductory',
      labsRequired: 4,
      points: 1,
      image: ''
    },
    {
      id: '8',
      title: 'Build LookML Objects in Looker',
      category: 'Skill',
      difficulty: 'Introductory',
      labsRequired: 5,
      points: 1,
      image: ''
    },
    {
      id: '9',
      title: 'Deploy and Manage Apigee X',
      category: 'Skill',
      difficulty: 'Introductory',
      labsRequired: 5,
      points: 1,
      image: ''
    },
    {
      id: '10',
      title: 'Implement DevOps Workflows in Google Cloud',
      category: 'Skill',
      difficulty: 'Intermediate',
      labsRequired: 4,
      points: 1,
      image: ''
    },
    {
      id: '11',
      title: 'Use Machine Learning APIs on Google Cloud',
      category: 'Skill',
      difficulty: 'Intermediate',
      labsRequired: 7,
      points: 1,
      image: ''
    },
    {
      id: '12',
      title: 'Create and Manage Bigtable Instances',
      category: 'Skill',
      difficulty: 'Introductory',
      labsRequired: 5,
      points: 1,
      image: ''
    }
  ]);

  // Mock weekly progress data
  const [weeklyProgress] = useState<WeeklyData[]>([
    { day: 'Monday', points: 1 },
    { day: 'Tuesday', points: 2 },
    { day: 'Wednesday', points: 4 },
    { day: 'Thursday', points: 1 },
    { day: 'Friday', points: 0 },
    { day: 'Saturday', points: 1 },
    { day: 'Sunday', points: 0 }
  ]);

  // Mock calculation results
  const [lastCalculations] = useState<CalculationResult[]>([
    {
      badges: [],
      points: { total: 9, gameBadges: 3, triviaBadges: 4, skillBadges: 2, milestonePoints: 0 }
    }
  ]);

  const totalPointsThisSeason = 9;

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const onStartChallenge = (badgeId: string) => {
    console.log('Starting challenge for badge:', badgeId);
    // Navigate to challenge or open modal
  };

  const onCategoryClick = (category: string) => {
    console.log('Category clicked:', category);
    // Filter badges by category
  };

  const onViewFullReport = () => {
    console.log('Viewing full ArcadeCalc report');
    // Navigate to full report page
  };

  useEffect(() => {
    // Simulate initial data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const value: DashboardContextType = {
    user,
    swagTiers,
    badgeCategories,
    incompleteBadges,
    weeklyProgress,
    lastCalculations,
    totalPointsThisSeason,
    isLoading,
    refreshData,
    onStartChallenge,
    onCategoryClick,
    onViewFullReport
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}; 