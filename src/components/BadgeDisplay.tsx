import React, { useState } from 'react';
import { Badge } from '@/lib/calculationLogic';

interface UserBadge {
  badge: Badge;
  earnedDate: string;
}

interface BadgeDisplayProps {
  badges: UserBadge[];
  onBadgeClick?: (badge: UserBadge) => void;
}

export default function BadgeDisplay({ badges, onBadgeClick }: BadgeDisplayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Calculate points for each badge based on type
  const calculateBadgePoints = (badge: Badge) => {
    switch (badge.type) {
      case 'game':
        return 1;
      case 'trivia':
        return 1;
      case 'skill':
        return 0.5;
      default:
        return 0;
    }
  };

  // Sort badges by points (highest first)
  const sortedBadges = [...badges].sort((a, b) => {
    const aPoints = calculateBadgePoints(a.badge);
    const bPoints = calculateBadgePoints(b.badge);
    return bPoints - aPoints;
  });

  // Filter badges based on search and category
  const filteredBadges = sortedBadges.filter(badge => {
    const matchesCategory = filterCategory === 'All' || 
      badge.badge.type === filterCategory.toLowerCase();
    
    const matchesSearch = badge.badge.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Game', 'Trivia', 'Skill', 'Completion', 'Lab-free'];

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search badges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterCategory === category
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBadges.map((userBadge, index) => (
          <div
            key={`${userBadge.badge.name}-${index}`}
            onClick={() => onBadgeClick?.(userBadge)}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-all duration-200 cursor-pointer group"
          >
            {/* Badge Icon */}
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>

            {/* Badge Info */}
            <div className="text-center">
              <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                {userBadge.badge.name}
              </h3>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-purple-400 font-medium text-sm">
                  {calculateBadgePoints(userBadge.badge)} pts
                </span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-gray-400 text-xs capitalize">
                  {userBadge.badge.type}
                </span>
              </div>

              <div className="text-xs text-gray-400">
                Earned: {new Date(userBadge.earnedDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredBadges.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No badges found matching your criteria.</p>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Showing {filteredBadges.length} of {badges.length} badges
          </span>
          <span className="text-purple-400">
            Total Points: {filteredBadges.reduce((sum, badge) => sum + calculateBadgePoints(badge.badge), 0)}
          </span>
        </div>
      </div>
    </div>
  );
} 