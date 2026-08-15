import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sword, Target, User, Trophy, BarChart3 } from 'lucide-react';

const mobileNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/quests', icon: Sword, label: 'Quests' },
  { to: '/habits', icon: Target, label: 'Habits' },
  { to: '/character', icon: User, label: 'Character' },
  { to: '/achievements', icon: Trophy, label: 'Achieve' },
];

const MobileNav = () => (
  <nav style={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(8, 11, 20, 0.95)',
    borderTop: '1px solid var(--glass-border)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    zIndex: 100,
    padding: '8px 0',
    paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
  }}>
    {mobileNavItems.map(({ to, icon: Icon, label }) => (
      <NavLink
        key={to}
        to={to}
        style={({ isActive }) => ({
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          padding: '6px 4px',
          textDecoration: 'none',
          color: isActive ? 'var(--violet-light)' : 'var(--text-muted)',
          fontSize: 10,
          fontWeight: isActive ? 600 : 400,
          transition: 'all 0.2s ease',
        })}
      >
        {({ isActive }) => (
          <>
            <div style={{
              width: 36,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
              transition: 'all 0.2s ease',
            }}>
              <Icon size={18} />
            </div>
            <span>{label}</span>
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

export default MobileNav;
