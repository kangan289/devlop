import type React from 'react';
import { useEffect, useState } from 'react';
import { badgeService, Badge, type UserBadge, type UserPoints } from '../services/badgeService';

interface BadgeDisplayProps {
  userId: string;
}

type SortOption = 'recent' | 'points' | 'name';
type FilterCategory = 'all' | 'achievement' | 'skill' | 'special';

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ userId }) => {
  const [pointsData, setPointsData] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        setLoading(true);
        const data = await badgeService.getUserPointsSummary(userId);
        setPointsData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load badges and points');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsData();
  }, [userId]);

  const sortBadges = (badges: UserBadge[]) => {
    return [...badges].sort((a, b) => {
      if (!a.badge || !b.badge) return 0;
      
      switch (sortBy) {
        case 'points':
          return b.badge.points - a.badge.points;
        case 'name':
          return a.badge.name.localeCompare(b.badge.name);
        case 'recent':
        default:
          return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
      }
    });
  };

  const filterBadges = (badges: UserBadge[]) => {
    return badges.filter(badge => {
      if (!badge.badge) return false;
      
      const matchesCategory = filterCategory === 'all' || 
        badge.badge.category === filterCategory;
      
      const matchesSearch = searchQuery === '' ||
        badge.badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.badge.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!pointsData) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No badges earned yet</p>
      </div>
    );
  }

  const filteredAndSortedBadges = filterBadges(sortBadges(pointsData.badges));

  return (
    <div className="p-4">
      {/* Points Summary */}
      <div className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Your Points</h2>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-4xl font-bold">{pointsData.totalPoints}</span>
            <span className="ml-2 text-blue-100">total points</span>
          </div>
          <div className="text-right">
            <p className="text-blue-100">Badges Earned</p>
            <p className="text-2xl font-bold">{pointsData.badges.length}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="points">Most Points</option>
            <option value="name">Alphabetical</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="achievement">Achievements</option>
            <option value="skill">Skills</option>
            <option value="special">Special</option>
          </select>

          <input
            type="text"
            placeholder="Search badges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-grow"
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Badges</h2>
        {filteredAndSortedBadges.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No badges match your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedBadges.map((userBadge) => (
              <div
                key={userBadge.badgeId}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-100"
              >
                {userBadge.badge && (
                  <>
                    <div className="relative">
                      <img
                        src={userBadge.badge.imageUrl}
                        alt={userBadge.badge.name}
                        className="w-20 h-20 mx-auto mb-3 object-contain"
                      />
                      <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {userBadge.badge.points} pts
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-2">
                      {userBadge.badge.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {userBadge.badge.description}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        {new Date(userBadge.earnedAt).toLocaleDateString()}
                      </span>
                      <span className="text-blue-600 font-medium">
                        {userBadge.badge.category}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 