const User = require('../models/User');
const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');
const Quest = require('../models/Quest');
const Achievement = require('../models/Achievement');
const { calculateLevel, calculateCurrentLevelXp, xpForNextLevel, getTitleForLevel } = require('../services/xpService');
const { checkRecoveryMode, getToday } = require('../services/streakService');
const { generateDailyQuests, generateWeeklyBoss } = require('../services/questService');
const { checkAchievements, getAllAchievements } = require('../services/achievementService');

// @desc  Get dashboard data
// @route GET /api/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const today = getToday();

    // Get active habits
    const habits = await Habit.find({ userId, active: true }).sort({ order: 1, createdAt: 1 });

    // Get today's completions
    const todayCompletions = await HabitCompletion.find({
      userId,
      date: today,
      completed: true,
    }).populate('habitId');

    // Generate/get daily quests
    await generateDailyQuests(userId, habits);

    // Get today's quests
    const todayEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1);
    const dailyQuests = await Quest.find({
      userId,
      type: { $in: ['daily', 'bonus'] },
      startDate: { $gte: today },
      endDate: { $lte: todayEnd },
    });

    // Update quest completion status based on today's completions
    const completedHabitIds = todayCompletions.map(c => c.habitId?._id?.toString() || c.habitId?.toString());

    for (const quest of dailyQuests) {
      if (quest.type === 'daily' && quest.habitId) {
        const isCompleted = completedHabitIds.includes(quest.habitId.toString());
        if (isCompleted !== quest.completed) {
          quest.completed = isCompleted;
          if (isCompleted) quest.completedAt = new Date();
          await quest.save();
        }
      } else if (quest.type === 'bonus') {
        const completedCount = dailyQuests.filter(q => q.type === 'daily' && q.completed).length;
        quest.progress = completedCount;
        if (completedCount >= quest.target && !quest.completed) {
          quest.completed = true;
          quest.completedAt = new Date();
        }
        await quest.save();
      }
    }

    // Get weekly boss
    const weeklyBoss = await generateWeeklyBoss(userId);

    // Get recent achievements
    const userAchievements = await Achievement.find({ userId }).sort({ unlockedAt: -1 }).limit(5);
    const allAchievementDefs = getAllAchievements();
    const unlockedIds = new Set(userAchievements.map(a => a.achievementId));

    const recentAchievements = userAchievements.map(ua => {
      const def = allAchievementDefs.find(a => a.id === ua.achievementId);
      return def ? { ...def, unlockedAt: ua.unlockedAt } : null;
    }).filter(Boolean);

    // XP info
    const currentLevelXp = calculateCurrentLevelXp(user.totalXp, user.level);
    const nextLevelXp = xpForNextLevel(user.level);

    // Recovery check
    const inRecovery = checkRecoveryMode(user);
    if (inRecovery && !user.recoveryMode) {
      await User.findByIdAndUpdate(userId, { recoveryMode: true });
    }

    res.json({
      success: true,
      dashboard: {
        user: {
          _id: user._id,
          name: user.name,
          level: user.level,
          title: user.title,
          xp: currentLevelXp,
          nextLevelXp,
          totalXp: user.totalXp,
          stats: user.stats,
          currentStreak: user.currentStreak,
          bestStreak: user.bestStreak,
          consistency: user.consistency,
          totalCompletions: user.totalCompletions,
          recoveryMode: inRecovery,
        },
        habits,
        todayCompletions,
        dailyQuests,
        weeklyBoss,
        recentAchievements,
        stats: {
          todayCompleted: todayCompletions.length,
          todayTotal: habits.length,
          weekProgress: Math.round((todayCompletions.length / Math.max(habits.length, 1)) * 100),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
