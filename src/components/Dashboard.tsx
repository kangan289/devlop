import type React from 'react';
import { useEffect, useState } from 'react';
import { BadgeDisplay } from './BadgeDisplay';
import { badgeService, type UserPoints } from '../services/badgeService';

interface DashboardProps {
  userId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [pointsData, setPointsData] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        setLoading(true);
        const data = await badgeService.getUserPointsSummary(userId);
        setPointsData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load points data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Points Summary */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back! Here's your progress
              </p>
            </div>
            {pointsData && (
              <div className="mt-4 md:mt-0 flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Total Points</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {pointsData.totalPoints}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Badges Earned</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {pointsData.badges.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h2>
              {pointsData && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Recent Badge</p>
                    {pointsData.badges.length > 0 ? (
                      <p className="text-lg font-medium">
                        {pointsData.badges[0].badge?.name || 'No badges yet'}
                      </p>
                    ) : (
                      <p className="text-lg font-medium text-gray-400">
                        No badges yet
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Highest Value Badge</p>
                    {pointsData.badges.length > 0 ? (
                      <p className="text-lg font-medium">
                        {pointsData.badges.reduce((max, current) => 
                          (current.badge?.points || 0) > (max.badge?.points || 0) ? current : max
                        ).badge?.name || 'No badges yet'}
                      </p>
                    ) : (
                      <p className="text-lg font-medium text-gray-400">
                        No badges yet
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Badges Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <BadgeDisplay userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 