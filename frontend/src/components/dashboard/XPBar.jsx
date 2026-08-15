import { motion } from 'framer-motion';
import { Zap, Sparkles, Trophy } from 'lucide-react';

const XPBar = ({
  currentXp = 0,
  nextLevelXp = 100,
  level = 1,
  title = 'Novice',
}) => {
  const percent =
    nextLevelXp > 0
      ? Math.min(
          100,
          Math.round((currentXp / nextLevelXp) * 100)
        )
      : 0;

  const xpRemaining = Math.max(
    0,
    nextLevelXp - currentXp
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'relative',
        overflow: 'hidden',

        background:
          'linear-gradient(135deg, rgba(124,58,237,0.13), rgba(6,182,212,0.07))',

        border:
          '1px solid rgba(124,58,237,0.28)',

        borderRadius: 20,

        padding: '20px 22px',

        boxShadow:
          '0 8px 35px rgba(124,58,237,0.08)',
      }}
    >
      {/* Background glow */}
      <motion.div
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: 180,
          height: 180,
          borderRadius: '50%',

          background:
            'radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)',

          top: -100,
          right: -60,

          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',

          gap: 15,

          marginBottom: 16,

          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Level */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Level icon */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 10px rgba(124,58,237,0.15)',
                '0 0 22px rgba(124,58,237,0.35)',
                '0 0 10px rgba(124,58,237,0.15)',
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
            style={{
              width: 48,
              height: 48,

              borderRadius: 14,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              background:
                'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(6,182,212,0.12))',

              border:
                '1px solid rgba(124,58,237,0.35)',
            }}
          >
            <Trophy
              size={23}
              color="var(--violet-light)"
            />
          </motion.div>

          <div>
            <div
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: 28,
                fontWeight: 800,

                background:
                  'linear-gradient(135deg, var(--violet-light), var(--cyan))',

                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',

                lineHeight: 1,
              }}
            >
              LEVEL {level}
            </div>

            <div
              style={{
                marginTop: 4,

                fontSize: 11,
                color: 'var(--text-muted)',

                fontWeight: 600,

                textTransform: 'uppercase',
                letterSpacing: 1.2,
              }}
            >
              {title}
            </div>
          </div>
        </div>

        {/* XP */}
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 5,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, -8, 8, 0],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <Zap
                size={16}
                color="var(--violet-light)"
                fill="var(--violet-light)"
              />
            </motion.div>

            <span
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: 23,
                fontWeight: 800,

                color: 'var(--violet-light)',
              }}
            >
              {currentXp?.toLocaleString()}
            </span>
          </div>

          <div
            style={{
              fontSize: 10,
              color: 'var(--text-muted)',
              marginTop: 1,
            }}
          >
            / {nextLevelXp?.toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* XP bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            height: 14,

            background:
              'rgba(255,255,255,0.055)',

            border:
              '1px solid rgba(255,255,255,0.07)',

            borderRadius: 999,

            overflow: 'hidden',

            position: 'relative',

            boxShadow:
              'inset 0 2px 5px rgba(0,0,0,0.25)',
          }}
        >
          {/* Progress */}
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${percent}%`,
            }}
            transition={{
              duration: 1.3,
              ease: 'easeOut',
            }}
            style={{
              height: '100%',

              borderRadius: 999,

              position: 'relative',
              overflow: 'hidden',

              background:
                'linear-gradient(90deg, #7c3aed, #8b5cf6, #06b6d4)',

              boxShadow:
                '0 0 16px rgba(124,58,237,0.45)',
            }}
          >
            {/* Moving shine */}
            <motion.div
              animate={{
                x: ['-100%', '250%'],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 1,
              }}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,

                width: '35%',

                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',

                transform: 'skewX(-20deg)',
              }}
            />
          </motion.div>
        </div>

        {/* Bar labels */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',

            alignItems: 'center',

            marginTop: 8,

            fontSize: 10,
            color: 'var(--text-muted)',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Sparkles
              size={11}
              color="var(--violet-light)"
            />

            {percent}% COMPLETE
          </span>

          <span>
            <strong
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              {xpRemaining.toLocaleString()}
            </strong>{' '}
            XP to next level
          </span>
        </div>
      </div>

      {/* Progress message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.5,
        }}
        style={{
          marginTop: 14,

          padding: '8px 11px',

          borderRadius: 10,

          background:
            'rgba(124,58,237,0.07)',

          border:
            '1px solid rgba(124,58,237,0.12)',

          fontSize: 11,
          color: 'var(--text-muted)',

          display: 'flex',
          alignItems: 'center',
          gap: 7,
        }}
      >
        <Zap
          size={12}
          color="var(--violet-light)"
        />

        {percent >= 80
          ? '🔥 You are almost at the next level!'
          : percent >= 50
          ? '⚡ Great momentum. Keep pushing!'
          : '🎯 Every quest brings you closer to your next level.'}
      </motion.div>
    </motion.div>
  );
};

export default XPBar;