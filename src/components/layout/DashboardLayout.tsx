import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import {
  IconLayoutDashboard,
  IconTrophy,
  IconBadge,
  IconAward,
  IconSettings,
  IconHelp,
  IconBell,
  IconMenu2,
  IconChevronRight,
  IconUser
} from '@tabler/icons-react';

interface BreadcrumbSegment { name: string; href: string; current?: boolean; }

const dashboardNavItems = [
  { name: 'Overview', icon: <IconLayoutDashboard size={20} />, href: '/dashboard', description: 'Your personal dashboard summary' },
  { name: 'Leaderboard', icon: <IconTrophy size={20} />, href: '/dashboard/leaderboard', description: 'Global and personal rankings' },
  { name: 'Badges', icon: <IconBadge size={20} />, href: '/dashboard/badges', description: 'Your earned and pending badges', badge: '4 new' },
  { name: 'Achievements', icon: <IconAward size={20} />, href: '/dashboard/achievements', description: 'Your progress milestones' },
  { name: 'Resources', icon: <IconHelp size={20} />, href: '/resources', description: 'Learning materials and guides' },
  { name: 'Settings', icon: <IconSettings size={20} />, href: '/dashboard/settings', description: 'Manage your account details' }
];

interface DashboardLayoutProps { children: React.ReactNode; }

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[]>([]);

  const currentPage = dashboardNavItems.find(item =>
    location.pathname === item.href ||
    (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
  );

  useEffect(() => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems: BreadcrumbSegment[] = [{ name: 'Home', href: '/' }];
    if (paths.length > 0) {
      let currentPath = '';
      paths.forEach((path, index) => {
        currentPath += `/${path}`;
        const navItem = dashboardNavItems.find(item => item.href === currentPath);
        const name = navItem ? navItem.name : path.charAt(0).toUpperCase() + path.slice(1);
        breadcrumbItems.push({ name, href: currentPath, current: index === paths.length - 1 });
      });
    }
    setBreadcrumbs(breadcrumbItems);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <div className="flex-1 flex bg-background text-foreground">
        <aside className="hidden md:flex w-64 flex-col bg-background border-r h-[calc(100vh-4rem)] sticky top-16">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              {user ? (
                <>
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-muted-foreground">Level {user.level} {user.title}</div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Avatar><AvatarFallback><IconUser size={18} /></AvatarFallback></Avatar>
                  <div><div className="font-semibold">Loading...</div></div>
                </div>
              )}
            </div>
            <nav className="space-y-1">
              <AnimatePresence>
                {dashboardNavItems.map((item) => (
                  <motion.div key={item.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                    <Button
                      variant={location.pathname === item.href ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full justify-start h-10 px-3",
                        location.pathname === item.href ? "bg-secondary text-secondary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                      )}
                      asChild
                    >
                      <Link to={item.href} className="flex items-center">
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.name}</span>
                        {item.badge && <Badge className="ml-auto bg-primary text-primary-foreground text-xs">{item.badge}</Badge>}
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </nav>
          </div>
          <div className="mt-auto p-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2"><IconBell size={18} className="text-primary" /><span className="font-medium text-sm">Latest Updates</span></div>
              <p className="text-xs text-muted-foreground">New challenges are available in the Google Cloud Arcade. Check them out!</p>
              <Button variant="link" size="sm" className="px-0 h-6 text-xs text-primary mt-1">View updates <IconChevronRight size={12} className="ml-1" /></Button>
            </div>
          </div>
        </aside>
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden fixed bottom-6 right-6 z-40 rounded-full shadow-lg h-14 w-14"><IconMenu2 /><span className="sr-only">Open sidebar</span></Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-background text-foreground">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                {user ? (
                  <>
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-muted-foreground">Level {user.level} {user.title}</div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback><IconUser size={18} /></AvatarFallback></Avatar>
                    <div><div className="font-semibold">Loading...</div></div>
                  </div>
                )}
              </div>
              <nav className="space-y-1">
                {dashboardNavItems.map((item) => (
                  <Button
                    key={item.name}
                    variant={location.pathname === item.href ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start h-10 px-3",
                      location.pathname === item.href ? "bg-secondary text-secondary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                    )}
                    asChild
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Link to={item.href} className="flex items-center">
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.name}</span>
                      {item.badge && <Badge className="ml-auto bg-primary text-primary-foreground text-xs">{item.badge}</Badge>}
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>
            <div className="mt-auto p-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2"><IconBell size={18} className="text-primary" /><span className="font-medium text-sm">Latest Updates</span></div>
                <p className="text-xs text-muted-foreground">New challenges are available in the Google Cloud Arcade. Check them out!</p>
                <Button variant="link" size="sm" className="px-0 h-6 text-xs text-primary mt-1">View updates <IconChevronRight size={12} className="ml-1" /></Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <main className="flex-1 min-h-[calc(100vh-4rem)] bg-background text-foreground">
          {currentPage && (
            <div className="bg-background border-b mb-6">
              <div className="container py-4">
                <Breadcrumb segments={breadcrumbs} className="mb-3" />
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold">{currentPage.name}</h1>
                  <p className="text-muted-foreground">{currentPage.description}</p>
                </div>
              </div>
            </div>
          )}
          <div className="container pb-10 bg-background text-foreground">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {children}
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
