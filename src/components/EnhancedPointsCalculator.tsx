import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
import { useCalculation } from '@/lib/calculation-context';
import { Trophy, Award, Star, Calendar } from 'lucide-react';

interface BadgeData {
  name: string;
  type: string;
  points: number;
  category: string;
  completed: boolean;
  earnedDate?: string;
}

interface BadgeBreakdown {
  skill: { count: number; points: number; pointsPerBadge: number };
  level: { count: number; points: number; pointsPerBadge: number };
  trivia: { count: number; points: number; pointsPerBadge: number };
  completion: { count: number; points: number; pointsPerBadge: number };
}

interface CalculationResult {
  success: boolean;
  user: {
    points: number;
    badges: BadgeData[];
  };
  breakdown: BadgeBreakdown;
  summary: {
    skillBadges: number;
    levelBadges: number;
    triviaBadges: number;
    completionBadges: number;
    totalPoints: number;
  };
}

interface EnhancedPointsCalculatorProps {
  onProfileScanned: () => void;
}

export function EnhancedPointsCalculator({ onProfileScanned }: EnhancedPointsCalculatorProps) {
  const { setCalculationResult, setProfileUrl: setGlobalProfileUrl, setIsCalculating } = useCalculation();
  const [profileUrl, setProfileUrl] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [calculatingPoints, setCalculatingPoints] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePoints = async () => {
    if (!profileUrl.trim()) return;

    setCalculatingPoints(true);
    setError(null);
    setResult(null);

    try {
      setIsCalculating(true);
      setGlobalProfileUrl(profileUrl);
      
      // Use the demo API instead of fetch
      const data = await api.calculatePointsEnhanced(profileUrl);

      if (data.success) {
        setResult(data);
        setCalculationResult(data);
        onProfileScanned();
      } else {
        setError(data.message || 'Failed to calculate points. Please check your profile URL.');
      }
    } catch (err) {
      console.error('Error calculating points:', err);
      setError('Failed to calculate points. Please try again later.');
    }

    setCalculatingPoints(false);
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'skill':
        return <Award className="w-4 h-4" />;
      case 'level':
        return <Trophy className="w-4 h-4" />;
      case 'trivia':
        return <Star className="w-4 h-4" />;
      case 'completion':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'skill':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'level':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'trivia':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'completion':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <div className="py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Enhanced <span className="text-gradient">GCP Badge Calculator</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate points with detailed badge classification: Skill Badges (0.5 pts), Level Badges (1 pt), Trivia Badges (1 pt)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="google-card overflow-hidden">
            <CardHeader className="google-gradient">
              <CardTitle className="text-xl text-gray-800 dark:text-white">
                GCP Badge Points Calculator
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-white/80">
                Enter your Google Cloud Skills Boost profile URL for detailed badge analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="profile-url" className="text-sm font-medium">
                    Google Cloud Skills Boost Profile URL:
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="profile-url"
                      placeholder="https://www.cloudskillsboost.google/public_profiles/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={calculatePoints}
                      disabled={calculatingPoints || !profileUrl.trim()}
                      className="google-button bg-blue-700 dark:bg-primary text-white hover:bg-blue-800 dark:hover:bg-primary/90"
                    >
                      {calculatingPoints ? "Analyzing..." : "Calculate"}
                    </Button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
                  >
                    <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
                  </motion.div>
                )}

                {result && !error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 space-y-6"
                  >
                    {/* Total Points Display */}
                    <div className="bg-accent/10 p-6 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-2">Total Calculated Points</div>
                      <div className="text-4xl font-bold text-primary">{result.summary.totalPoints}</div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Based on {result.user.badges.length} badges
                      </div>
                    </div>

                    {/* Badge Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Award className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-2xl font-bold text-blue-600">
                            {result.breakdown.skill.count}
                          </div>
                          <div className="text-sm text-muted-foreground">Skill Badges</div>
                          <div className="text-xs text-muted-foreground">
                            {result.breakdown.skill.points} pts (0.5 each)
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Trophy className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {result.breakdown.level.count}
                          </div>
                          <div className="text-sm text-muted-foreground">Level Badges</div>
                          <div className="text-xs text-muted-foreground">
                            {result.breakdown.level.points} pts (1 each)
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Star className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="text-2xl font-bold text-purple-600">
                            {result.breakdown.trivia.count}
                          </div>
                          <div className="text-sm text-muted-foreground">Trivia Badges</div>
                          <div className="text-xs text-muted-foreground">
                            {result.breakdown.trivia.points} pts (1 each)
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Calendar className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="text-2xl font-bold text-gray-600">
                            {result.breakdown.completion.count}
                          </div>
                          <div className="text-sm text-muted-foreground">Completion</div>
                          <div className="text-xs text-muted-foreground">
                            0 pts (events)
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Badge List */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Badge Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {result.user.badges.map((badge, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {getBadgeIcon(badge.type)}
                                <div>
                                  <div className="font-medium text-sm">{badge.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {badge.category}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getBadgeColor(badge.type)}>
                                  {badge.type}
                                </Badge>
                                <div className="text-sm font-medium">
                                  {badge.points} pts
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-4 text-xs text-muted-foreground">
              Enhanced classification: Skill (0.5 pts) • Level (1 pt) • Trivia (1 pt) • Completion (0 pts)
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
