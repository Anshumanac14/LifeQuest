import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Star, Flame, Target, Trophy, ArrowRight, ChevronDown } from 'lucide-react';

// Floating XP particles
const FloatingParticle = ({ x, y, value }) => (
  <div style={{
    position: 'absolute', left: x, top: y,
    fontWeight: 800, fontSize: 14,
    color: '#8b5cf6',
    textShadow: '0 0 10px rgba(124,58,237,0.6)',
    pointerEvents: 'none',
    animation: 'floatUp 2s ease forwards',
    zIndex: 10,
  }}>
    +{value} XP
  </div>
);

const HERO_STATS = [
  { label: 'Active Heroes', value: '12,847', icon: '⚔️' },
  { label: 'Quests Completed', value: '1.2M+', icon: '✅' },
  { label: 'XP Earned', value: '48M+', icon: '⚡' },
];

const FEATURES = [
  {
    icon: '🎯',
    title: 'Habits as Quests',
    description: 'Every habit becomes an adventure. Complete quests, earn XP, and watch your character grow with each action you take.',
    color: '#7c3aed',
  },
  {
    icon: '📊',
    title: 'Character Stats',
    description: 'Your habits shape who you are. Track Strength, Intelligence, Focus, Wisdom, Recovery, and Discipline growing in real time.',
    color: '#06b6d4',
  },
  {
    icon: '🔥',
    title: 'Streak System',
    description: 'Build momentum with daily streaks. The longer you go, the more powerful you become. Consistency is your superpower.',
    color: '#f59e0b',
  },
  {
    icon: '👾',
    title: 'Weekly Bosses',
    description: 'Face epic weekly boss battles. Complete habits to deal damage. Defeat the boss to earn massive XP rewards.',
    color: '#ec4899',
  },
  {
    icon: '🏆',
    title: 'Achievements',
    description: 'Unlock rare achievements as you hit milestones. From "First Flame" to "Century Legend" — every step is celebrated.',
    color: '#10b981',
  },
  {
    icon: '🌅',
    title: 'Recovery Mode',
    description: 'Life happens. If you fall off, Recovery Mode helps you rebuild without shame. Progress, not perfection.',
    color: '#8b5cf6',
  },
];

