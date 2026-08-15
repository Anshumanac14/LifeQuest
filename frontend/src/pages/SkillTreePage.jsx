import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { TreePine, Lock, CheckCircle, Zap } from 'lucide-react';
import Modal from '../components/ui/Modal';

const SKILLS_DATA = [
  {
    id: 'discipline',
    name: 'Discipline',
    category: 'Root',
    description: 'The foundation of all achievement. Master your mind to gain control over daily actions.',
    reqLevel: 1,
    reqStat: { stat: 'discipline', value: 1 },
    icon: '🔱',
    parentId: null,
  },
  {
    id: 'focus',
    name: 'Focus',
    category: 'Mental',
    description: 'Enhances cognitive stamina and concentration during study and deep work sessions.',
    reqLevel: 3,
    reqStat: { stat: 'focus', value: 5 },
    icon: '🎯',
    parentId: 'discipline',
  },
  {
    id: 'deep_work',
    name: 'Deep Work Mastery',
    category: 'Mental',
    description: 'Unlocks 2x XP for learning habits completed for 60+ minutes uninterrupted.',
    reqLevel: 10,
    reqStat: { stat: 'intelligence', value: 15 },
    icon: '🧠',
    parentId: 'focus',
  },
  {
    id: 'routine',
    name: 'Routine',
    category: 'Consistency',
    description: 'Reduces XP loss when missing a single habit and provides habit stacking bonus.',
    reqLevel: 3,
    reqStat: { stat: 'discipline', value: 5 },
    icon: '⚙️',
    parentId: 'discipline',
  },
  {
    id: 'habit_master',
    name: 'Habit Master',
    category: 'Consistency',
    description: 'Unlocks 1.5x streak multiplier for consecutive completions across 14+ days.',
    reqLevel: 12,
    reqStat: { stat: 'discipline', value: 20 },
    icon: '👑',
    parentId: 'routine',
  },
  {
    id: 'resilience',
    name: 'Resilience',
    category: 'Recovery',
    description: 'Protects streaks after a single day break and boosts recovery mode gains.',
    reqLevel: 5,
    reqStat: { stat: 'recovery', value: 8 },
    icon: '🛡️',
    parentId: 'discipline',
  },
  {
    id: 'recovery',
    name: 'Quick Recovery',
    category: 'Recovery',
    description: 'Restores lost streak multipliers instantly upon completing recovery quests.',
    reqLevel: 15,
    reqStat: { stat: 'recovery', value: 25 },
    icon: '🌅',
    parentId: 'resilience',
  },
];

