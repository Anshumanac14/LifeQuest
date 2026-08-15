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

  // Custom delete modal
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

  // Open custom delete modal
  const handleDeleteHabit = (habit) => {
    setDeleteHabit(habit);
  };

  // Actually delete the habit after confirmation
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
      toast.error(
        'Failed to delete habit'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Close delete modal
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
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        paddingBottom: 40,
      }}
    >
      {/* =====================================================
          CUSTOM DELETE MODAL
          ===================================================== */}

      <AnimatePresence>
        {deleteHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              padding: 20,

              background:
                'rgba(3, 5, 15, 0.78)',

              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
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
              onClick={(e) =>
                e.stopPropagation()
              }
              style={{
                width: '100%',
                maxWidth: 460,

                background:
                  'linear-gradient(145deg, rgba(18,24,39,0.98), rgba(10,14,26,0.98))',

                border:
                  '1px solid rgba(239,68,68,0.45)',

                borderRadius: 20,

                padding: 28,

                position: 'relative',

                boxShadow:
                  '0 25px 80px rgba(0,0,0,0.55), 0 0 30px rgba(239,68,68,0.08)',
              }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={cancelDeleteHabit}
                disabled={isDeleting}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,

                  width: 36,
                  height: 36,

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  borderRadius: 10,

                  border:
                    '1px solid var(--glass-border)',

                  background:
                    'rgba(255,255,255,0.035)',

                  color:
                    'var(--text-muted)',

                  cursor: isDeleting
                    ? 'not-allowed'
                    : 'pointer',

                  opacity: isDeleting
                    ? 0.5
                    : 1,
                }}
              >
                <X size={18} />
              </button>

              {/* Warning icon */}
              <div
                style={{
                  width: 58,
                  height: 58,

                  borderRadius: 16,

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  background:
                    'rgba(239,68,68,0.08)',

                  border:
                    '1px solid rgba(239,68,68,0.35)',

                  color: '#ef4444',

                  marginBottom: 20,
                }}
              >
                <AlertTriangle size={28} />
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily:
                    'Rajdhani, sans-serif',

                  fontSize: 26,

                  fontWeight: 800,

                  marginBottom: 8,

                  color:
                    'var(--text-primary)',
                }}
              >
                Delete Habit?
              </h2>

              {/* Message */}
              <p
                style={{
                  color:
                    'var(--text-secondary)',

                  fontSize: 14,

                  lineHeight: 1.6,

                  marginBottom: 8,
                }}
              >
                Are you sure you want to
                delete{' '}
                <strong
                  style={{
                    color:
                      'var(--text-primary)',
                  }}
                >
                  "{deleteHabit.name}"
                </strong>
                ?
              </p>

              <p
                style={{
                  color:
                    'var(--text-muted)',

                  fontSize: 12,

                  lineHeight: 1.6,

                  marginBottom: 24,
                }}
              >
                This action cannot be undone.
                Your habit history and
                progress associated with
                this habit may also be
                removed.
              </p>

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'flex-end',

                  gap: 10,

                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  onClick={
                    cancelDeleteHabit
                  }
                  disabled={isDeleting}
                  style={{
                    padding:
                      '10px 18px',

                    borderRadius: 10,

                    border:
                      '1px solid var(--glass-border)',

                    background:
                      'rgba(255,255,255,0.035)',

                    color:
                      'var(--text-secondary)',

                    fontSize: 14,

                    fontWeight: 600,

                    cursor: isDeleting
                      ? 'not-allowed'
                      : 'pointer',

                    opacity: isDeleting
                      ? 0.5
                      : 1,
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    confirmDeleteHabit
                  }
                  disabled={isDeleting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      'center',

                    gap: 7,

                    padding:
                      '10px 18px',

                    borderRadius: 10,

                    border:
                      '1px solid rgba(239,68,68,0.55)',

                    background:
                      'linear-gradient(135deg, #ef4444, #dc2626)',

                    color: '#fff',

                    fontSize: 14,

                    fontWeight: 700,

                    cursor: isDeleting
                      ? 'not-allowed'
                      : 'pointer',

                    opacity: isDeleting
                      ? 0.7
                      : 1,

                    boxShadow:
                      '0 5px 18px rgba(239,68,68,0.2)',
                  }}
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
          FLOATING XP
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
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontWeight: 600,
            }}
          >
            COMMAND CENTER
          </div>

          <h1
            style={{
              fontFamily:
                'Rajdhani, sans-serif',
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            Welcome,{' '}
            <span className="gradient-text">
              {userData?.name || 'Hero'}
            </span>
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
          }}
        >
          <button
            className="btn btn-secondary"
            onClick={fetchDashboard}
            style={{
              padding: '10px 14px',
            }}
            title="Refresh dashboard"
          >
            <RefreshCw size={16} />
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              setEditHabit(null);
              setIsModalOpen(true);
            }}
            style={{
              padding: '10px 20px',
              fontSize: 14,
            }}
          >
            <Plus size={16} /> Forge Quest
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
          style={{
            background:
              'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.05))',

            border:
              '1px solid rgba(245,158,11,0.4)',

            borderRadius: 18,

            padding: '18px 22px',

            marginBottom: 24,

            display: 'flex',
            alignItems: 'center',
            gap: 16,

            boxShadow:
              '0 0 20px rgba(245,158,11,0.15)',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,

              background:
                'rgba(245,158,11,0.25)',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              fontSize: 24,
              flexShrink: 0,

              border:
                '1px solid rgba(245,158,11,0.4)',
            }}
          >
            🌅
          </div>

          <div
            style={{
              flex: 1,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: 'var(--amber)',
                fontSize: 16,
              }}
            >
              RECOVERY MODE ACTIVE
            </div>

            <div
              style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                marginTop: 2,
              }}
            >
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
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
          style={{
            background:
              'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(124,58,237,0.05))',

            border:
              '1px solid rgba(245,158,11,0.18)',

            borderRadius: 20,

            padding: '18px 20px',

            position: 'relative',

            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{
              opacity: [
                0.1,
                0.22,
                0.1,
              ],
              scale: [
                1,
                1.1,
                1,
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',

              width: 150,
              height: 150,

              borderRadius: '50%',

              background:
                'radial-gradient(circle, rgba(245,158,11,0.25), transparent 70%)',

              top: -80,
              right: -40,

              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',

              marginBottom: 14,

              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <motion.div
                animate={{
                  scale: [
                    1,
                    1.12,
                    1,
                  ],
                  rotate: [
                    -2,
                    2,
                    -2,
                  ],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  width: 44,
                  height: 44,

                  borderRadius: 13,

                  background:
                    'rgba(245,158,11,0.13)',

                  border:
                    '1px solid rgba(245,158,11,0.28)',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  fontSize: 23,

                  boxShadow:
                    '0 0 20px rgba(245,158,11,0.12)',
                }}
              >
                🔥
              </motion.div>

              <div>
                <div
                  style={{
                    fontFamily:
                      'Rajdhani, sans-serif',

                    fontSize: 22,

                    fontWeight: 800,

                    color: 'var(--amber)',
                  }}
                >
                  {currentStreak} Day Streak
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                  }}
                >
                  Best:{' '}
                  {userData?.bestStreak ||
                    0}{' '}
                  days
                </div>
              </div>
            </div>

            <span className="badge badge-amber">
              {momentum.badge}
            </span>
          </div>

          <div
            style={{
              background:
                'rgba(255,255,255,0.025)',

              border:
                '1px solid rgba(255,255,255,0.05)',

              borderRadius: 12,

              padding: '9px 11px',

              marginBottom: 14,

              fontSize: 12,

              color:
                'var(--text-secondary)',

              position: 'relative',
              zIndex: 1,
            }}
          >
            {momentum.message}
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',

                fontSize: 11,

                color:
                  'var(--text-muted)',

                marginBottom: 6,
              }}
            >
              <span>
                Next milestone:{' '}
                <strong
                  style={{
                    color:
                      'var(--text-secondary)',
                  }}
                >
                  {nextMilestone.title}
                </strong>
              </span>

              <span
                style={{
                  color: 'var(--amber)',
                  fontWeight: 700,
                }}
              >
                {daysLeftMilestone}d
                left
              </span>
            </div>

            <div
              style={{
                height: 7,

                background:
                  'rgba(255,255,255,0.06)',

                borderRadius: 999,

                overflow: 'hidden',
              }}
            >
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
                style={{
                  height: '100%',

                  borderRadius: 999,

                  background:
                    'linear-gradient(90deg, #f59e0b, #fbbf24)',

                  boxShadow:
                    '0 0 12px rgba(245,158,11,0.4)',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',

              marginTop: 12,

              fontSize: 10,

              color:
                'var(--text-muted)',
            }}
          >
            <span>
              📊 Consistency
            </span>

            <strong
              style={{
                color: 'var(--amber)',
              }}
            >
              {userData?.consistency ||
                0}
              %
            </strong>
          </div>
        </motion.div>
      </div>

      {/* =====================================================
          MAIN GRID
          ===================================================== */}

      <div
        style={{
          display: 'grid',

          gridTemplateColumns:
            'minmax(0, 1fr) 340px',

          gap: 24,
        }}
      >
        {/* LEFT */}
        <div>
          {/* Today's Quests */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',

              marginBottom: 16,

              gap: 10,

              flexWrap: 'wrap',
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,

                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>⚔️</span>

              Today's Quests (
              {
                habits.filter(
                  (h) =>
                    h.completedToday
                ).length
              }
              /{habits.length})
            </h2>

            <span
              style={{
                fontSize: 13,
                color:
                  'var(--text-muted)',
              }}
            >
              {habits.length === 0
                ? 'No quests forged'
                : 'Complete to earn XP & Stat gains'}
            </span>
          </div>

          {/* Habit Cards */}
          {habits.length === 0 ? (
            <div
              style={{
                background:
                  'var(--glass-bg)',

                border:
                  '1px dashed var(--glass-border)',

                borderRadius: 20,

                padding:
                  '48px 20px',

                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 44,
                  marginBottom: 14,
                }}
              >
                ⚡
              </div>

              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Your Quest Log
                is Empty
              </h3>

              <p
                style={{
                  color:
                    'var(--text-muted)',

                  fontSize: 14,

                  margin:
                    '0 auto 24px',

                  maxWidth: 400,
                }}
              >
                Forge your first habit
                quest to start gaining
                XP, leveling up stats,
                and slaying weekly
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
            <div
              style={{
                display: 'flex',
                flexDirection:
                  'column',

                gap: 14,

                marginBottom: 32,
              }}
            >
              {habits.map(
                (habit) => (
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
                      setIsModalOpen(
                        true
                      );
                    }}

                    onDelete={
                      handleDeleteHabit
                    }

                    onTogglePause={
                      handleTogglePause
                    }
                  />
                )
              )}
            </div>
          )}

          {/* Weekly Boss */}
          {weeklyBoss && (
            <div
              style={{
                marginBottom: 32,
              }}
            >
              <BossCard
                boss={weeklyBoss}
              />
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div
          style={{
            display: 'flex',
            flexDirection:
              'column',

            gap: 24,
          }}
        >
          {/* Character Stats */}
          <div
            style={{
              background:
                'var(--glass-bg)',

              border:
                '1px solid var(--glass-border)',

              borderRadius: 20,

              padding: 20,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,

                marginBottom: 14,

                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>🧠</span>
              Character Stats
            </h3>

            <div
              style={{
                display: 'grid',

                gridTemplateColumns:
                  '1fr 1fr',

                gap: 10,
              }}
            >
              {Object.entries(
                userData?.stats || {}
              ).map(
                (
                  [
                    statName,
                    val,
                  ],
                  idx
                ) => (
                  <StatCard
                    key={statName}
                    statName={
                      statName
                    }
                    value={val}
                    index={idx}
                  />
                )
              )}
            </div>
          </div>

          {/* Achievements */}
          <div
            style={{
              background:
                'var(--glass-bg)',

              border:
                '1px solid var(--glass-border)',

              borderRadius: 20,

              padding: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'space-between',

                marginBottom: 14,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,

                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>🏆</span>
                Recent Achievements
              </h3>
            </div>

            {achievements.length ===
            0 ? (
              <div
                style={{
                  fontSize: 13,

                  color:
                    'var(--text-muted)',

                  textAlign: 'center',

                  padding:
                    '20px 0',
                }}
              >
                No achievements
                unlocked yet.
                Complete quests to
                earn your first
                trophy!
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection:
                    'column',

                  gap: 10,
                }}
              >
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
                      style={{
                        display:
                          'flex',

                        alignItems:
                          'center',

                        gap: 10,

                        padding:
                          '10px 12px',

                        background:
                          'rgba(255,255,255,0.03)',

                        borderRadius: 12,

                        border:
                          '1px solid var(--border)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 22,
                        }}
                      >
                        {ach.icon}
                      </span>

                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {ach.name}
                        </div>

                        <div
                          style={{
                            fontSize: 11,
                            color:
                              'var(--text-muted)',
                          }}
                        >
                          {
                            ach.description
                          }
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