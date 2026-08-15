/**
 * Quest Service
 * Generates and manages daily/weekly quests and boss battles
 */
const Quest = require('../models/Quest');

// Weekly boss definitions
const WEEKLY_BOSSES = [
  {
    name: 'Procrastination Demon',
    description: 'The ancient enemy of all progress. Defeat it through consistent action.',
    icon: '👾',
    maxHp: 1000,
    color: '#8b5cf6',
  },
  {
    name: 'The Fog of Doubt',
    description: 'It clouds your mind and dulls your motivation. Clear it through knowledge.',
    icon: '🌫️',
    maxHp: 800,
    color: '#6366f1',
  },
  {
    name: 'Entropy Beast',
    description: 'Disorder and chaos given form. Conquer it through discipline.',
    icon: '🌪️',
    maxHp: 1200,
    color: '#ec4899',
  },
  {
    name: 'Comfort Zone Dragon',
    description: 'A dragon born from complacency. Slay it by pushing your limits.',
    icon: '🐉',
    maxHp: 900,
    color: '#f59e0b',
  },
];

// Get today's date at midnight
const getToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Get end of today
const getTodayEnd = () => {
  const today = getToday();
  return new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1);
};

// Get start of current week (Monday)
const getWeekStart = () => {
  const today = getToday();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(today.setDate(diff));
};

// Get end of current week (Sunday)
const getWeekEnd = () => {
  const weekStart = getWeekStart();
  return new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
};

// Generate daily quests from user's active habits
const generateDailyQuests = async (userId, habits) => {
  const today = getToday();
  const todayEnd = getTodayEnd();

  // Check if daily quests already exist for today
  const existingQuests = await Quest.find({
    userId,
    type: 'daily',
    startDate: { $gte: today },
    endDate: { $lte: todayEnd },
  });

  if (existingQuests.length > 0) {
    return existingQuests;
  }

  // Create daily quests from active habits
  const questsToCreate = habits
    .filter(h => h.active && !h.paused)
    .map(habit => ({
      userId,
      type: 'daily',
      title: habit.name,
      description: habit.target ? `Target: ${habit.target}` : '',
      habitId: habit._id,
      target: 1,
      progress: 0,
      reward: habit.xpReward,
      startDate: today,
      endDate: todayEnd,
      completed: false,
      icon: habit.icon || '⚡',
      difficulty: habit.difficulty,
    }));

  if (questsToCreate.length === 0) return [];

  const quests = await Quest.insertMany(questsToCreate);

  // Create daily bonus quest if there are enough habits
  if (habits.filter(h => h.active && !h.paused).length >= 3) {
    await Quest.create({
      userId,
      type: 'bonus',
      title: 'Daily Champion',
      description: 'Complete 3 quests today for a bonus reward!',
      target: 3,
      progress: 0,
      reward: 100,
      startDate: today,
      endDate: todayEnd,
      completed: false,
      icon: '🏆',
      difficulty: 'Hard',
    });
  }

  return quests;
};

// Generate or get current weekly boss
const generateWeeklyBoss = async (userId) => {
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();

  let boss = await Quest.findOne({
    userId,
    type: 'boss',
    startDate: { $gte: weekStart },
  });

  if (!boss) {
    // Pick a boss based on week number
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const bossData = WEEKLY_BOSSES[weekNumber % WEEKLY_BOSSES.length];

    boss = await Quest.create({
      userId,
      type: 'boss',
      title: bossData.name,
      description: bossData.description,
      target: bossData.maxHp,
      progress: 0,
      reward: 500,
      startDate: weekStart,
      endDate: weekEnd,
      completed: false,
      icon: bossData.icon,
      difficulty: 'Boss',
    });
  }

  return boss;
};

module.exports = {
  generateDailyQuests,
  generateWeeklyBoss,
  getToday,
  getTodayEnd,
  getWeekStart,
  getWeekEnd,
  WEEKLY_BOSSES,
};