const SkillTreePage = () => {
  const { user } = useAuth();
  const [selectedSkill, setSelectedSkill] = useState(null);

  const isUnlocked = (skill) => {
    if (!user) return false;
    const levelMet = user.level >= skill.reqLevel;
    const statVal = user.stats?.[skill.reqStat.stat] || 0;
    const statMet = statVal >= skill.reqStat.value;
    return levelMet && statMet;
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 40 }}>
      {/* Skill Detail Modal */}
      {selectedSkill && (
        <Modal
          isOpen={!!selectedSkill}
          onClose={() => setSelectedSkill(null)}
          title={`Skill: ${selectedSkill.name}`}
        >
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 16,
                background: isUnlocked(selectedSkill) ? 'var(--violet-dim)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isUnlocked(selectedSkill) ? 'var(--violet)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
              }}>
                {selectedSkill.icon}
              </div>
              <div>
                <span className="badge badge-violet">{selectedSkill.category}</span>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{selectedSkill.name}</h3>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              {selectedSkill.description}
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '14px', marginBottom: 20,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                Requirements
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>Level {selectedSkill.reqLevel}+</span>
                <span style={{ color: user?.level >= selectedSkill.reqLevel ? 'var(--green)' : 'var(--red)' }}>
                  {user?.level >= selectedSkill.reqLevel ? '✅ Met' : `Current: ${user?.level}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ textTransform: 'capitalize' }}>{selectedSkill.reqStat.stat} {selectedSkill.reqStat.value}+</span>
                <span style={{ color: (user?.stats?.[selectedSkill.reqStat.stat] || 0) >= selectedSkill.reqStat.value ? 'var(--green)' : 'var(--red)' }}>
                  {(user?.stats?.[selectedSkill.reqStat.stat] || 0) >= selectedSkill.reqStat.value ? '✅ Met' : `Current: ${Math.round(user?.stats?.[selectedSkill.reqStat.stat] || 0)}`}
                </span>
              </div>
            </div>

            <button
              className={`btn ${isUnlocked(selectedSkill) ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', padding: '12px' }}
              onClick={() => setSelectedSkill(null)}
            >
              {isUnlocked(selectedSkill) ? 'Skill Active' : 'Locked (Gain XP & Level Up to Unlock)'}
            </button>
          </div>
        </Modal>
      )}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
          <TreePine color="var(--violet-light)" /> INTERACTIVE SKILL TREE
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Unlock powerful traits and passive perks by leveling up your stats and character.
        </p>
      </div>

      {/* Tree Visualization */}
      <div style={{
        background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
        borderRadius: 24, padding: '40px 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
        boxShadow: 'var(--shadow-glow)', position: 'relative',
      }}>
        {/* Root: Discipline */}
        {SKILLS_DATA.filter(s => s.parentId === null).map(rootSkill => {
          const unlocked = isUnlocked(rootSkill);
          return (
            <motion.div
              key={rootSkill.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedSkill(rootSkill)}
              style={{
                background: unlocked ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))' : 'rgba(255,255,255,0.03)',
                border: `2px solid ${unlocked ? 'var(--violet)' : 'var(--border)'}`,
                borderRadius: 20, padding: '16px 28px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: unlocked ? 'var(--shadow-violet)' : 'none',
                zIndex: 2,
              }}
            >
              <span style={{ fontSize: 32 }}>{rootSkill.icon}</span>
              <div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 700 }}>{rootSkill.name}</div>
                <div style={{ fontSize: 11, color: unlocked ? 'var(--green-light)' : 'var(--text-muted)', fontWeight: 600 }}>
                  {unlocked ? 'ACTIVE PERK' : `LEVEL ${rootSkill.reqLevel}`}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Level 1 Branch */}
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          {SKILLS_DATA.filter(s => s.parentId === 'discipline').map(branchSkill => {
            const unlocked = isUnlocked(branchSkill);
            const children = SKILLS_DATA.filter(s => s.parentId === branchSkill.id);

            return (
              <div key={branchSkill.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
                {/* Connector line */}
                <div style={{ width: 2, height: 20, background: unlocked ? 'var(--violet)' : 'var(--border)' }} />

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedSkill(branchSkill)}
                  style={{
                    background: unlocked ? 'var(--violet-dim)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${unlocked ? 'var(--violet)' : 'var(--border)'}`,
                    borderRadius: 16, padding: '14px 20px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                    opacity: unlocked ? 1 : 0.6,
                  }}
                >
                  <span style={{ fontSize: 24 }}>{branchSkill.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{branchSkill.name}</div>
                    <div style={{ fontSize: 10, color: unlocked ? 'var(--green-light)' : 'var(--text-muted)' }}>
                      {unlocked ? 'UNLOCKED' : `Lv ${branchSkill.reqLevel}`}
                    </div>
                  </div>
                </motion.div>

                {/* Subchildren */}
                {children.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 2, height: 20, background: unlocked ? 'var(--violet)' : 'var(--border)' }} />
                    {children.map(childSkill => {
                      const childUnlocked = isUnlocked(childSkill);
                      return (
                        <motion.div
                          key={childSkill.id}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setSelectedSkill(childSkill)}
                          style={{
                            background: childUnlocked ? 'var(--cyan-dim)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${childUnlocked ? 'var(--cyan)' : 'var(--border)'}`,
                            borderRadius: 14, padding: '12px 16px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8,
                            opacity: childUnlocked ? 1 : 0.4,
                          }}
                        >
                          <span style={{ fontSize: 20 }}>{childSkill.icon}</span>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{childSkill.name}</div>
                            <div style={{ fontSize: 10, color: childUnlocked ? 'var(--cyan)' : 'var(--text-muted)' }}>
                              {childUnlocked ? 'MASTERED' : `Lv ${childSkill.reqLevel}`}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillTreePage;
