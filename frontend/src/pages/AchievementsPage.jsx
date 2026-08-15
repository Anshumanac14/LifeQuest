import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import AchievementCard from '../components/achievements/AchievementCard';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Trophy, Star, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const AchievementsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unlocked, locked

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await api.get('/achievements');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        toast.error('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (loading) return <LoadingScreen />;

  const achievements = data?.achievements || [];
  const total = data?.stats?.total || achievements.length;
  const unlockedCount = data?.stats?.unlocked || achievements.filter(a => a.unlocked).length;
  const percent = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 40 }}>
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(124,58,237,0.1))',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 20, padding: '24px 28px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Trophy color="var(--amber)" /> HALL OF ACHIEVEMENTS
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Track your milestones, epic feats, and habit consistency medals.
          </p>
        </div>

        {/* Progress badge */}
        <div style={{
          background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '12px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Unlocked</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--amber)' }}>
            {unlockedCount} / {total} ({percent}%)
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['all', 'unlocked', 'locked'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', textTransform: 'capitalize', border: '1px solid',
              background: filter === tab ? 'var(--violet-dim)' : 'transparent',
              borderColor: filter === tab ? 'var(--violet)' : 'var(--border)',
              color: filter === tab ? 'var(--violet-light)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            {tab} ({tab === 'all' ? total : tab === 'unlocked' ? unlockedCount : total - unlockedCount})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filteredAchievements.map((ach, idx) => (
          <AchievementCard key={ach.id} achievement={ach} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
