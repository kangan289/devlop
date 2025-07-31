import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';

// Mock data for top performers
const topPerformers = [
  {
    id: 1,
    name: "Rahul Dev",
    points: 98,
    avatarUrl: "https://ext.same-assets.com/1544848213/2375982323.png",
    initials: "RD"
  },
  {
    id: 2,
    name: "Avi Singh",
    points: 94,
    avatarUrl: "https://ext.same-assets.com/1544848213/4109502439.png",
    initials: "AS"
  },
  {
    id: 3,
    name: "Irwan Prabowo",
    points: 89,
    avatarUrl: "https://ext.same-assets.com/1544848213/2914835856.jpeg",
    initials: "IP"
  }
];

export function TopPerformersSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Our Top <span className="text-gradient">Performers</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the champions who are leading the way in Google Cloud Arcade
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {topPerformers.map((performer, index) => (
            <motion.div
              key={performer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(hsl(var(--chart-${index + 1})), transparent ${performer.points}%)`,
                    transform: 'rotate(-90deg)',
                  }}
                />
                <div className="relative z-10 p-1">
                  <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-700 shadow-md">
                    <AvatarImage src={performer.avatarUrl} alt={performer.name} />
                    <AvatarFallback>{performer.initials}</AvatarFallback>
                  </Avatar>
                </div>
                <div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-md flex items-center justify-center"
                  style={{
                    color: `hsl(var(--chart-${index + 1}))`,
                    border: `2px solid hsl(var(--chart-${index + 1}))`,
                  }}
                >
                  #{index + 1}
                </div>
              </div>

              <h3 className="text-xl font-bold">{performer.name}</h3>
              <div className="flex items-center mt-1 mb-4">
                <span
                  className="text-sm font-medium"
                  style={{ color: `hsl(var(--chart-${index + 1}))` }}
                >
                  ★ {performer.points} points
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-sm font-medium"
              >
                View Profile
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 bg-blue-50 dark:bg-gray-800 p-8 rounded-2xl text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4">Want to Join the Champions?</h3>
          <p className="text-muted-foreground mb-6">
            Your journey to the top starts with a single challenge. Keep pushing forward, earn badges,
            and watch your rank rise to legendary status!
          </p>
          <Button className="google-button bg-primary hover:bg-primary/90 text-white">
            View Leaderboard & Track Achievements
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
