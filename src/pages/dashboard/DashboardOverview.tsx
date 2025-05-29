import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProfileCompletionCard } from '@/components/profile/ProfileCompletionCard';
import { BadgesDisplay } from '@/components/profile/BadgesDisplay';
import { useAuth } from '@/lib/auth-context';
import { useNotification } from '@/lib/notification-provider';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconCheck,
  IconClock,
  IconStarFilled,
  IconChartBar,
  IconCalendarStats,
  IconActivity,
  IconBulb,
  IconZoomQuestion,
  IconTarget,
  IconUserCircle,
  IconTrophy
} from '@tabler/icons-react';

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function DashboardOverview() {
  const { user } = useAuth();
  const { success } = useNotification();
  const [activeTab, setActiveTab] = useState('this-month');
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Mock data for the dashboard
  const userStats = {
    currentPoints: user?.points || 230,
    totalPoints: 820,
    completedBadges: user ? user.badges.filter(b => b.unlocked).length : 18,
    pendingBadges: user ? user.badges.filter(b => !b.unlocked).length : 7,
    rank: 540,
    totalUsers: 12480,
    percentile: 96,
    lastLogin: '2 hours ago',
    joinDate: 'Jan 15, 2023',
    pointsChange: 45,
    rankChange: 28,
  };

  // Mock activity
  const recentActivity = [
    {
      id: 1,
      type: 'badge_earned',
      title: 'Earned "Cloud Security" badge',
      date: '2 days ago',
      icon: <IconCheck size={16} className="text-google-green" />,
      points: 25
    },
    {
      id: 2,
      type: 'challenge_completed',
      title: 'Completed "Deploy a VM" challenge',
      date: '4 days ago',
      icon: <IconCheck size={16} className="text-google-green" />,
      points: 15
    },
    {
      id: 3,
      type: 'challenge_in_progress',
      title: 'Started "Kubernetes Basics" challenge',
      date: '1 week ago',
      icon: <IconClock size={16} className="text-google-yellow" />,
      points: null
    },
    {
      id: 4,
      type: 'badge_earned',
      title: 'Earned "Database Fundamentals" badge',
      date: '2 weeks ago',
      icon: <IconCheck size={16} className="text-google-green" />,
      points: 30
    }
  ];

  // Mock recommendations
  const recommendations = [
    {
      id: 1,
      title: 'Migrate to Kubernetes',
      description: 'Based on your completed challenges, we recommend exploring Kubernetes next.',
      icon: <IconBulb size={20} className="text-google-yellow" />,
      difficulty: 'Intermediate',
      estimatedPoints: 45,
      link: '/dashboard/challenges/kubernetes'
    },
    {
      id: 2,
      title: 'Cloud Security Specialization',
      description: 'Complete 2 more security challenges to earn the Security Expert badge.',
      icon: <IconTarget size={20} className="text-google-blue" />,
      difficulty: 'Advanced',
      estimatedPoints: 75,
      link: '/dashboard/challenges/security'
    },
    {
      id: 3,
      title: 'Database Migration Quiz',
      description: 'Test your knowledge on database migrations with this quick quiz.',
      icon: <IconZoomQuestion size={20} className="text-google-green" />,
      difficulty: 'Beginner',
      estimatedPoints: 20,
      link: '/dashboard/quizzes/database'
    }
  ];

  const handleProfileStepClick = (stepId: string) => {
    success("Profile step selected", {
      description: `You clicked on the "${stepId}" profile step.`
    });
  };

  return (
    <div ref={ref} className="space-y-8">
      {/* Welcome section with key stats */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="overflow-hidden google-card">
          <CardHeader className="bg-primary/5 pb-2">
            <CardTitle className="text-2xl">
              Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'John'}</span>
            </CardTitle>
            <CardDescription>
              Here's your Google Cloud Arcade progress summary
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Current Points</span>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-3xl font-bold">{userStats.currentPoints}</span>
                  <div className="flex items-center text-xs font-medium text-green-500">
                    <IconTrendingUp size={14} className="mr-0.5" />
                    {userStats.pointsChange}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Your Rank</span>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-3xl font-bold">#{userStats.rank}</span>
                  <div className="flex items-center text-xs font-medium text-green-500">
                    <IconTrendingUp size={14} className="mr-0.5" />
                    {userStats.rankChange}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Top Percentile</span>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-3xl font-bold">{userStats.percentile}%</span>
                  <span className="text-xs text-muted-foreground">of users</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Completed Badges</span>
                  <span className="text-2xl font-bold mt-1">{userStats.completedBadges}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Badges in Progress</span>
                  <span className="text-2xl font-bold mt-1">{userStats.pendingBadges}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 flex justify-between">
            <div className="text-xs text-muted-foreground">Last login: {userStats.lastLogin}</div>
            <div className="text-xs text-muted-foreground">Member since: {userStats.joinDate}</div>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden google-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <IconActivity size={20} className="text-primary" />
              Points Progress
            </CardTitle>

            <div className="flex items-center gap-2 mt-2">
              <Button
                variant={activeTab === 'this-week' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setActiveTab('this-week')}
              >
                This Week
              </Button>
              <Button
                variant={activeTab === 'this-month' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setActiveTab('this-month')}
              >
                This Month
              </Button>
              <Button
                variant={activeTab === 'all-time' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setActiveTab('all-time')}
              >
                All Time
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Progress bar visualization */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">Points Earned</span>
                  <span>
                    {userStats.currentPoints} / {userStats.totalPoints}
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(userStats.currentPoints / userStats.totalPoints) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-google-green"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Next level in</span>
                <span className="font-medium">70 more points</span>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="text-center p-2 bg-primary/5 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Day Streak</div>
                  <div className="text-xl font-bold">7</div>
                </div>
                <div className="text-center p-2 bg-primary/5 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Weekly Goal</div>
                  <div className="text-xl font-bold">65%</div>
                </div>
                <div className="text-center p-2 bg-primary/5 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Achievements</div>
                  <div className="text-xl font-bold">12</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30">
            <Button size="sm" variant="outline" className="w-full">
              <IconChartBar size={16} className="mr-2" />
              View Detailed Analytics
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Profile completion and badges */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <IconUserCircle className="mr-2 h-5 w-5 text-primary" />
            Profile Completion
          </h2>
          <ProfileCompletionCard onStepClick={handleProfileStepClick} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <IconTrophy className="mr-2 h-5 w-5 text-google-yellow" />
            Your Badges
          </h2>
          <BadgesDisplay />
        </div>
      </motion.div>

      {/* Recent activity and recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="google-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendarStats size={20} className="text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-start p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/50 mr-3">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <h3 className="font-medium text-sm">{activity.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{activity.date}</span>
                          {activity.points && (
                            <Badge variant="outline" className="text-xs bg-primary/5 hover:bg-primary/10">
                              +{activity.points} pts
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30">
              <Button size="sm" variant="outline" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="google-card h-full">
            <CardHeader className="bg-primary/5">
              <CardTitle>Recommended For You</CardTitle>
              <CardDescription>
                Based on your progress and interests
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="group"
                  >
                    <div className="bg-card p-4 rounded-lg border group-hover:border-primary/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted/50">
                          {recommendation.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                            {recommendation.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            {recommendation.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className="bg-muted/30 text-xs hover:bg-muted/50"
                            >
                              {recommendation.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              ~{recommendation.estimatedPoints} pts
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30">
              <Button variant="outline" size="sm" className="w-full">
                View All Recommendations
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="google-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Upcoming Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">Google Cloud Infrastructure</div>
              <div className="text-xs text-muted-foreground mt-1">Starts in 2 days</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="secondary" size="sm" className="w-full">
                Set Reminder
              </Button>
            </CardFooter>
          </Card>

          <Card className="google-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Next Badge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">Cloud Security Specialist</div>
              <div className="text-xs text-muted-foreground mt-1">1 challenge remaining</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="secondary" size="sm" className="w-full">
                Continue
              </Button>
            </CardFooter>
          </Card>

          <Card className="google-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Study Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">Join Weekly Cloud Study</div>
              <div className="text-xs text-muted-foreground mt-1">Every Wednesday, 7PM</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="secondary" size="sm" className="w-full">
                Register
              </Button>
            </CardFooter>
          </Card>

          <Card className="google-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Your Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconStarFilled
                    key={`star-${star}`}
                    size={14}
                    className={star <= 4 ? "text-google-yellow" : "text-muted/30"}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Share your experience</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="secondary" size="sm" className="w-full">
                Rate ArcadeVerse
              </Button>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
