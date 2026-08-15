import { motion } from 'framer-motion';
import {
  Check,
  Minus,
  Zap,
  Flame,
  Edit2,
  Trash2,
  Pause,
  Play,
} from 'lucide-react';

const DIFFICULTY_COLORS = {
  Easy: {
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    text: '#34d399',
    glow: 'rgba(16, 185, 129, 0.18)',
  },

  Medium: {
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    text: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.18)',
  },

  Hard: {
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.35)',
    text: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.18)',
  },

  Epic: {
    bg: 'rgba(124, 58, 237, 0.15)',
    border: 'rgba(139, 92, 246, 0.45)',
    text: '#a78bfa',
    glow: 'rgba(139, 92, 246, 0.2)',
  },
};

const CATEGORY_ICONS = {
  Health: '❤️',
  Fitness: '💪',
  Learning: '📚',
  Career: '💼',
  Mind: '🧘',
  Personal: '⭐',
  Social: '👥',
  Custom: '✨',
};

const STAT_COLORS = {
  strength: '#ef4444',
  intelligence: '#6366f1',
  focus: '#06b6d4',
  wisdom: '#f59e0b',
  recovery: '#10b981',
  discipline: '#8b5cf6',
  none: '#64748b',
};

const HabitCard = ({
  habit,
  onComplete,
  onMinComplete,
  onEdit,
  onDelete,
  onTogglePause,
}) => {
  const diff =
    DIFFICULTY_COLORS[habit.difficulty] ||
    DIFFICULTY_COLORS.Medium;

  const isCompleted = habit.completedToday;
  const isPaused = habit.paused;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{
        y: -3,
        scale: 1.004,
      }}
      transition={{
        duration: 0.25,
      }}
      style={{
        position: 'relative',
        borderRadius: 18,
        padding: 1,
        overflow: 'hidden',
        opacity: isPaused ? 0.6 : 1,

        background: isCompleted
          ? 'rgba(16, 185, 129, 0.32)'
          : diff.border,

        boxShadow: isCompleted
          ? '0 0 6px rgba(16, 185, 129, 0.12)'
          : `0 0 4px ${diff.glow}`,

        animation: 'none',
      }}
    >
      {/* =====================================================
          INNER CARD
      ===================================================== */}

      <div
        style={{
          position: 'relative',

          background: isCompleted
            ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(10,15,25,0.96))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.045), rgba(10,15,25,0.96))',

          borderRadius: 17,
          padding: '18px 20px',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          minHeight: 120,
        }}
      >
        {/* =====================================================
            ANIMATED SHINE
        ===================================================== */}

        <motion.div
          initial={{ x: '-120%' }}
          animate={{ x: '120%' }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatDelay: 7,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '35%',
            height: '100%',

            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.035), transparent)',

            transform: 'skewX(-20deg)',
            pointerEvents: 'none',
          }}
        />

        {/* =====================================================
            SUBTLE TOP LINE
        ===================================================== */}

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '8%',
            right: '8%',
            height: 2,

            background: isCompleted
              ? 'linear-gradient(90deg, transparent, #34d399, transparent)'
              : `linear-gradient(90deg, transparent, ${diff.text}, transparent)`,

            boxShadow: isCompleted
              ? '0 0 5px #34d399'
              : `0 0 5px ${diff.glow}`,

            opacity: 0.55,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* =====================================================
              MAIN CONTENT

              50px      = icon
              1fr       = habit information
              140px     = XP + buttons

              This prevents habit names such as
              "Web Development" from overlapping buttons.
          ===================================================== */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '50px minmax(0, 1fr) 140px',
              alignItems: 'start',
              gap: 14,
              width: '100%',
            }}
          >
            {/* =================================================
                ICON
            ================================================= */}

            <motion.div
              whileHover={{
                scale: 1.08,
                rotate: 5,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
              }}
              style={{
                width: 50,
                height: 50,
                flexShrink: 0,

                background: diff.bg,
                border: `1px solid ${diff.border}`,
                borderRadius: 14,

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                fontSize: 23,

                boxShadow: isCompleted
                  ? '0 0 8px rgba(16,185,129,0.12)'
                  : `0 0 7px ${diff.glow}`,

                transition: 'all 0.3s ease',
              }}
            >
              {habit.icon ||
                CATEGORY_ICONS[habit.category] ||
                '⚡'}
            </motion.div>

            {/* =================================================
                HABIT INFORMATION
            ================================================= */}

            <div
              style={{
                minWidth: 0,
                width: '100%',
                overflow: 'hidden',
              }}
            >
              {/* Habit name + difficulty */}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                  marginBottom: 5,

                  minWidth: 0,
                  width: '100%',
                }}
              >
                <span
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    lineHeight: 1.25,

                    color: isCompleted
                      ? 'var(--text-secondary)'
                      : 'var(--text-primary)',

                    textDecoration: isCompleted
                      ? 'line-through'
                      : 'none',

                    opacity: isCompleted ? 0.75 : 1,

                    /*
                     * Prevent the name from overflowing
                     * into the action column.
                     */
                    minWidth: 0,
                    maxWidth: '100%',

                    overflowWrap: 'anywhere',
                    wordBreak: 'normal',
                  }}
                >
                  {habit.name}
                </span>

                {/* Difficulty */}

                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,

                    padding: '3px 9px',
                    borderRadius: 999,

                    background: diff.bg,
                    border: `1px solid ${diff.border}`,
                    color: diff.text,

                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',

                    boxShadow: `0 0 4px ${diff.glow}`,

                    flexShrink: 0,
                  }}
                >
                  {habit.difficulty}
                </span>
              </div>

              {/* =================================================
                  METADATA
              ================================================= */}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,

                  flexWrap: 'wrap',
                  marginTop: 5,

                  minWidth: 0,
                }}
              >
                {/* Target */}

                {habit.target && (
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--text-muted)',

                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,

                      minWidth: 0,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    🎯 {habit.target}
                  </span>
                )}

                {/* Stat */}

                {habit.stat &&
                  habit.stat !== 'none' && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,

                        color:
                          STAT_COLORS[habit.stat] ||
                          STAT_COLORS.none,

                        background: `${
                          STAT_COLORS[habit.stat] ||
                          STAT_COLORS.none
                        }15`,

                        padding: '3px 8px',
                        borderRadius: 6,

                        border: `1px solid ${
                          STAT_COLORS[habit.stat] ||
                          STAT_COLORS.none
                        }30`,

                        textTransform: 'capitalize',

                        flexShrink: 0,
                      }}
                    >
                      +{habit.stat}
                    </span>
                  )}

                {/* Streak */}

                {habit.currentStreak > 0 && (
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--amber)',
                      fontWeight: 600,

                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,

                      textShadow:
                        '0 0 5px rgba(245,158,11,0.25)',

                      flexShrink: 0,
                    }}
                  >
                    <Flame
                      size={12}
                      fill="currentColor"
                    />

                    {habit.currentStreak}d Streak
                  </span>
                )}
              </div>
            </div>

            {/* =================================================
                RIGHT SIDE

                XP
                Complete
                Min

                All have their own fixed 140px column.
            ================================================= */}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',

                gap: 8,

                width: 140,
                minWidth: 140,
                flexShrink: 0,
              }}
            >
              {/* =================================================
                  XP
              ================================================= */}

              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  gap: 4,

                  background:
                    'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(139,92,246,0.08))',

                  border:
                    '1px solid rgba(139,92,246,0.4)',

                  borderRadius: 999,

                  padding: '5px 12px',

                  fontSize: 12,
                  fontWeight: 800,
                  color: '#a78bfa',

                  boxShadow:
                    '0 0 6px rgba(124,58,237,0.15)',

                  whiteSpace: 'nowrap',
                }}
              >
                <Zap
                  size={12}
                  fill="currentColor"
                />

                +{habit.xpReward} XP
              </motion.div>

              {/* =================================================
                  ACTIVE BUTTONS
              ================================================= */}

              {!isPaused && !isCompleted && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',

                    alignItems: 'flex-end',

                    gap: 8,

                    width: '100%',
                  }}
                >
                  {/* =================================================
                      COMPLETE BUTTON
                  ================================================= */}

                  <motion.button
                    whileHover={{
                      scale: 1.04,
                      boxShadow:
                        '0 0 10px rgba(16,185,129,0.25)',
                    }}
                    whileTap={{
                      scale: 0.92,
                    }}
                    onClick={() =>
                      onComplete?.(habit)
                    }
                    style={{
                      padding: '7px 15px',

                      background:
                        'linear-gradient(135deg, #10b981, #059669)',

                      border: 'none',
                      borderRadius: 10,

                      cursor: 'pointer',

                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',

                      gap: 6,

                      color: 'white',

                      fontSize: 13,
                      fontWeight: 800,

                      boxShadow:
                        '0 4px 10px rgba(16,185,129,0.2)',

                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Check size={14} />

                    Complete
                  </motion.button>

                  {/* =================================================
                      MINIMUM BUTTON

                      IMPORTANT:
                      It is BELOW Complete.
                  ================================================= */}

                  {habit.minimumTarget && (
                    <motion.button
                      whileHover={{
                        scale: 1.04,
                        boxShadow:
                          '0 0 8px rgba(245,158,11,0.2)',
                      }}
                      whileTap={{
                        scale: 0.94,
                      }}
                      onClick={() =>
                        onMinComplete?.(habit)
                      }
                      title={`Minimum Quest: ${habit.minimumTarget}`}
                      style={{
                        padding: '6px 10px',

                        background:
                          'rgba(245,158,11,0.12)',

                        border:
                          '1px solid rgba(245,158,11,0.4)',

                        borderRadius: 10,

                        cursor: 'pointer',

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                        gap: 4,

                        color: 'var(--amber)',

                        fontSize: 11,
                        fontWeight: 700,

                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Minus size={13} />

                      Min ({habit.minimumXpReward}XP)
                    </motion.button>
                  )}
                </div>
              )}

              {/* =================================================
                  COMPLETED
              ================================================= */}

              {isCompleted && (
                <motion.div
                  initial={{
                    scale: 0.8,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  style={{
                    padding: '7px 14px',

                    background:
                      'rgba(16,185,129,0.12)',

                    border:
                      '1px solid rgba(16,185,129,0.45)',

                    borderRadius: 10,

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    gap: 6,

                    color: '#34d399',

                    fontWeight: 800,
                    fontSize: 11,

                    boxShadow:
                      '0 0 7px rgba(16,185,129,0.12)',

                    whiteSpace: 'nowrap',
                  }}
                >
                  <Check size={14} />

                  COMPLETED
                </motion.div>
              )}
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <div
            style={{
              display: 'flex',

              gap: 12,

              marginTop: 14,
              paddingTop: 11,

              borderTop:
                '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* =================================================
                EDIT
            ================================================= */}

            <button
              onClick={() =>
                onEdit?.(habit)
              }
              style={{
                background: 'none',
                border: 'none',

                cursor: 'pointer',

                color: 'var(--text-muted)',
                fontSize: 12,

                display: 'flex',
                alignItems: 'center',

                gap: 4,

                padding: '3px 7px',
                borderRadius: 6,

                transition:
                  'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  'var(--text-primary)';

                e.currentTarget.style.background =
                  'var(--glass-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  'var(--text-muted)';

                e.currentTarget.style.background =
                  'none';
              }}
            >
              <Edit2 size={11} />

              Edit Quest
            </button>

            {/* =================================================
                PAUSE
            ================================================= */}

            <button
              onClick={() =>
                onTogglePause?.(habit)
              }
              style={{
                background: 'none',
                border: 'none',

                cursor: 'pointer',

                color: 'var(--text-muted)',
                fontSize: 12,

                display: 'flex',
                alignItems: 'center',

                gap: 4,

                padding: '3px 7px',
                borderRadius: 6,

                transition:
                  'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  'var(--amber)';

                e.currentTarget.style.background =
                  'var(--amber-dim)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  'var(--text-muted)';

                e.currentTarget.style.background =
                  'none';
              }}
            >
              {isPaused ? (
                <>
                  <Play size={11} />

                  Resume
                </>
              ) : (
                <>
                  <Pause size={11} />

                  Pause
                </>
              )}
            </button>

            {/* =================================================
                DELETE
            ================================================= */}

            <button
              onClick={() =>
                onDelete?.(habit)
              }
              style={{
                background: 'none',
                border: 'none',

                cursor: 'pointer',

                color: 'var(--text-muted)',
                fontSize: 12,

                display: 'flex',
                alignItems: 'center',

                gap: 4,

                padding: '3px 7px',
                borderRadius: 6,

                transition:
                  'all 0.2s ease',

                marginLeft: 'auto',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  'var(--red)';

                e.currentTarget.style.background =
                  'var(--red-dim)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  'var(--text-muted)';

                e.currentTarget.style.background =
                  'none';
              }}
            >
              <Trash2 size={11} />

              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitCard;