const HabitCompletion = require('../models/HabitCompletion');
const Habit = require('../models/Habit');
const User = require('../models/User');

// @desc  Get analytics data
// @route GET /api/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Last 30 days data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Daily completions for last 30 days
    const dailyCompletions = await HabitCompletion.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: thirtyDaysAgo },
          completed: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date',
            },
          },
          count: { $sum: 1 },
          xpEarned: { $sum: '$xpEarned' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // XP by category
    const xpByCategory = await HabitCompletion.aggregate([
      {
        $match: {
          userId: user._id,
          completed: true,
        },
      },
      {
        $lookup: {
          from: 'habits',
          localField: 'habitId',
          foreignField: '_id',
          as: 'habit',
        },
      },
      {
        $unwind: '$habit',
      },
      {
        $group: {
          _id: '$habit.category',
          totalXp: { $sum: '$xpEarned' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { totalXp: -1 },
      },
    ]);

    // Habit performance (strongest/weakest)
    const habitPerformance = await HabitCompletion.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: thirtyDaysAgo },
          completed: true,
        },
      },
      {
        $group: {
          _id: '$habitId',
          completions: { $sum: 1 },
          xpEarned: { $sum: '$xpEarned' },
        },
      },
      {
        $lookup: {
          from: 'habits',
          localField: '_id',
          foreignField: '_id',
          as: 'habit',
        },
      },

      // FIXED:
      // preserveNullAndEmptyArrays is the correct MongoDB option
      {
        $unwind: {
          path: '$habit',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $sort: {
          completions: -1,
        },
      },
    ]);

    // Weekly consistency
    const weeklyData = await HabitCompletion.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: thirtyDaysAgo },
          completed: true,
        },
      },
      {
        $group: {
          _id: {
            $dayOfWeek: '$date',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // Generate insights
    const insights = generateInsights(
      user,
      dailyCompletions,
      habitPerformance,
      weeklyData
    );

    res.json({
      success: true,
      analytics: {
        user: {
          level: user.level,
          totalXp: user.totalXp,
          currentStreak: user.currentStreak,
          bestStreak: user.bestStreak,
          consistency: user.consistency,
          totalCompletions: user.totalCompletions,
        },

        dailyCompletions,

        xpByCategory,

        habitPerformance: habitPerformance.slice(0, 10),

        weeklyData,

        insights,

        strongestHabit: habitPerformance[0] || null,

        weakestHabit:
          habitPerformance[habitPerformance.length - 1] || null,
      },
    });
  } catch (error) {
    next(error);
  }
};


// Generate deterministic insights from data
const generateInsights = (
  user,
  dailyCompletions,
  habitPerformance,
  weeklyData
) => {
  const insights = [];

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Streak insight
  if (user.currentStreak >= 7) {
    insights.push({
      type: 'positive',
      icon: '🔥',
      text: `You're on a ${user.currentStreak}-day streak! You're building powerful momentum.`,
    });
  }

  // Consistency insight
  if (user.consistency >= 80) {
    insights.push({
      type: 'positive',
      icon: '💪',
      text: `Your ${user.consistency}% consistency puts you in the top tier of habit builders.`,
    });
  } else if (user.consistency > 0) {
    insights.push({
      type: 'info',
      icon: '📊',
      text: `Your current consistency is ${user.consistency}%. Aim for 80%+ to build unbreakable habits.`,
    });
  }

  // Weakest day of week
  if (weeklyData.length > 1) {
    const sorted = [...weeklyData].sort(
      (a, b) => a.count - b.count
    );

    const weakestDay = sorted[0];

    const dayIndex = weakestDay._id - 1;

    insights.push({
      type: 'warning',
      icon: '📅',
      text: `You tend to complete fewer habits on ${
        dayNames[dayIndex < 0 ? 0 : dayIndex]
      }. Consider planning lighter goals for that day.`,
    });
  }

  // Recent trend
  if (dailyCompletions.length >= 7) {
    const recent7 = dailyCompletions.slice(-7);

    const prev7 = dailyCompletions.slice(-14, -7);

    const recentAvg =
      recent7.reduce((s, d) => s + d.count, 0) / 7;

    const prevAvg =
      prev7.length > 0
        ? prev7.reduce((s, d) => s + d.count, 0) /
          prev7.length
        : recentAvg;

    const diff = Math.round(
      ((recentAvg - prevAvg) /
        Math.max(prevAvg, 1)) *
        100
    );

    if (diff > 10) {
      insights.push({
        type: 'positive',
        icon: '📈',
        text: `Your habit completion improved by ${diff}% this week compared to last week. Excellent progress!`,
      });
    } else if (diff < -10) {
      insights.push({
        type: 'warning',
        icon: '📉',
        text: `Habit completion dropped ${Math.abs(
          diff
        )}% this week. Consider reducing difficulty temporarily.`,
      });
    }
  }

  // Default insight
  if (insights.length === 0) {
    insights.push({
      type: 'info',
      icon: '🌱',
      text: 'Complete more habits to unlock personalized insights about your progress.',
    });
  }

  return insights;
};

module.exports = {
  getAnalytics,
};