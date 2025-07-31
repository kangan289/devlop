import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RootLayout } from '@/components/layout/RootLayout';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardProvider } from '@/lib/dashboard-context';
import { HomePage } from '@/pages/HomePage';
import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import { LeaderboardPage } from '@/pages/dashboard/LeaderboardPage';
import { BadgesPage } from '@/pages/dashboard/BadgesPage';
import { ResourcesPage } from '@/pages/dashboard/ResourcesPage';
import { SupportPage } from '@/pages/SupportPage';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

// Animated routes wrapper
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home route */}
        <Route
          path="/"
          element={
            <MainLayout title="ArcadeCalc - Home" description="Calculate your Google Cloud Skills Boost Arcade points">
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <HomePage />
              </motion.div>
            </MainLayout>
          }
        />

        {/* Dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <DashboardProvider>
            <DashboardLayout>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <DashboardOverview />
              </motion.div>
            </DashboardLayout>
            </DashboardProvider>
          }
        />

        <Route
          path="/dashboard/leaderboard"
          element={
            <DashboardProvider>
            <DashboardLayout>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <LeaderboardPage />
              </motion.div>
            </DashboardLayout>
            </DashboardProvider>
          }
        />

        <Route
          path="/dashboard/badges"
          element={
            <DashboardProvider>
            <DashboardLayout>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <BadgesPage />
              </motion.div>
            </DashboardLayout>
            </DashboardProvider>
          }
        />

        <Route
          path="/resources"
          element={
            <DashboardProvider>
            <DashboardLayout>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ResourcesPage />
              </motion.div>
            </DashboardLayout>
            </DashboardProvider>
          }
        />

        {/* Support Page route */}
        <Route
          path="/support"
          element={
            <MainLayout title="ArcadeCalc - Support" description="Get help and support for ArcadeCalc">
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <SupportPage />
              </motion.div>
            </MainLayout>
          }
        />

        {/* Add more dashboard routes as they're created */}
        <Route
          path="/dashboard/*"
          element={
            <DashboardLayout>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <div className="flex items-center justify-center h-[60vh]">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Page Under Construction</h2>
                    <p className="text-muted-foreground">This section is coming soon!</p>
                  </div>
                </div>
              </motion.div>
            </DashboardLayout>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <RootLayout>
      <Router>
        <AnimatedRoutes />
      </Router>
    </RootLayout>
  );
}

export default App;
