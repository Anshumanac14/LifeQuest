import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import LoadingScreen from '../components/ui/LoadingScreen';
import LevelUpModal from '../components/ui/LevelUpModal';
import { Sword, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const QuestsPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [levelUpData, setLevelUpData] = useState({
    show: false,
    oldLevel: 1,
    newLevel: 1,
    title: '',
  });

  const fetchQuests = async () => {
    try {
      const res = await api.get('/dashboard');

      if (res.data.success) {
        setData(res.data.dashboard);
      }
    } catch (err) {
      toast.error('Failed to load quests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  const handleComplete = async (habitId, isMinimum = false) => {
    try {
      const res = await api.post(`/habits/${habitId}/complete`, {
        isMinimum,
      });

      if (res.data.success) {
        sound.playComplete(user?.settings?.soundEnabled);

        toast.success(res.data.message);

        if (res.data.leveledUp) {
          setLevelUpData({
            show: true,
            oldLevel: res.data.oldLevel,
            newLevel: res.data.newLevel,
            title: res.data.user.title,
          });
        }

        fetchQuests();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Error completing quest'
      );
    }
  };

  if (loading) return <LoadingScreen />;

  const habits = data?.habits || [];

  const completedCount = habits.filter(
    h => h.completedToday
  ).length;

  const totalCount = habits.length;

  const bonusProgress = Math.min(3, completedCount);

  const isBonusComplete = bonusProgress >= 3;

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: '0 auto',
        paddingBottom: 40,
      }}
    >
      <LevelUpModal
        isOpen={levelUpData.show}
        onClose={() =>
          setLevelUpData(prev => ({
            ...prev,
            show: false,
          }))
        }
        oldLevel={levelUpData.oldLevel}
        newLevel={levelUpData.newLevel}
        title={levelUpData.title}
        soundEnabled={user?.settings?.soundEnabled}
      />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 32,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Sword color="var(--violet-light)" />
          QUEST LOG & DAILY CHALLENGES
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 14,
          }}
        >
          Turn your real-world actions into completed quests to
          earn XP and level up stats.
        </p>
      </div>

      {/* Daily Bonus Quest Card */}
      <div
        style={{
          background: isBonusComplete
            ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(124,58,237,0.1))'
            : 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(245,158,11,0.08))',

          border: `1px solid ${
            isBonusComplete
              ? 'rgba(16,185,129,0.4)'
              : 'rgba(124,58,237,0.3)'
          }`,

          borderRadius: 20,
          padding: '22px 26px',
          marginBottom: 28,

          boxShadow: isBonusComplete
            ? '0 0 25px rgba(16,185,129,0.18)'
            : '0 0 22px rgba(124,58,237,0.10)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 28 }}>
              {isBonusComplete ? '🏆' : '🎯'}
            </span>

            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: isBonusComplete
                    ? 'var(--green-light)'
                    : 'var(--text-primary)',
                }}
              >
                {isBonusComplete
                  ? 'DAILY BONUS CLAIMED!'
                  : 'DAILY QUEST BONUS'}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                }}
              >
                Complete 3 quests today to claim{' '}
                <strong style={{ color: 'var(--amber)' }}>
                  +100 Bonus XP
                </strong>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--amber)',
              }}
            >
              {bonusProgress}/3{' '}
              {isBonusComplete ? 'COMPLETE 🎉' : ''}
            </span>
          </div>
        </div>

        <div
          className="progress-track"
          style={{ height: 10 }}
        >
          <div
            className={`progress-fill ${
              isBonusComplete
                ? 'progress-green'
                : 'progress-amber'
            }`}
            style={{
              width: `${(bonusProgress / 3) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Quest Cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 32,
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
          Active Quests ({completedCount}/{totalCount})
        </h2>

        {habits.length === 0 ? (
          <div
            style={{
              background: 'var(--glass-bg)',
              border: '1px dashed var(--glass-border)',
              borderRadius: 16,
              padding: '36px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            No quests created yet. Go to Habits page or Dashboard
            to forge new quests!
          </div>
        ) : (
          habits.map(habit => {
            const isDone = habit.completedToday;

            return (
              <motion.div
                key={habit._id}
                whileHover={{
                  y: -3,
                  scale: 1.005,
                }}
                transition={{
                  duration: 0.2,
                }}
                style={{
                  position: 'relative',

                  background: isDone
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.09), rgba(10,15,25,0.96))'
                    : 'linear-gradient(135deg, rgba(124,58,237,0.07), rgba(10,15,25,0.96))',

                  border: `1px solid ${
                    isDone
                      ? 'rgba(16,185,129,0.35)'
                      : 'rgba(124,58,237,0.28)'
                  }`,

                  borderRadius: 18,
                  padding: '20px 24px',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,

                  backdropFilter: 'blur(16px)',

                  /* ⭐ Middle-ground RPG glow */
                  boxShadow: isDone
                    ? '0 0 18px rgba(16,185,129,0.14), 0 8px 25px rgba(0,0,0,0.20)'
                    : '0 0 16px rgba(124,58,237,0.12), 0 8px 25px rgba(0,0,0,0.22)',

                  transition:
                    'border-color 0.25s ease, box-shadow 0.25s ease',
                }}
              >
                {/* Subtle top accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '12%',
                    right: '12%',
                    height: 1,

                    background: isDone
                      ? 'linear-gradient(90deg, transparent, rgba(52,211,153,0.7), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(167,139,250,0.65), transparent)',

                    opacity: 0.8,
                    pointerEvents: 'none',
                  }}
                />

                {/* Left side */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{
                      scale: 1.06,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 14,

                      background: isDone
                        ? 'rgba(16,185,129,0.13)'
                        : 'rgba(124,58,237,0.12)',

                      border: `1px solid ${
                        isDone
                          ? 'rgba(16,185,129,0.32)'
                          : 'rgba(124,58,237,0.30)'
                      }`,

                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',

                      fontSize: 24,

                      /* Small icon glow */
                      boxShadow: isDone
                        ? '0 0 12px rgba(16,185,129,0.14)'
                        : '0 0 12px rgba(124,58,237,0.14)',
                    }}
                  >
                    {habit.icon || '⚡'}
                  </motion.div>

                  {/* Information */}
                  <div>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 700,

                        textDecoration: isDone
                          ? 'line-through'
                          : 'none',

                        color: isDone
                          ? 'var(--text-secondary)'
                          : 'var(--text-primary)',
                      }}
                    >
                      {habit.name}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        color: 'var(--text-muted)',
                        display: 'flex',
                        gap: 10,
                        marginTop: 4,
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span>
                        Target:{' '}
                        {habit.target ||
                          'Daily completion'}
                      </span>

                      {habit.stat !== 'none' && (
                        <span
                          style={{
                            color: 'var(--cyan)',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}
                        >
                          +{habit.stat}
                        </span>
                      )}

                      <span
                        style={{
                          color: 'var(--violet-light)',
                          fontWeight: 700,
                        }}
                      >
                        +{habit.xpReward} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                {!isDone ? (
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                    }}
                  >
                    {habit.minimumTarget && (
                      <button
                        className="btn btn-secondary"
                        style={{
                          padding: '8px 14px',
                          fontSize: 12,
                        }}
                        onClick={() =>
                          handleComplete(
                            habit._id,
                            true
                          )
                        }
                      >
                        Min ({habit.minimumTarget})
                      </button>
                    )}

                    <button
                      className="btn btn-primary"
                      style={{
                        padding: '10px 18px',
                        fontSize: 13,

                        /* Slightly stronger button presence */
                        boxShadow:
                          '0 4px 14px rgba(124,58,237,0.18)',
                      }}
                      onClick={() =>
                        handleComplete(
                          habit._id,
                          false
                        )
                      }
                    >
                      Complete Quest
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,

                      color: 'var(--green-light)',
                      fontWeight: 700,
                      fontSize: 14,

                      textShadow:
                        '0 0 8px rgba(16,185,129,0.25)',
                    }}
                  >
                    <CheckCircle2 size={18} />
                    COMPLETED
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QuestsPage;