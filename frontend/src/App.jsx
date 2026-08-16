import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import HabitsPage from './pages/HabitsPage';
import CharacterPage from './pages/CharacterPage';
import AchievementsPage from './pages/AchievementsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SkillTreePage from './pages/SkillTreePage';
import QuestsPage from './pages/QuestsPage';
import SettingsPage from './pages/SettingsPage';

// Layout
import AppLayout from './components/layout/AppLayout';
import LoadingScreen from './components/ui/LoadingScreen';


// ============================================================
// PROTECTED ROUTE
// ============================================================

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// ============================================================
// PUBLIC ROUTE
// ============================================================

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};


// ============================================================
// APP
// ============================================================

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>

        {/* ==================================================
            PUBLIC ROUTES
            ================================================== */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />


        {/* ==================================================
            PROTECTED APP
            ================================================== */}

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/quests"
            element={<QuestsPage />}
          />

          <Route
            path="/habits"
            element={<HabitsPage />}
          />

          <Route
            path="/character"
            element={<CharacterPage />}
          />

          <Route
            path="/skill-tree"
            element={<SkillTreePage />}
          />

          <Route
            path="/achievements"
            element={<AchievementsPage />}
          />

          <Route
            path="/analytics"
            element={<AnalyticsPage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />

        </Route>


        {/* ==================================================
            CATCH ALL
            ================================================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </AnimatePresence>
  );
}

export default App;