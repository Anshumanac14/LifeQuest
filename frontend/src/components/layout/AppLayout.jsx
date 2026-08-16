import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useEffect, useState } from 'react';

const AppLayout = () => {
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="app-layout">

      {/* =====================================================
          BACKGROUND EFFECTS
          ===================================================== */}

      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Violet glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)',
            top: -200,
            right: -100,
            animation:
              'backgroundPulse 8s ease-in-out infinite',
          }}
        />

        {/* Cyan glow */}
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(6,182,212,0.03) 0%, transparent 70%)',
            bottom: 100,
            left: 200,
            animation:
              'backgroundPulse 12s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* =====================================================
          DESKTOP SIDEBAR
          ===================================================== */}

      {!isMobile && <Sidebar />}

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main
        className="main-content"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          key={location.pathname}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.25,
          }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* =====================================================
          MOBILE NAVIGATION
          ===================================================== */}

      {isMobile && <MobileNav />}

    </div>
  );
};

export default AppLayout;