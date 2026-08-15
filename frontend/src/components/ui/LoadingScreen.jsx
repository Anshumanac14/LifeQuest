import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
  }}>
    {/* Logo */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center' }}
    >
      <div style={{
        width: 64,
        height: 64,
        background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 32,
        margin: '0 auto 12px',
        boxShadow: 'var(--shadow-violet)',
      }}>
        ⚔️
      </div>
      <div style={{
        fontFamily: 'Rajdhani, sans-serif',
        fontSize: 28,
        fontWeight: 700,
        background: 'linear-gradient(135deg, var(--violet-light), var(--cyan))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: 2,
      }}>
        LIFEQUEST
      </div>
    </motion.div>

    {/* Spinner */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{
        width: 32,
        height: 32,
        border: '3px solid rgba(124, 58, 237, 0.2)',
        borderTop: '3px solid var(--violet)',
        borderRadius: '50%',
      }}
    />

    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading your adventure...</p>
  </div>
);

export default LoadingScreen;
