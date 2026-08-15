import { motion } from 'framer-motion';

const STAT_CONFIG = {
  strength: {
    icon: '⚔️',
    color: '#ef4444',
    label: 'Strength',
  },
  intelligence: {
    icon: '🧠',
    color: '#6366f1',
    label: 'Intelligence',
  },
  focus: {
    icon: '🎯',
    color: '#06b6d4',
    label: 'Focus',
  },
  wisdom: {
    icon: '📚',
    color: '#f59e0b',
    label: 'Wisdom',
  },
  recovery: {
    icon: '💚',
    color: '#10b981',
    label: 'Recovery',
  },
  discipline: {
    icon: '🔱',
    color: '#8b5cf6',
    label: 'Discipline',
  },
};

const StatCard = ({
  statName,
  value,
  index = 0,
}) => {
  const config =
    STAT_CONFIG[statName] || {
      icon: '⚡',
      color: '#64748b',
      label: statName,
    };

  const percent = Math.min(
    100,
    Math.max(0, Math.round(value || 0))
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.06,
        duration: 0.35,
      }}
      whileHover={{
        y: -2,
        borderColor: `${config.color}55`,
      }}
      style={{
        position: 'relative',
        overflow: 'hidden',

        background: `
          linear-gradient(
            135deg,
            ${config.color}0d,
            rgba(255,255,255,0.025)
          )
        `,

        border: `1px solid ${config.color}25`,

        borderRadius: 14,

        padding: '13px 14px',

        transition: 'border-color 0.25s ease',
      }}
    >
      {/* Small accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 14,
          right: 14,
          height: 1,

          background: `
            linear-gradient(
              90deg,
              transparent,
              ${config.color}80,
              transparent
            )
          `,

          opacity: 0.7,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',

          marginBottom: 9,
        }}
      >
        {/* Icon + name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minWidth: 0,
          }}
        >
          <motion.div
            whileHover={{
              scale: 1.1,
              rotate: 4,
            }}
            style={{
              width: 30,
              height: 30,

              borderRadius: 9,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              background: `${config.color}12`,
              border: `1px solid ${config.color}25`,

              fontSize: 15,

              flexShrink: 0,
            }}
          >
            {config.icon}
          </motion.div>

          <span
            style={{
              fontSize: 11,
              fontWeight: 700,

              color: 'var(--text-secondary)',

              textTransform: 'uppercase',
              letterSpacing: '0.06em',

              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {config.label}
          </span>
        </div>

        {/* Value */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.3 + index * 0.05,
          }}
          style={{
            fontFamily:
              'Rajdhani, sans-serif',

            fontSize: 21,
            fontWeight: 800,

            color: config.color,

            lineHeight: 1,

            textShadow:
              `0 0 8px ${config.color}25`,
          }}
        >
          {percent}
        </motion.span>
      </div>

      {/* Progress */}
      <div
        style={{
          height: 6,

          background:
            'rgba(255,255,255,0.055)',

          borderRadius: 999,

          overflow: 'hidden',

          boxShadow:
            'inset 0 1px 3px rgba(0,0,0,0.25)',
        }}
      >
        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${percent}%`,
          }}
          transition={{
            duration: 0.9,
            delay: 0.25 + index * 0.06,
            ease: 'easeOut',
          }}
          style={{
            height: '100%',

            background: `
              linear-gradient(
                90deg,
                ${config.color}80,
                ${config.color}
              )
            `,

            borderRadius: 999,

            boxShadow:
              `0 0 6px ${config.color}30`,
          }}
        />
      </div>

      {/* Bottom label */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',

          marginTop: 6,

          fontSize: 9,
          color: 'var(--text-muted)',
        }}
      >
        <span>STAT LEVEL</span>

        <span>
          {percent >= 80
            ? 'Elite'
            : percent >= 60
            ? 'Strong'
            : percent >= 30
            ? 'Developing'
            : 'Beginner'}
        </span>
      </div>
    </motion.div>
  );
};

export default StatCard;