import { motion } from 'framer-motion';
import { Lock, CheckCircle2 } from 'lucide-react';

const RARITY_CONFIG = {
  common: {
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.08)',
    border: 'rgba(148,163,184,0.2)',
    label: 'Common',
  },

  uncommon: {
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.22)',
    label: 'Uncommon',
  },

  rare: {
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.09)',
    border: 'rgba(99,102,241,0.25)',
    label: 'Rare',
  },

  legendary: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.09)',
    border: 'rgba(245,158,11,0.25)',
    label: 'Legendary',
  },
};

const AchievementCard = ({
  achievement,
  index = 0,
}) => {
  const rarity =
    RARITY_CONFIG[achievement.rarity] ||
    RARITY_CONFIG.common;

  const isUnlocked = achievement.unlocked;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.04,
        duration: 0.3,
      }}
      whileHover={{
        y: -3,
        scale: 1.01,
      }}
      style={{
        position: 'relative',

        background: isUnlocked
          ? `linear-gradient(
              135deg,
              ${rarity.bg},
              rgba(17,24,39,0.94)
            )`
          : 'rgba(255,255,255,0.018)',

        border: `1px solid ${
          isUnlocked
            ? rarity.border
            : 'rgba(255,255,255,0.07)'
        }`,

        borderRadius: 16,

        padding: 16,

        opacity: isUnlocked ? 1 : 0.6,

        filter: isUnlocked
          ? 'none'
          : 'grayscale(0.45)',

        overflow: 'hidden',

        boxShadow: isUnlocked
          ? `0 5px 20px ${rarity.bg}`
          : 'none',

        transition:
          'border-color 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Rarity accent */}
      {isUnlocked && (
        <div
          style={{
            position: 'absolute',

            top: 0,
            left: '8%',
            right: '8%',

            height: 2,

            background: `linear-gradient(
              90deg,
              transparent,
              ${rarity.color},
              transparent
            )`,

            opacity: 0.8,
          }}
        />
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
        }}
      >
        {/* Achievement Icon */}
        <motion.div
          whileHover={
            isUnlocked
              ? {
                  scale: 1.06,
                  rotate: 3,
                }
              : {}
          }
          style={{
            width: 50,
            height: 50,

            flexShrink: 0,

            background: isUnlocked
              ? rarity.bg
              : 'rgba(255,255,255,0.035)',

            border: `1px solid ${
              isUnlocked
                ? rarity.border
                : 'rgba(255,255,255,0.08)'
            }`,

            borderRadius: 14,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            fontSize: 23,

            position: 'relative',

            boxShadow: isUnlocked
              ? `0 0 10px ${rarity.color}18`
              : 'none',
          }}
        >
          {isUnlocked ? (
            achievement.icon
          ) : (
            <Lock
              size={19}
              color="#64748b"
            />
          )}
        </motion.div>

        {/* Details */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Name + Rarity */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,

              marginBottom: 5,

              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,

                color: isUnlocked
                  ? 'var(--text-primary)'
                  : 'var(--text-secondary)',
              }}
            >
              {achievement.name}
            </span>

            <span
              style={{
                fontSize: 9,

                fontWeight: 800,

                padding: '3px 7px',

                borderRadius: 6,

                background: rarity.bg,

                color: rarity.color,

                border: `1px solid ${rarity.border}`,

                textTransform: 'uppercase',

                letterSpacing: '0.06em',
              }}
            >
              {rarity.label}
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: 12.5,

              color: 'var(--text-muted)',

              lineHeight: 1.45,

              marginBottom: 7,
            }}
          >
            {achievement.description}
          </p>

          {/* Status */}
          {isUnlocked ? (
            <div
              style={{
                display: 'flex',

                alignItems: 'center',

                gap: 5,

                fontSize: 11,

                color: 'var(--green-light)',

                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={12} />

              <span>
                Unlocked
                {achievement.unlockedAt
                  ? ` • ${new Date(
                      achievement.unlockedAt
                    ).toLocaleDateString()}`
                  : ''}
              </span>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',

                alignItems: 'center',

                gap: 4,

                fontSize: 11,

                color: 'var(--text-muted)',

                fontStyle: 'italic',
              }}
            >
              <Lock size={11} />

              Challenge Locked
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;