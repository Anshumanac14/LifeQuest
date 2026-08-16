import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import XPBar from '../components/dashboard/XPBar';
import BossCard from '../components/dashboard/BossCard';
import StatCard from '../components/dashboard/StatCard';
import HabitCard from '../components/habits/HabitCard';
import CreateHabitModal from '../components/habits/CreateHabitModal';
import LevelUpModal from '../components/ui/LevelUpModal';
import LoadingScreen from '../components/ui/LoadingScreen';
import {
  Plus,
  RefreshCw,
  X,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STREAK_MILESTONES = [
  { days: 3, title: '3-Day Spark' },
  { days: 7, title: '7-Day Strong' },
  { days: 14, title: 'Fortnight Warrior' },
  { days: 30, title: 'Unstoppable Legend' },
  { days: 100, title: 'Century Master' },
];

const Dashboard = () => {
  const { user, updateUser } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editHabit, setEditHabit] = useState(null);

  const [deleteHabit, setDeleteHabit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [levelUpData, setLevelUpData] = useState({
    show: false,
    oldLevel: 1,
    newLevel: 1,
    title: '',
  });

  const [xpFloats, setXpFloats] = useState([]);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get('/dashboard');

      if (res.data.success) {
        setData(res.data.dashboard);

        if (res.data.dashboard.user) {
          updateUser(res.data.dashboard.user);
        }
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const triggerXpFloat = (xp) => {
    const id = Date.now();

    setXpFloats((prev) => [
      ...prev,
      {
        id,
        xp,
        x:
          window.innerWidth / 2 +
          (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2,
      },
    ]);

    setTimeout(() => {
      setXpFloats((prev) =>
        prev.filter((item) => item.id !== id)
      );
    }, 1500);
  };

  const handleCompleteHabit = async (
    habit,
    isMinimum = false
  ) => {
    try {
      const res = await api.post(
        `/habits/${habit._id}/complete`,
        { isMinimum }
      );

      if (res.data.success) {
        sound.playComplete(
          user?.settings?.soundEnabled
        );

        triggerXpFloat(res.data.xpEarned);

        if (res.data.statIncreased) {
          toast.success(
            `+${res.data.xpEarned} XP! +${res.data.statIncreased.amount.toFixed(
              1
            )} ${res.data.statIncreased.stat.toUpperCase()}`,
            {
              icon: '⚡',
            }
          );
        } else {
          toast.success(res.data.message);
        }

        if (res.data.leveledUp) {
          setLevelUpData({
            show: true,
            oldLevel: res.data.oldLevel,
            newLevel: res.data.newLevel,
            title: res.data.user.title,
          });
        }

        if (res.data.newAchievements?.length > 0) {
          toast.success(
            '🏆 New Achievement Unlocked!',
            {
              duration: 4000,
            }
          );
        }

        fetchDashboard();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Error completing habit'
      );
    }
  };

  const handleCreateOrUpdateHabit = async (
    formData
  ) => {
    try {
      if (editHabit) {
        await api.put(
          `/habits/${editHabit._id}`,
          formData
        );

        toast.success('Habit updated!');
      } else {
        await api.post('/habits', formData);

        toast.success('New quest forged!');
      }

      setEditHabit(null);
      fetchDashboard();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Error saving habit'
      );
    }
  };

  const handleDeleteHabit = (habit) => {
    setDeleteHabit(habit);
  };

  const confirmDeleteHabit = async () => {
    if (!deleteHabit) return;

    try {
      setIsDeleting(true);

      await api.delete(
        `/habits/${deleteHabit._id}`
      );

      toast.success('Habit deleted');

      setDeleteHabit(null);

      fetchDashboard();
    } catch (err) {
      toast.error('Failed to delete habit');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteHabit = () => {
    if (isDeleting) return;

    setDeleteHabit(null);
  };

  const handleTogglePause = async (habit) => {
    try {
      await api.put(
        `/habits/${habit._id}`,
        {
          paused: !habit.paused,
        }
      );

      toast.success(
        habit.paused
          ? 'Habit resumed'
          : 'Habit paused'
      );

      fetchDashboard();
    } catch (err) {
      toast.error(
        'Failed to update habit status'
      );
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const userData = data?.user || user;
  const habits = data?.habits || [];
  const weeklyBoss = data?.weeklyBoss;
  const achievements =
    data?.recentAchievements || [];

  const currentStreak =
    userData?.currentStreak || 0;

  const nextMilestone =
    STREAK_MILESTONES.find(
      (m) => m.days > currentStreak
    ) || {
      days: currentStreak + 10,
      title: 'Grand Legend',
    };

  const daysLeftMilestone = Math.max(
    0,
    nextMilestone.days - currentStreak
  );

  const milestoneProgress =
    nextMilestone.days > 0
      ? Math.min(
          100,
          Math.round(
            (currentStreak /
              nextMilestone.days) *
              100
          )
        )
      : 0;

  const getMomentumState = () => {
    if (currentStreak === 0) {
      return {
        badge: 'Start Today',
        message: (
          <>
            🌱 <strong>Today is a fresh start.</strong>{' '}
            Complete one quest and begin your journey.
          </>
        ),
      };
    }

    if (currentStreak < 3) {
      return {
        badge: 'Building',
        message: (
          <>
            ⚡ <strong>Momentum is forming.</strong>{' '}
            Keep going — your next milestone is close.
          </>
        ),
      };
    }

    if (currentStreak < 7) {
      return {
        badge: 'Momentum',
        message: (
          <>
            🔥 <strong>You're building a real streak.</strong>{' '}
            Keep your momentum going today.
          </>
        ),
      };
    }

    if (currentStreak < 14) {
      return {
        badge: 'On Fire',
        message: (
          <>
            🛡️ <strong>You're becoming consistent.</strong>{' '}
            Protect your momentum.
          </>
        ),
      };
    }

    return {
      badge: 'Elite',
      message: (
        <>
          👑 <strong>Elite consistency.</strong>{' '}
          You're proving this is becoming part of who you are.
        </>
      ),
    };
  };

  const momentum = getMomentumState();

  return (
    <div className="dashboard-container">
      {/* =====================================================
          DELETE MODAL
          ===================================================== */}

      <AnimatePresence>
        {deleteHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="delete-modal-overlay"
            onClick={cancelDeleteHabit}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
              }}
              className="delete-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <button
                type="button"
                onClick={cancelDeleteHabit}
                disabled={isDeleting}
                className="delete-modal-close"
              >
                <X size={18} />
              </button>

              <div className="delete-warning-icon">
                <AlertTriangle size={28} />
              </div>

              <h2>Delete Habit?</h2>

              <p className="delete-message">
                Are you sure you want to delete{' '}
                <strong>
                  "{deleteHabit.name}"
                </strong>
                ?
              </p>

              <p className="delete-warning-text">
                This action cannot be undone.
                Your habit history and progress
                associated with this habit may also
                be removed.
              </p>

              <div className="delete-modal-buttons">
                <button
                  type="button"
                  onClick={cancelDeleteHabit}
                  disabled={isDeleting}
                  className="delete-cancel-btn"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteHabit}
                  disabled={isDeleting}
                  className="delete-confirm-btn"
                >
                  <Trash2 size={15} />
                  {isDeleting
                    ? 'Deleting...'
                    : 'Delete Habit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          XP FLOAT
          ===================================================== */}

      {xpFloats.map((item) => (
        <div
          key={item.id}
          className="xp-float"
          style={{
            left: item.x,
            top: item.y,
          }}
        >
          +{item.xp} XP
        </div>
      ))}

      {/* =====================================================
          LEVEL UP
          ===================================================== */}

      <LevelUpModal
        isOpen={levelUpData.show}
        onClose={() =>
          setLevelUpData((prev) => ({
            ...prev,
            show: false,
          }))
        }
        oldLevel={levelUpData.oldLevel}
        newLevel={levelUpData.newLevel}
        title={levelUpData.title}
        soundEnabled={
          user?.settings?.soundEnabled
        }
      />

      {/* =====================================================
          CREATE / EDIT HABIT
          ===================================================== */}

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditHabit(null);
        }}
        onSubmit={handleCreateOrUpdateHabit}
        editHabit={editHabit}
      />

      {/* =====================================================
          HEADER
          ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="dashboard-header"
      >
        <div>
          <div className="dashboard-label">
            COMMAND CENTER
          </div>

          <h1>
            Welcome,{' '}
            <span className="gradient-text">
              {userData?.name || 'Hero'}
            </span>
          </h1>
        </div>

        <div className="dashboard-header-actions">
          <button
            className="btn btn-secondary"
            onClick={fetchDashboard}
            title="Refresh dashboard"
          >
            <RefreshCw size={16} />
            <span className="mobile-button-text">
              Refresh
            </span>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              setEditHabit(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} />
            Forge Quest
          </button>
        </div>
      </motion.div>

      {/* =====================================================
          RECOVERY MODE
          ===================================================== */}

      {userData?.recoveryMode && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="recovery-banner"
        >
          <div className="recovery-icon">
            🌅
          </div>

          <div className="recovery-content">
            <div className="recovery-title">
              RECOVERY MODE ACTIVE
            </div>

            <div className="recovery-text">
              You haven't failed. One break day
              does not erase your dedication!
              Complete any quest today to restore
              your momentum and earn a{' '}
              <strong>
                +50 XP Comeback Bonus
              </strong>
              .
            </div>
          </div>
        </motion.div>
      )}

      {/* =====================================================
          XP + STREAK
          ===================================================== */}

      <div className="dashboard-xp-grid">
        <XPBar
          currentXp={userData?.xp || 0}
          nextLevelXp={
            userData?.nextLevelXp || 100
          }
          level={userData?.level || 1}
          title={
            userData?.title || 'Novice'
          }
        />

        <motion.div
          initial={{
            opacity: 0,
            x: 15,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
          className="streak-card"
        >
          <motion.div
            animate={{
              opacity: [0.1, 0.22, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="streak-glow"
          />

          <div className="streak-header">
            <div className="streak-title-wrapper">
              <motion.div
                animate={{
                  scale: [1, 1.12, 1],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="streak-icon"
              >
                🔥
              </motion.div>

              <div>
                <div className="streak-title">
                  {currentStreak} Day Streak
                </div>

                <div className="streak-best">
                  Best: {userData?.bestStreak || 0} days
                </div>
              </div>
            </div>

            <span className="badge badge-amber">
              {momentum.badge}
            </span>
          </div>

          <div className="momentum-message">
            {momentum.message}
          </div>

          <div>
            <div className="milestone-info">
              <span>
                Next milestone:{' '}
                <strong>
                  {nextMilestone.title}
                </strong>
              </span>

              <span className="milestone-days">
                {daysLeftMilestone}d left
              </span>
            </div>

            <div className="milestone-track">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${milestoneProgress}%`,
                }}
                transition={{
                  duration: 1,
                  ease: 'easeOut',
                }}
                className="milestone-progress"
              />
            </div>
          </div>

          <div className="consistency-row">
            <span>
              📊 Consistency
            </span>

            <strong>
              {userData?.consistency || 0}%
            </strong>
          </div>
        </motion.div>
      </div>

      {/* =====================================================
          MAIN GRID
          ===================================================== */}

      <div className="dashboard-main-grid">
        {/* LEFT */}
        <div className="dashboard-left">
          {/* Today's Quests */}
          <div className="quests-header">
            <h2>
              <span>⚔️</span>
              Today's Quests (
              {
                habits.filter(
                  (h) => h.completedToday
                ).length
              }
              /{habits.length})
            </h2>

            <span>
              {habits.length === 0
                ? 'No quests forged'
                : 'Complete to earn XP & Stat gains'}
            </span>
          </div>

          {/* Habit Cards */}
          {habits.length === 0 ? (
            <div className="empty-quest-card">
              <div className="empty-quest-icon">
                ⚡
              </div>

              <h3>
                Your Quest Log is Empty
              </h3>

              <p>
                Forge your first habit quest
                to start gaining XP, leveling
                up stats, and slaying weekly
                bosses!
              </p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  setIsModalOpen(true)
                }
              >
                <Plus size={16} />
                Forge First Quest
              </button>
            </div>
          ) : (
            <div className="habit-list">
              {habits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  onComplete={() =>
                    handleCompleteHabit(
                      habit,
                      false
                    )
                  }
                  onMinComplete={() =>
                    handleCompleteHabit(
                      habit,
                      true
                    )
                  }
                  onEdit={(h) => {
                    setEditHabit(h);
                    setIsModalOpen(true);
                  }}
                  onDelete={
                    handleDeleteHabit
                  }
                  onTogglePause={
                    handleTogglePause
                  }
                />
              ))}
            </div>
          )}

          {/* Weekly Boss */}
          {weeklyBoss && (
            <div className="weekly-boss">
              <BossCard
                boss={weeklyBoss}
              />
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="dashboard-right">
          {/* Character Stats */}
          <div className="glass-card">
            <h3 className="card-heading">
              <span>🧠</span>
              Character Stats
            </h3>

            <div className="character-stats-grid">
              {Object.entries(
                userData?.stats || {}
              ).map(
                (
                  [statName, val],
                  idx
                ) => (
                  <StatCard
                    key={statName}
                    statName={statName}
                    value={val}
                    index={idx}
                  />
                )
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="glass-card">
            <div className="achievements-heading">
              <h3 className="card-heading">
                <span>🏆</span>
                Recent Achievements
              </h3>
            </div>

            {achievements.length === 0 ? (
              <div className="no-achievements">
                No achievements unlocked yet.
                Complete quests to earn your
                first trophy!
              </div>
            ) : (
              <div className="achievement-list">
                {achievements.map(
                  (ach) => (
                    <motion.div
                      key={ach.id}
                      initial={{
                        opacity: 0,
                        x: 10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      whileHover={{
                        x: 3,
                      }}
                      className="achievement-item"
                    >
                      <span className="achievement-icon">
                        {ach.icon}
                      </span>

                      <div className="achievement-content">
                        <div className="achievement-name">
                          {ach.name}
                        </div>

                        <div className="achievement-description">
                          {ach.description}
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;