/**
 * Achievement Service
 * Defines all achievements and checks unlocking conditions
 */

const ACHIEVEMENTS = [
  {
    id: 'first_flame',
    name: 'First Flame',
    description: 'Complete your very first habit.',
    icon: '🔥',
    rarity: 'common',
    condition: (stats) => stats.totalCompletions >= 1,
  },
  {
    id: 'seven_days',
    name: 'Seven Days Strong',
    description: 'Maintain a 7-day streak.',
    icon: '🗓️',
    rarity: 'common',
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'two_weeks',
    name: 'Fortnight Warrior',
    description: 'Maintain a 14-day streak.',
    icon: '⚔️',
    rarity: 'uncommon',
    condition: (stats) => stats.currentStreak >= 14,
  },
  {
    id: 'thirty_days',
    name: 'Unstoppable',
    description: 'Reach a 30-day streak.',
    icon: '💎',
    rarity: 'rare',
    condition: (stats) => stats.currentStreak >= 30,
  },
  {
    id: 'hundred_days',
    name: 'Century Legend',
    description: 'Reach a 100-day streak.',
    icon: '👑',
    rarity: 'legendary',
    condition: (stats) => stats.currentStreak >= 100,
  },
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5.',
    icon: '⭐',
    rarity: 'common',
    condition: (stats) => stats.level >= 5,
  },
  {
    id: 'level_10',
    name: 'Level 10',
    description: 'Reach level 10.',
    icon: '🌟',
    rarity: 'uncommon',
    condition: (stats) => stats.level >= 10,
  },
  {
    id: 'level_25',
    name: 'Quarter Century',
    description: 'Reach level 25.',
    icon: '💫',
    rarity: 'rare',
    condition: (stats) => stats.level >= 25,
  },
  {
    id: 'level_50',
    name: 'Half Century Master',
    description: 'Reach level 50.',
    icon: '🏆',
    rarity: 'legendary',
    condition: (stats) => stats.level >= 50,
  },
  {
    id: 'ten_completions',
    name: 'Getting Started',
    description: 'Complete 10 habits total.',
    icon: '✅',
    rarity: 'common',
    condition: (stats) => stats.totalCompletions >= 10,
  },
  {
    id: 'fifty_completions',
    name: 'Habit Machine',
    description: 'Complete 50 habits total.',
    icon: '⚙️',
    rarity: 'uncommon',
    condition: (stats) => stats.totalCompletions >= 50,
  },
  {
    id: 'hundred_completions',
    name: 'Centurion',
    description: 'Complete 100 habits total.',
    icon: '🛡️',
    rarity: 'rare',
    condition: (stats) => stats.totalCompletions >= 100,
  },
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 50 learning habits.',
    icon: '📚',
    rarity: 'uncommon',
    condition: (stats) => (stats.categoryCompletions?.Learning || 0) >= 50,
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    description: 'Complete 50 fitness habits.',
    icon: '💪',
    rarity: 'uncommon',
    condition: (stats) => (stats.categoryCompletions?.Fitness || 0) >= 50,
  },
  {
    id: 'mindfulness',
    name: 'Inner Peace',
    description: 'Complete 30 mind habits.',
    icon: '🧘',
    rarity: 'uncommon',
    condition: (stats) => (stats.categoryCompletions?.Mind || 0) >= 30,
  },
  {
    id: 'consistency_80',
    name: 'Rock Solid',
    description: 'Achieve 80% consistency.',
    icon: '🪨',
    rarity: 'rare',
    condition: (stats) => stats.consistency >= 80,
  },
  {
    id: 'boss_slayer',
    name: 'Boss Slayer',
    description: 'Defeat your first weekly boss.',
    icon: '⚡',
    rarity: 'uncommon',
    condition: (stats) => (stats.bossesDefeated || 0) >= 1,
  },
  {
    id: 'boss_master',
    name: 'Boss Master',
    description: 'Defeat 5 weekly bosses.',
    icon: '🗡️',
    rarity: 'rare',
    condition: (stats) => (stats.bossesDefeated || 0) >= 5,
  },
  {
    id: 'recovery_champion',
    name: 'Comeback Kid',
    description: 'Return after missing 3+ days.',
    icon: '🌅',
    rarity: 'uncommon',
    condition: (stats) => (stats.recoveryCount || 0) >= 1,
  },
];

// Get all achievement definitions
const getAllAchievements = () => ACHIEVEMENTS;

// Get achievement by ID
const getAchievementById = (id) => ACHIEVEMENTS.find(a => a.id === id);

// Check which achievements a user should unlock
const checkAchievements = async (user, categoryCompletions = {}, bossesDefeated = 0, recoveryCount = 0) => {
  const stats = {
    level: user.level,
    currentStreak: user.currentStreak,
    bestStreak: user.bestStreak,
    totalCompletions: user.totalCompletions,
    consistency: user.consistency,
    categoryCompletions,
    bossesDefeated,
    recoveryCount,
  };

  const achievementsToUnlock = [];
  for (const achievement of ACHIEVEMENTS) {
    if (achievement.condition(stats)) {
      achievementsToUnlock.push(achievement.id);
    }
  }
  return achievementsToUnlock;
};

module.exports = { ACHIEVEMENTS, getAllAchievements, getAchievementById, checkAchievements };
