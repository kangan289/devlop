import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { IconSearch, IconTrophy, IconFilter, IconUsers, IconUserCircle, IconStar } from '@tabler/icons-react';
import { useCalculation } from '@/lib/calculation-context';

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

// Mock leaderboard data
const leaderboardData = [
  {
    id: 1,
    name: "Michelle Chen",
    avatarUrl: "https://ui-avatars.com/api/?name=MC&background=0D8ABC&color=fff",
    initials: "MC",
    points: 950,
    badges: 24,
    achievements: ["Google Cloud Certified", "ML Expert"],
    rank: 1,
    country: "United States",
  },
  {
    id: 2,
    name: "Jamal Washington",
    avatarUrl: "https://ui-avatars.com/api/?name=JW&background=E67C13&color=fff",
    initials: "JW",
    points: 878,
    badges: 22,
    achievements: ["DevOps Specialist", "Security Expert"],
    rank: 2,
    country: "Canada",
  },
  {
    id: 3,
    name: "Sarah Kim",
    avatarUrl: "https://ui-avatars.com/api/?name=SK&background=7C13E6&color=fff",
    initials: "SK",
    points: 845,
    badges: 21,
    achievements: ["Database Master", "Data Engineer"],
    rank: 3,
    country: "South Korea",
  },
  {
    id: 4,
    name: "Carlos Rodriguez",
    avatarUrl: "https://ui-avatars.com/api/?name=CR&background=13E67C&color=fff",
    initials: "CR",
    points: 812,
    badges: 20,
    achievements: ["Kubernetes Expert", "Cloud Architect"],
    rank: 4,
    country: "Mexico",
  },
  {
    id: 5,
    name: "Aisha Patel",
    avatarUrl: "https://ui-avatars.com/api/?name=AP&background=E61340&color=fff",
    initials: "AP",
    points: 798,
    badges: 18,
    achievements: ["Full Stack Developer", "API Specialist"],
    rank: 5,
    country: "India",
  },
  {
    id: 6,
    name: "John Doe",
    avatarUrl: "https://ui-avatars.com/api/?name=JD&background=4285F4&color=fff",
    initials: "JD",
    points: 756,
    badges: 19,
    achievements: ["Networking Specialist", "Cloud Administrator"],
    rank: 6,
    country: "United Kingdom",
    isCurrentUser: true,
  },
  {
    id: 7,
    name: "Emma Wilson",
    avatarUrl: "https://ui-avatars.com/api/?name=EW&background=34A853&color=fff",
    initials: "EW",
    points: 732,
    badges: 16,
    achievements: ["Frontend Expert", "UX Specialist"],
    rank: 7,
    country: "Australia",
  },
  {
    id: 8,
    name: "Liu Wei",
    avatarUrl: "https://ui-avatars.com/api/?name=LW&background=FBBC05&color=fff",
    initials: "LW",
    points: 711,
    badges: 15,
    achievements: ["Database Administrator", "Cloud Security"],
    rank: 8,
    country: "China",
  },
  {
    id: 9,
    name: "Gabriel Santos",
    avatarUrl: "https://ui-avatars.com/api/?name=GS&background=EA4335&color=fff",
    initials: "GS",
    points: 695,
    badges: 14,
    achievements: ["Big Data Engineer", "ML Practitioner"],
    rank: 9,
    country: "Brazil",
  },
  {
    id: 10,
    name: "Olga Petrova",
    avatarUrl: "https://ui-avatars.com/api/?name=OP&background=673AB7&color=fff",
    initials: "OP",
    points: 682,
    badges: 13,
    achievements: ["Backend Developer", "Cloud Storage Expert"],
    rank: 10,
    country: "Russia",
  },
];

