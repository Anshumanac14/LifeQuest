import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await login('alex@lifequest.app', 'password123');
      if (res.success) {
        toast.success('Logged in as Alex (Level 24 Warrior)!');
        navigate('/dashboard');
      }
    } catch (err) {
      // If demo account doesn't exist, register demo account!
      try {
        const regRes = await login('alex@lifequest.app', 'password123');
        if (regRes.success) {
          toast.success('Logged in as Alex!');
          navigate('/dashboard');
        }
      } catch {
        toast.error('Demo login failed. Please register a new account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%', maxWidth: 440,
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 24, padding: '40px 32px',
          backdropFilter: 'blur(20px)',
          boxShadow: 'var(--shadow-glow)',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48,
            background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, margin: '0 auto 16px',
            boxShadow: 'var(--shadow-violet)',
          }}>⚔️</div>
          <h1 style={{
            fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 700,
            background: 'linear-gradient(135deg, var(--violet-light), var(--cyan))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            letterSpacing: 2, marginBottom: 6,
          }}>
            WELCOME BACK
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Enter your credentials to continue your journey.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="hero@lifequest.app"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ paddingLeft: 42 }}
                required
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingLeft: 42 }}
                required
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', paddingTop: 14, paddingBottom: 14, marginTop: 8, fontSize: 15 }}
          >
            {loading ? 'Logging in...' : 'Sign In'} <ArrowRight size={16} />
          </motion.button>
        </form>

        <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Quick Demo Login Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="btn btn-secondary"
          style={{ width: '100%', paddingTop: 12, paddingBottom: 12, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Zap size={16} color="var(--amber)" /> Demo Account (Alex - Level 24)
        </button>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginTop: 24 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--violet-light)', fontWeight: 600 }}>
            Start Your Quest
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
