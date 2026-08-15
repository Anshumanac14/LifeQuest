import { motion } from 'framer-motion';
import { Shield, Zap, Swords, Skull, Trophy } from 'lucide-react';

const BossCard = ({ boss }) => {
  if (!boss) return null;

  const hpPercent =
    boss.target > 0
      ? Math.min(
          100,
          Math.round((boss.progress / boss.target) * 100)
        )
      : 0;

  const remaining = Math.max(
    0,
    boss.target - boss.progress
  );

  const isDefeated = boss.completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        scale: 1.005,
      }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'relative',
        padding: 1,
        borderRadius: 20,
        overflow: 'hidden',

        background: isDefeated
          ? 'linear-gradient(120deg, #10b981, #34d399, #06b6d4, #10b981)'
          : 'linear-gradient(120deg, #ec4899, #8b5cf6, #06b6d4, #ec4899)',

        backgroundSize: '300% 300%',

        /* REDUCED BOSS CARD OUTER GLOW */
        boxShadow: isDefeated
          ? '0 0 8px rgba(16,185,129,0.18), 0 0 20px rgba(16,185,129,0.05)'
          : '0 0 8px rgba(236,72,153,0.15), 0 0 20px rgba(139,92,246,0.05)',

        animation: 'bossBorderGlow 6s ease infinite',
      }}
    >
      {/* Inner card */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',

          background: isDefeated
            ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(7,15,20,0.97))'
            : 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(10,10,20,0.97))',

          borderRadius: 19,
          padding: '22px',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Background glow - REDUCED */}
        <motion.div
          animate={{
            opacity: [0.08, 0.16, 0.08],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: '50%',

            background: isDefeated
              ? 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)'
              : 'radial-gradient(circle, rgba(236,72,153,0.11), transparent 70%)',

            top: -120,
            right: -80,

            pointerEvents: 'none',
          }}
        />

        {/* Top glowing line - REDUCED */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '8%',
            right: '8%',
            height: 2,

            background: isDefeated
              ? 'linear-gradient(90deg, transparent, #34d399, transparent)'
              : 'linear-gradient(90deg, transparent, #ec4899, #8b5cf6, transparent)',

            boxShadow: isDefeated
              ? '0 0 6px rgba(52,211,153,0.45)'
              : '0 0 6px rgba(236,72,153,0.4)',

            opacity: 0.7,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 15,
              marginBottom: 18,
            }}
          >
            {/* Boss information */}
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,

                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 2,

                  color: isDefeated
                    ? '#34d399'
                    : '#f472b6',

                  textTransform: 'uppercase',
                  marginBottom: 5,

                  textShadow: isDefeated
                    ? '0 0 6px rgba(52,211,153,0.3)'
                    : '0 0 6px rgba(244,114,182,0.3)',
                }}
              >
                {isDefeated ? (
                  <>
                    <Trophy size={12} />
                    BOSS DEFEATED
                  </>
                ) : (
                  <>
                    <Skull size={12} />
                    WEEKLY BOSS
                  </>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,

                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: 22,
                  fontWeight: 800,

                  lineHeight: 1.1,
                }}
              >
                <span
                  style={{
                    fontSize: 25,

                    /* REDUCED ICON GLOW */
                    filter: isDefeated
                      ? 'drop-shadow(0 0 5px rgba(16,185,129,0.3))'
                      : 'drop-shadow(0 0 5px rgba(236,72,153,0.3))',
                  }}
                >
                  {boss.icon}
                </span>

                {boss.title}
              </div>

              {boss.description && (
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    marginTop: 5,
                    lineHeight: 1.5,
                  }}
                >
                  {boss.description}
                </p>
              )}
            </div>

            {/* XP reward */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              style={{
                flexShrink: 0,

                display: 'flex',
                alignItems: 'center',
                gap: 5,

                background: isDefeated
                  ? 'rgba(16,185,129,0.12)'
                  : 'rgba(139,92,246,0.15)',

                border: isDefeated
                  ? '1px solid rgba(16,185,129,0.4)'
                  : '1px solid rgba(139,92,246,0.4)',

                borderRadius: 999,
                padding: '6px 12px',

                /* REDUCED XP GLOW */
                boxShadow: isDefeated
                  ? '0 0 7px rgba(16,185,129,0.12)'
                  : '0 0 7px rgba(139,92,246,0.12)',
              }}
            >
              <Zap
                size={13}
                color={
                  isDefeated
                    ? '#34d399'
                    : '#a78bfa'
                }
                fill="currentColor"
              />

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: isDefeated
                    ? '#34d399'
                    : '#a78bfa',
                }}
              >
                +{boss.reward} XP
              </span>
            </motion.div>
          </div>

          {/* HP section */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 7,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Shield
                  size={14}
                  color="var(--text-muted)"
                />

                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                  }}
                >
                  BOSS HP
                </span>
              </div>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                }}
              >
                {isDefeated
                  ? '0'
                  : remaining.toLocaleString()}{' '}
                / {boss.target.toLocaleString()} HP
              </span>
            </div>

            {/* HP bar */}
            <div
              style={{
                height: 14,

                background:
                  'rgba(255,255,255,0.05)',

                border:
                  '1px solid rgba(255,255,255,0.07)',

                borderRadius: 999,
                overflow: 'hidden',

                boxShadow:
                  'inset 0 2px 5px rgba(0,0,0,0.3)',
              }}
            >
              <motion.div
                initial={{ width: '100%' }}
                animate={{
                  width: isDefeated
                    ? '0%'
                    : `${100 - hpPercent}%`,
                }}
                transition={{
                  duration: 1.5,
                  ease: 'easeOut',
                }}
                style={{
                  height: '100%',
                  borderRadius: 999,

                  position: 'relative',
                  overflow: 'hidden',

                  background: isDefeated
                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                    : 'linear-gradient(90deg, #ec4899, #8b5cf6)',

                  /* REDUCED HP BAR GLOW */
                  boxShadow: isDefeated
                    ? '0 0 8px rgba(16,185,129,0.3)'
                    : '0 0 8px rgba(236,72,153,0.28)',
                }}
              >
                {/* Moving shine */}
                {!isDefeated && (
                  <motion.div
                    animate={{
                      x: ['-100%', '250%'],
                    }}
                    transition={{
                      duration: 2.5,
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
                )}
              </motion.div>
            </div>

            {/* Damage percentage */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 6,

                fontSize: 10,
                color: 'var(--text-muted)',
              }}
            >
              <span>
                {isDefeated
                  ? '☠️ BOSS ELIMINATED'
                  : `${hpPercent}% damage dealt`}
              </span>

              {!isDefeated && (
                <span
                  style={{
                    color: '#f472b6',
                    fontWeight: 700,
                  }}
                >
                  {100 - hpPercent}% HP remaining
                </span>
              )}
            </div>
          </div>

          {/* Bottom message */}
          {!isDefeated ? (
            <motion.div
              whileHover={{
                background:
                  'rgba(255,255,255,0.055)',
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,

                padding: '10px 13px',

                background:
                  'rgba(255,255,255,0.03)',

                border:
                  '1px solid rgba(255,255,255,0.07)',

                borderRadius: 10,
              }}
            >
              <Swords
                size={14}
                color="#f472b6"
              />

              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                }}
              >
                Complete habits to deal damage and
                defeat the boss for{' '}
                <strong
                  style={{
                    color: '#a78bfa',
                  }}
                >
                  +{boss.reward} XP
                </strong>
                !
              </span>
            </motion.div>
          ) : (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,

                padding: '10px 13px',

                background:
                  'rgba(16,185,129,0.08)',

                border:
                  '1px solid rgba(16,185,129,0.25)',

                borderRadius: 10,

                color: '#34d399',
                fontSize: 11,
                fontWeight: 700,

                boxShadow:
                  '0 0 8px rgba(16,185,129,0.05)',
              }}
            >
              <Trophy size={14} />

              Weekly boss defeated! Your discipline
              has been rewarded.
            </motion.div>
          )}
        </div>
      </div>

      {/* Border animation */}
      <style>
        {`
          @keyframes bossBorderGlow {
            0% {
              background-position: 0% 50%;
            }

            50% {
              background-position: 100% 50%;
            }

            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
    </motion.div>
  );
};

export default BossCard;