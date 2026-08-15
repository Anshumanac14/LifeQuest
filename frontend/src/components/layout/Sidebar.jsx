import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Sword, Target, User, TreePine, Trophy, BarChart3, Settings, LogOut, Zap
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/quests', icon: Sword, label: 'My Quests' },
  { to: '/habits', icon: Target, label: 'Habits' },
  { to: '/character', icon: User, label: 'Character' },
  { to: '/skill-tree', icon: TreePine, label: 'Skill Tree' },
  { to: '/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // XP progress
  const xpPercent = user ? Math.min(100, Math.round((user.xp / (user.nextLevelXp || 100)) * 100)) : 0;

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'rgba(8, 11, 20, 0.95)',
      borderRight: '1px solid var(--glass-border)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--glass-border)' }}>
        <NavLink to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}>⚔️</div>
          <span style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            background: 'linear-gradient(135deg, var(--violet-light), var(--cyan))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>LIFEQUEST</span>
        </NavLink>
      </div>

      {/* User Level Card */}
      {user && (
        <div style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
            border: '1px solid var(--glass-border)',
            borderRadius: 12,
            padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{user.title}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--violet-light)', lineHeight: 1.1 }}>
                  LEVEL {user.level}
                </div>
              </div>
              <div style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, var(--violet), var(--violet-light))',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>⚡</div>
            </div>
            <div style={{ marginBottom: 4 }}>
              <div className="progress-track">
                <motion.div
                  className="progress-fill progress-violet"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Zap size={9} /> {user.xp?.toLocaleString()} XP
              </span>
              <span>{user.nextLevelXp?.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--violet-light)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
              border: isActive ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid transparent',
              transition: 'all 0.2s ease',
              position: 'relative',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: '60%',
                      background: 'var(--violet)',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--glass-border)' }}>
        {user && (
          <div style={{ padding: '8px 12px', marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            background: 'transparent',
            border: '1px solid transparent',
            color: 'var(--text-muted)',
            fontSize: 14,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
