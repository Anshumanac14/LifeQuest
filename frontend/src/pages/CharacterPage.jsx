import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import StatCard from '../components/dashboard/StatCard';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Shield, Zap, Award, Sparkles, UserCheck, Flame } from 'lucide-react';

const TITLES_UNLOCKS = [
  { level: 1, title: 'Novice', icon: '🌱', unlocked: true },
  { level: 5, title: 'Apprentice', icon: '⭐', unlocked: false },
  { level: 10, title: 'Journeyman', icon: '🌟', unlocked: false },
  { level: 15, title: 'Adventurer', icon: '⚔️', unlocked: false },
  { level: 20, title: 'Warrior', icon: '🛡️', unlocked: false },
  { level: 25, title: 'Champion', icon: '🏆', unlocked: false },
  { level: 30, title: 'Veteran', icon: '💫', unlocked: false },
  { level: 50, title: 'Master', icon: '👑', unlocked: false },
];

const CharacterPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        if (res.data.success) setProfile(res.data.user);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) return <LoadingScreen />;

  const currentLevel = profile?.level || 1;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 40 }}>
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
          border: '1px solid var(--glass-border)',
          borderRadius: 24, padding: '32px 28px', marginBottom: 24,
          boxShadow: 'var(--shadow-glow)', position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {/* Avatar frame */}
          <div style={{
            width: 96, height: 96, borderRadius: 24,
            background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, boxShadow: '0 0 30px rgba(124,58,237,0.4)',
            border: '3px solid rgba(255,255,255,0.2)', flexShrink: 0,
          }}>
            ⚔️
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="badge badge-violet">{profile?.title || 'Novice'}</span>
              <span style={{ fontSize: 12, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Flame size={12} /> {profile?.currentStreak || 0} Day Streak
              </span>
            </div>
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 36, fontWeight: 700, margin: '4px 0 6px' }}>
              {profile?.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Total XP Earned: <strong style={{ color: 'var(--violet-light)' }}>{profile?.totalXp?.toLocaleString()} XP</strong>
            </p>
          </div>

          {/* Big level badge */}
          <div style={{
            background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)',
            borderRadius: 16, padding: '16px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>LEVEL</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 44, fontWeight: 700, color: 'var(--violet-light)', lineHeight: 1 }}>
              {currentLevel}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid: Stats & Titles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Character Attributes */}
        <div style={{
          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
          borderRadius: 20, padding: '24px',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} color="var(--violet-light)" /> Attribute Scores
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {Object.entries(profile?.stats || {}).map(([sName, val], idx) => (
              <StatCard key={sName} statName={sName} value={val} index={idx} />
            ))}
          </div>
        </div>

        {/* Titles & Progression */}
        <div style={{
          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
          borderRadius: 20, padding: '24px',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={18} color="var(--amber)" /> Earned Titles
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TITLES_UNLOCKS.map(t => {
              const isUnlocked = currentLevel >= t.level;
              return (
                <div
                  key={t.title}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 12,
                    background: isUnlocked ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isUnlocked ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    opacity: isUnlocked ? 1 : 0.4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {t.title}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: isUnlocked ? 'var(--green-light)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {isUnlocked ? 'UNLOCKED' : `Req. Lv ${t.level}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