export function LeaderboardPage() {
  const { calculationResult } = useCalculation();
  const [activeFilter, setActiveFilter] = useState('global');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div className="space-y-8" ref={ref}>
      {/* Top section with tabs and search */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === 'global' ? 'default' : 'outline'}
            size="sm"
            className="h-9"
            onClick={() => setActiveFilter('global')}
          >
            <IconTrophy size={16} className="mr-1.5" />
            Global
          </Button>
          <Button
            variant={activeFilter === 'friends' ? 'default' : 'outline'}
            size="sm"
            className="h-9"
            onClick={() => setActiveFilter('friends')}
          >
            <IconUsers size={16} className="mr-1.5" />
            Friends
          </Button>
          <Button
            variant={activeFilter === 'country' ? 'default' : 'outline'}
            size="sm"
            className="h-9"
            onClick={() => setActiveFilter('country')}
          >
            <IconUserCircle size={16} className="mr-1.5" />
            My Country
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search users..."
              className="pl-9 h-9 rounded-md border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <IconFilter size={16} className="mr-1.5" />
            Filter
          </Button>
        </div>
      </div>

      {/* Current user's position */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="google-card bg-primary/5 border-primary/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Your Leaderboard Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                    6
                  </div>
                  <Avatar className="h-14 w-14 border-2 border-primary/20">
                    <AvatarImage src="https://ui-avatars.com/api/?name=JD&background=4285F4&color=fff" alt="John Doe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="font-bold text-lg">John Doe</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-primary/10">
                      Level 5
                    </Badge>
                    <span className="text-sm text-muted-foreground">United Kingdom</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 md:gap-12">
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground text-sm">Points</span>
                    <span className="text-2xl font-bold text-primary">{calculationResult?.user.points || 0}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground text-sm">Badges</span>
                    <span className="text-2xl font-bold text-google-blue">{calculationResult?.user.badges.length || 0}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground text-sm">Rank</span>
                    <span className="text-2xl font-bold">{calculationResult ? '#Calculated' : '#Not Calculated'}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-primary/5 border-t border-primary/10 justify-end">
            <Button size="sm" variant="secondary">View Your Profile</Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Top 3 leaderboard section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-6"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <IconTrophy size={20} className="text-google-yellow mr-2" /> Top Performers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaderboardData.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.id}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-col"
            >
              <Card className={`google-card h-full relative overflow-hidden ${
                index === 0 ? 'border-google-yellow/50' :
                index === 1 ? 'border-google-light-blue/50' :
                'border-google-red/50'
              }`}>
                <div className={`absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rotate-45 ${
                  index === 0 ? 'bg-google-yellow/20' :
                  index === 1 ? 'bg-google-light-blue/20' :
                  'bg-google-red/20'
                }`} />

                <CardHeader className="text-center pb-2 relative z-10">
                  <div className="mx-auto">
                    <div className="relative inline-block">
                      <Avatar className={`h-20 w-20 border-4 ${
                        index === 0 ? 'border-google-yellow' :
                        index === 1 ? 'border-google-light-blue' :
                        'border-google-red'
                      }`}>
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center shadow-md ${
                        index === 0 ? 'bg-google-yellow text-white' :
                        index === 1 ? 'bg-google-light-blue text-white' :
                        'bg-google-red text-white'
                      }`}>
                        {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="mt-3 text-lg">{user.name}</CardTitle>
                  <CardDescription>{user.country}</CardDescription>
                </CardHeader>

                <CardContent className="text-center pt-0">
                  <div className="flex justify-center gap-6 mb-3">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Points</span>
                      <span className="text-lg font-bold">{user.points}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Badges</span>
                      <span className="text-lg font-bold">{user.badges}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {user.achievements.map((achievement) => (
                      <Badge
                        key={`${user.id}-${achievement}`}
                        variant="outline"
                        className={`text-xs ${
                          index === 0 ? 'bg-google-yellow/10' :
                          index === 1 ? 'bg-google-light-blue/10' :
                          'bg-google-red/10'
                        }`}
                      >
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Full leaderboard */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-6">Leaderboard Rankings</h2>

        <Card className="google-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground w-[60px]">Rank</th>
                    <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">User</th>
                    <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">Country</th>
                    <th className="h-10 px-4 text-right text-xs font-medium text-muted-foreground">Badges</th>
                    <th className="h-10 px-4 text-right text-xs font-medium text-muted-foreground">Points</th>
                    <th className="h-10 px-4 text-right text-xs font-medium text-muted-foreground w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate={inView ? "visible" : "hidden"}
                      className={`border-b hover:bg-muted/50 transition-colors ${user.isCurrentUser ? 'bg-primary/5' : ''}`}
                    >
                      <td className="p-4 align-middle font-medium">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/60">
                          {user.rank}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center">
                              {user.name}
                              {user.isCurrentUser && (
                                <Badge variant="outline" className="ml-2 text-xs bg-primary/10">You</Badge>
                              )}
                            </div>
                            <div className="flex gap-1 mt-1">
                              {Array.from({ length: Math.min(3, Math.floor(user.badges / 5)) }).map((_, i) => (
                                <IconStar key={`star-${user.id}-${i}`} size={12} className="text-google-yellow" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-sm">{user.country}</td>
                      <td className="p-4 align-middle text-right">{user.badges}</td>
                      <td className="p-4 align-middle text-right font-bold">
                        {user.points}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          View
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <div className="text-xs text-muted-foreground">
              Showing 10 of 12,480 users
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                1
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                2
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                3
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                ...
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                10
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
