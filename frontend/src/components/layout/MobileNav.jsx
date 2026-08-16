import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sword,
  Target,
  User,
  Trophy,
  BarChart3,
  GitBranch,
  Settings,
} from 'lucide-react';

const mobileNavItems = [
  {
    to: '/dashboard',
    icon: LayoutDashboard,
    label: 'Home',
  },
  {
    to: '/quests',
    icon: Sword,
    label: 'Quests',
  },
  {
    to: '/habits',
    icon: Target,
    label: 'Habits',
  },
  {
    to: '/character',
    icon: User,
    label: 'Character',
  },
  {
    to: '/skill-tree',
    icon: GitBranch,
    label: 'Skills',
  },
  {
    to: '/achievements',
    icon: Trophy,
    label: 'Achieve',
  },
  {
    to: '/analytics',
    icon: BarChart3,
    label: 'Analytics',
  },
  {
    to: '/settings',
    icon: Settings,
    label: 'Settings',
  },
];

const MobileNav = () => {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,

        background: 'rgba(8, 11, 20, 0.96)',

        borderTop:
          '1px solid var(--glass-border)',

        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',

        display: 'flex',

        zIndex: 100,

        padding: '7px 4px',

        paddingBottom:
          'calc(7px + env(safe-area-inset-bottom))',

        overflowX: 'auto',
        overflowY: 'hidden',

        scrollbarWidth: 'none',

        WebkitOverflowScrolling: 'touch',
      }}
    >

      {mobileNavItems.map(
        ({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              flex: '0 0 72px',

              minWidth: '72px',

              display: 'flex',

              flexDirection: 'column',

              alignItems: 'center',

              justifyContent: 'center',

              gap: 3,

              padding: '5px 3px',

              textDecoration: 'none',

              color: isActive
                ? 'var(--violet-light)'
                : 'var(--text-muted)',

              fontSize: 10,

              fontWeight: isActive
                ? 600
                : 400,

              transition:
                'all 0.2s ease',

              WebkitTapHighlightColor:
                'transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <div
                  style={{
                    width: 38,
                    height: 28,

                    display: 'flex',

                    alignItems: 'center',

                    justifyContent:
                      'center',

                    borderRadius: 8,

                    background: isActive
                      ? 'rgba(124, 58, 237, 0.15)'
                      : 'transparent',

                    border: isActive
                      ? '1px solid rgba(124, 58, 237, 0.2)'
                      : '1px solid transparent',

                    transition:
                      'all 0.2s ease',

                    boxShadow: isActive
                      ? '0 0 12px rgba(124, 58, 237, 0.12)'
                      : 'none',
                  }}
                >
                  <Icon size={18} />
                </div>

                <span
                  style={{
                    whiteSpace: 'nowrap',
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        )
      )}
    </nav>
  );
};

export default MobileNav;