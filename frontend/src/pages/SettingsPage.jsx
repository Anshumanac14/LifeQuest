import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Settings, User, Bell, Volume2, Shield, Eye, LogOut, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [settings, setSettings] = useState(user?.settings || {
    theme: 'dark',
    soundEnabled: false,
    reducedMotion: false,
    notifications: true,
  });
  const [saving, setSaving] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/user/profile', { name, settings });
      if (res.data.success) {
        updateUser({ name, settings });
        toast.success('Settings saved successfully!');
      }
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Settings color="var(--violet-light)" /> SYSTEM SETTINGS
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Manage your account, preferences, audio triggers, and accessibility settings.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Profile Card */}
        <div style={{
          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
          borderRadius: 20, padding: '24px',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} color="var(--violet-light)" /> Profile Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Hero Name</label>
              <input
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div style={{
          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
          borderRadius: 20, padding: '24px',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Eye size={18} color="var(--cyan)" /> Accessibility & Audio
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Sound FX */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Sound Effects</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Play subtle audio feedback on quest completion & level up</div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('soundEnabled')}
                style={{
                  width: 48, height: 26, borderRadius: 13,
                  background: settings.soundEnabled ? 'var(--violet)' : 'rgba(255,255,255,0.1)',
                  border: 'none', cursor: 'pointer', position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3,
                  left: settings.soundEnabled ? 25 : 3,
                  transition: 'all 0.2s ease',
                }} />
              </button>
            </div>

            {/* Reduced Motion */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Reduced Motion</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Minimize animations and floating particles for better accessibility</div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('reducedMotion')}
                style={{
                  width: 48, height: 26, borderRadius: 13,
                  background: settings.reducedMotion ? 'var(--violet)' : 'rgba(255,255,255,0.1)',
                  border: 'none', cursor: 'pointer', position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3,
                  left: settings.reducedMotion ? 25 : 3,
                  transition: 'all 0.2s ease',
                }} />
              </button>
            </div>

            {/* Notifications */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Daily Quest Reminders</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Receive notifications to maintain your daily streak</div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('notifications')}
                style={{
                  width: 48, height: 26, borderRadius: 13,
                  background: settings.notifications ? 'var(--violet)' : 'rgba(255,255,255,0.1)',
                  border: 'none', cursor: 'pointer', position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3,
                  left: settings.notifications ? 25 : 3,
                  transition: 'all 0.2s ease',
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '12px 32px' }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
