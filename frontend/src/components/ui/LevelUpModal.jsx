import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { sound } from '../../utils/audio';
import { Sparkles, Trophy, Zap, ArrowRight } from 'lucide-react';

const PARTICLE_COUNT = 24;

const LevelUpModal = ({
  isOpen,
  onClose,
  oldLevel,
  newLevel,
  title,
  soundEnabled = false,
}) => {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    tx: (Math.random() - 0.5) * 420,
    ty: -(Math.random() * 280 + 70),
    delay: Math.random() * 0.35,
    size: Math.random() * 8 + 3,
    color: [
      '#7c3aed',
      '#06b6d4',
      '#10b981',
      '#f59e0b',
      '#ec4899',
    ][Math.floor(Math.random() * 5)],
    shape: Math.random() > 0.5 ? '50%' : '3px',
  }));

  useEffect(() => {
    if (isOpen) {
      sound.playLevelUp(soundEnabled);

      const timer = setTimeout(onClose, 6000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, soundEnabled]);

  const motivationalMessages = [
    'Your power grows with every single habit!',
    'The hero within you has reached a new height.',
    "Mastery is built day by day. You're living proof.",
    'Unstoppable momentum. Keep forging your path!',
    'Your dedication is rewriting your personal story.',
  ];

  const message =
    motivationalMessages[newLevel % motivationalMessages.length];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,

            background: 'rgba(5, 7, 15, 0.82)',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            zIndex: 9999,

            backdropFilter: 'blur(10px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              style={{
                position: 'absolute',

                width: p.size,
                height: p.size,

                borderRadius: p.shape,

                background: p.color,

                left: '50%',
                top: '50%',

                opacity: 0.8,

                pointerEvents: 'none',
              }}
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0, 1, 0.4],
                x: p.tx,
                y: p.ty,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1.8,
                delay: p.delay,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Modal */}
          <motion.div
            style={{
              position: 'relative',

              background:
                'linear-gradient(135deg, #0d1117 0%, #151022 50%, #0d1720 100%)',

              border:
                '1px solid rgba(139,92,246,0.5)',

              borderRadius: 24,

              padding: '36px 34px',

              textAlign: 'center',

              maxWidth: 450,
              width: '90%',

              boxShadow:
                '0 20px 70px rgba(0,0,0,0.55), 0 0 35px rgba(124,58,237,0.18)',

              position: 'relative',

              overflow: 'hidden',
            }}
            initial={{
              scale: 0.7,
              y: 25,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              y: 0,
              opacity: 1,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
            }}
            transition={{
              type: 'spring',
              damping: 18,
              stiffness: 220,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle background aura */}
            <div
              style={{
                position: 'absolute',

                width: 300,
                height: 300,

                left: '50%',
                top: -140,

                transform: 'translateX(-50%)',

                background:
                  'radial-gradient(circle, rgba(124,58,237,0.13), transparent 70%)',

                pointerEvents: 'none',
              }}
            />

            {/* Top accent line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '12%',
                right: '12%',
                height: 2,

                background:
                  'linear-gradient(90deg, transparent, #8b5cf6, #06b6d4, transparent)',

                opacity: 0.8,
              }}
            />

            {/* Icon */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                rotate: [0, 3, -3, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                width: 76,
                height: 76,

                borderRadius: 20,

                background:
                  'linear-gradient(135deg, #7c3aed, #06b6d4)',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                margin: '0 auto 16px',

                fontSize: 36,

                boxShadow:
                  '0 8px 30px rgba(124,58,237,0.25)',

                border:
                  '1px solid rgba(255,255,255,0.2)',

                position: 'relative',
                zIndex: 1,
              }}
            >
              ⚡
            </motion.div>

            {/* Content */}
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
                delay: 0.2,
              }}
              style={{
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,

                  padding: '5px 14px',

                  borderRadius: 999,

                  background:
                    'rgba(124,58,237,0.10)',

                  border:
                    '1px solid rgba(124,58,237,0.3)',

                  color: 'var(--violet-light)',

                  fontSize: 11,
                  fontWeight: 700,

                  letterSpacing: 2,

                  textTransform: 'uppercase',

                  marginBottom: 12,
                }}
              >
                <Sparkles size={13} />

                LEVEL UP!
              </div>

              {/* Level */}
              <div
                style={{
                  fontFamily: 'Rajdhani, sans-serif',

                  fontSize: 54,

                  fontWeight: 800,

                  background:
                    'linear-gradient(135deg, var(--violet-light), var(--cyan))',

                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',

                  lineHeight: 1,

                  marginBottom: 10,
                }}
              >
                {oldLevel} → {newLevel}
              </div>

              {/* New title */}
              {title && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    gap: 6,

                    color: 'var(--amber)',

                    fontSize: 13,
                    fontWeight: 700,

                    letterSpacing: 1.5,

                    textTransform: 'uppercase',

                    marginBottom: 18,
                  }}
                >
                  <Trophy size={14} />

                  NEW TITLE: {title}
                </div>
              )}

              {/* Rewards */}
              <div
                style={{
                  background:
                    'rgba(255,255,255,0.025)',

                  border:
                    '1px solid rgba(255,255,255,0.07)',

                  borderRadius: 14,

                  padding: '13px 16px',

                  marginBottom: 20,

                  display: 'flex',

                  alignItems: 'center',

                  justifyContent: 'space-around',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      marginBottom: 3,
                    }}
                  >
                    Stats
                  </div>

                  <div
                    style={{
                      fontWeight: 700,
                      color: 'var(--green-light)',
                      fontSize: 13,
                    }}
                  >
                    +1 All Stats
                  </div>
                </div>

                <div
                  style={{
                    width: 1,
                    height: 26,
                    background: 'var(--border)',
                  }}
                />

                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      marginBottom: 3,
                    }}
                  >
                    Skill Point
                  </div>

                  <div
                    style={{
                      fontWeight: 700,
                      color: 'var(--cyan)',
                      fontSize: 13,
                    }}
                  >
                    +1 Unlocked
                  </div>
                </div>
              </div>

              {/* Message */}
              <p
                style={{
                  color: 'var(--text-secondary)',

                  fontSize: 14,

                  marginBottom: 22,

                  lineHeight: 1.5,
                }}
              >
                {message}
              </p>

              {/* Continue */}
              <button
                onClick={onClose}
                className="btn btn-primary"
                style={{
                  width: '100%',

                  paddingTop: 13,
                  paddingBottom: 13,

                  fontSize: 14,

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                }}
              >
                Claim Rewards & Continue

                <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpModal;