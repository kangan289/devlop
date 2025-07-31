import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Flag, BookOpen, Diamond, HelpCircle, Briefcase } from 'lucide-react';

interface BadgeCategory {
  name: string;
  icon: React.ComponentType<any>;
  badges: number;
  points: number;
  color: string;
}

interface BadgeCategoriesProps {
  categories: BadgeCategory[];
  onCategoryClick: (category: string) => void;
}

export const BadgeCategories: React.FC<BadgeCategoriesProps> = ({ categories, onCategoryClick }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Skill', 'Game', 'Trivia', 'Level', 'Special'];

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'Skill Badges': BookOpen,
      'Game Badges': Star,
      'Trivia Badges': HelpCircle,
      'Level Badges': Flag,
      'Certification Badges': Diamond,
      'Special Badges': Diamond,
      'Work Meets Play': Briefcase,
      'Unknown Badges': Award
    };
    return iconMap[categoryName] || Award;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Badge Categories</h3>
        </div>
        <div className="text-sm text-gray-400">
          Track your progress across different badge types
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <motion.button
            key={filter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedFilter === filter
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {filter}
          </motion.button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories
          .filter(category => selectedFilter === 'All' || category.name.includes(selectedFilter))
          .map((category, index) => {
            const IconComponent = getCategoryIcon(category.name);
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => onCategoryClick(category.name)}
                className="p-4 rounded-lg border border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{category.name}</h4>
                      <p className="text-xs text-gray-400">{category.badges} badges</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-400">{category.points}</div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((category.points / 10) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Progress</span>
                  <span>{Math.round((category.points / 10) * 100)}%</span>
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {categories.reduce((sum, cat) => sum + cat.badges, 0)} badges this season
          </span>
          <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            View all categories →
          </button>
        </div>
      </div>
    </motion.div>
  );
}; 