const RPG_LEVELS = [
  { level: 1, title: 'Novice', xp: '0', color: '#94a3b8' },
  { level: 5, title: 'Apprentice', xp: '740', color: '#10b981' },
  { level: 10, title: 'Journeyman', xp: '2,981', color: '#06b6d4' },
  { level: 20, title: 'Adventurer', xp: '12,303', color: '#6366f1' },
  { level: 30, title: 'Champion', xp: '27,386', color: '#7c3aed' },
  { level: 50, title: 'Master', xp: '72,477', color: '#f59e0b' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (particles.length < 8) {
        setParticles(prev => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight * 0.6),
            value: [10, 25, 40, 50, 100][Math.floor(Math.random() * 5)],
          },
        ]);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [particles]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setParticles(prev => prev.filter(p => Date.now() - p.id < 2500));
    }, 500);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Animated background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 60%)',
          top: -200, left: '50%', transform: 'translateX(-50%)',
          animation: 'backgroundPulse 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 60%)',
          bottom: 0, right: -100,
          animation: 'backgroundPulse 8s ease-in-out infinite reverse',
        }} />
      </div>

      {/* Floating particles */}
      {particles.map(p => (
        <FloatingParticle key={p.id} x={p.x} y={p.y} value={p.value} />
      ))}

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 48px',
        background: 'rgba(8,11,20,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>⚔️</div>
          <span style={{
            fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 700, letterSpacing: 2,
            background: 'linear-gradient(135deg, var(--violet-light), var(--cyan))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>LIFEQUEST</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => navigate('/register')}>Get Started Free</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: 120, paddingBottom: 80, textAlign: 'center', maxWidth: 900, margin: '0 auto', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--violet-dim)', border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 'var(--radius-full)', padding: '6px 16px',
            fontSize: 13, fontWeight: 600, color: 'var(--violet-light)',
            marginBottom: 32,
          }}>
            <Star size={13} fill="currentColor" />
            The #1 Gamified Habit Tracker
            <Star size={13} fill="currentColor" />
          </div>

          {/* Hero title */}
          <h1 style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 'clamp(48px, 8vw, 88px)',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -1,
            marginBottom: 24,
          }}>
            <span style={{ display: 'block', color: 'var(--text-primary)' }}>TURN YOUR LIFE</span>
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, var(--violet-light) 0%, var(--cyan) 50%, var(--green) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>INTO AN RPG.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: 'var(--text-secondary)',
            maxWidth: 560, margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Build habits. Complete quests. Level up.
            <br />
            <strong style={{ color: 'var(--text-primary)' }}>Become the person you want to be.</strong>
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-primary"
              style={{ padding: '16px 32px', fontSize: 16, letterSpacing: '0.05em' }}
              onClick={() => navigate('/register')}
            >
              <Zap size={18} />
              START YOUR JOURNEY
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-secondary"
              style={{ padding: '16px 32px', fontSize: 16, letterSpacing: '0.05em' }}
              onClick={() => navigate('/login')}
            >
              Sign In
              <ArrowRight size={16} />
            </motion.button>
          </div>

          {/* Social proof */}
          <div style={{
            display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap',
            marginTop: 56,
          }}>
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>{stat.icon}</div>
                <div style={{
                  fontFamily: 'Rajdhani, sans-serif', fontSize: 28, fontWeight: 700,
                  background: 'linear-gradient(135deg, var(--violet-light), var(--cyan))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Dashboard Preview */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          {/* Mock browser bar */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <div style={{
              flex: 1, maxWidth: 200, marginLeft: 8,
              background: 'rgba(255,255,255,0.05)', borderRadius: 6,
              padding: '3px 10px', fontSize: 11, color: 'var(--text-muted)',
            }}>
              lifequest.app/dashboard
            </div>
          </div>

          {/* Dashboard mock */}
          <div style={{ padding: '20px', background: 'var(--bg-secondary)' }}>
            {/* Level bar mock */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: 16, padding: '16px 20px', marginBottom: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--violet-light)' }}>LEVEL 24</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>WARRIOR</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--violet-light)' }}>8,420</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ 9,000 XP</div>
                </div>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '93%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--violet), var(--violet-light))', borderRadius: 999 }}
                />
              </div>
            </div>

            {/* Quest cards mock */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[
                { icon: '🧠', name: 'Study DSA', xp: 40, diff: 'Hard', done: true },
                { icon: '💪', name: 'Workout', xp: 50, diff: 'Medium', done: false },
                { icon: '📚', name: 'Reading', xp: 25, diff: 'Easy', done: true },
                { icon: '🌙', name: 'Sleep by 12:30', xp: 30, diff: 'Easy', done: false },
              ].map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  style={{
                    background: q.done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${q.done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 12, padding: '12px',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <div style={{ fontSize: 22 }}>{q.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: q.done ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: q.done ? 'line-through' : 'none', opacity: q.done ? 0.6 : 1 }}>{q.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--violet-light)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Zap size={9} /> +{q.xp} XP
                    </div>
                  </div>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: q.done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${q.done ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: q.done ? 'var(--green)' : 'var(--text-muted)' }}>
                    {q.done ? '✓' : ''}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, marginBottom: 16 }}>
            EVERYTHING YOU NEED TO{' '}
            <span style={{ background: 'linear-gradient(135deg, var(--violet-light), var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              LEVEL UP
            </span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>
            A complete system designed to make self-improvement feel like an adventure.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 16, padding: '24px',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${feature.color}80, transparent)`,
              }} />
              <div style={{
                width: 52, height: 52,
                background: `${feature.color}15`, border: `1px solid ${feature.color}30`,
                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, marginBottom: 16,
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Progression Section */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 100px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, marginBottom: 12 }}>
            YOUR PROGRESSION PATH
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Watch your character evolve with every habit you build.</p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {RPG_LEVELS.map((lvl, i) => (
            <motion.div
              key={lvl.level}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                borderRadius: 12, marginBottom: 8,
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: `${lvl.color}20`, border: `2px solid ${lvl.color}60`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13,
                color: lvl.color,
              }}>
                {lvl.level}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: lvl.color, fontSize: 15 }}>{lvl.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lvl.xp} Total XP</div>
              </div>
              <div style={{ fontSize: 22 }}>{'⭐'.repeat(Math.min(i + 1, 5))}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        maxWidth: 700, margin: '0 auto 80px', padding: '0 24px',
        position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 24, padding: '56px 40px', textAlign: 'center',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, marginBottom: 16 }}>
            READY TO BEGIN YOUR QUEST?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 32, lineHeight: 1.6 }}>
            Join thousands of heroes who are leveling up their lives, one habit at a time.
          </p>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary"
            style={{ padding: '18px 40px', fontSize: 17, letterSpacing: '0.05em' }}
            onClick={() => navigate('/register')}
          >
            <Zap size={20} />
            START YOUR JOURNEY — FREE
          </motion.button>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 16 }}>No credit card required. Start in 60 seconds.</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚔️</span>
          <span style={{
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: 2,
            background: 'linear-gradient(135deg, var(--violet-light), var(--cyan))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>LIFEQUEST</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Level up your life, one habit at a time.
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 16px' }} onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
