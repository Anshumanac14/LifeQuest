const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');
const User = require('../models/User');
const Quest = require('../models/Quest');
const Achievement = require('../models/Achievement');
const { calculateLevel, calculateCurrentLevelXp, xpForNextLevel, getTitleForLevel, getStatIncrease } = require('../services/xpService');
const { updateHabitStreak, calculateConsistency, getToday } = require('../services/streakService');
const { checkAchievements } = require('../services/achievementService');

// @desc  Get all habits for user
// @route GET /api/habits
const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ userId: req.user._id, active: true }).sort({ order: 1, createdAt: 1 });
    
    // Get today's completions
    const today = getToday();
    const todayCompletions = await HabitCompletion.find({
      userId: req.user._id,
      date: today,
      completed: true,
    });
    
    const completedHabitIds = new Set(todayCompletions.map(c => c.habitId.toString()));
    
    const habitsWithStatus = habits.map(h => ({
      ...h.toObject(),
      completedToday: completedHabitIds.has(h._id.toString()),
      completion: todayCompletions.find(c => c.habitId.toString() === h._id.toString()),
    }));
    
    res.json({ success: true, habits: habitsWithStatus });
  } catch (error) {
    next(error);
  }
};

// @desc  Create habit
// @route POST /api/habits
const createHabit = async (req, res, next) => {
  try {
    const { name, category, difficulty, frequency, target, minimumTarget, stat, xpReward, minimumXpReward, icon, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Habit name is required' });
    }

    // Calculate XP if not provided
    const BASE_XP = { Health: 25, Fitness: 30, Learning: 35, Career: 30, Mind: 25, Personal: 20, Social: 20, Custom: 20 };
    const XP_MULT = { Easy: 1.0, Medium: 1.5, Hard: 2.0, Epic: 3.0 };
    const base = BASE_XP[category] || 20;
    const mult = XP_MULT[difficulty] || 1.5;
    const calculatedXp = xpReward || Math.floor(base * mult);
    const calculatedMinXp = minimumXpReward || Math.floor(calculatedXp * 0.5);

    const habit = await Habit.create({
      userId: req.user._id,
      name,
      category: category || 'Personal',
      difficulty: difficulty || 'Medium',
      frequency: frequency || 'daily',
      target: target || '',
      minimumTarget: minimumTarget || '',
      stat: stat || 'none',
      xpReward: calculatedXp,
      minimumXpReward: calculatedMinXp,
      icon: icon || '⚡',
      description: description || '',
    });

    res.status(201).json({ success: true, message: 'Habit created!', habit });
  } catch (error) {
    next(error);
  }
};

// @desc  Update habit
// @route PUT /api/habits/:id
const updateHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const allowedFields = ['name', 'category', 'difficulty', 'frequency', 'target', 'minimumTarget', 'stat', 'xpReward', 'minimumXpReward', 'icon', 'description', 'paused', 'order'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        habit[field] = req.body[field];
      }
    });

    await habit.save();
    res.json({ success: true, message: 'Habit updated!', habit });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete habit
// @route DELETE /api/habits/:id
const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    // Soft delete
    habit.active = false;
    await habit.save();

    res.json({ success: true, message: 'Habit removed!' });
  } catch (error) {
    next(error);
  }
};

// @desc  Complete a habit
// @route POST /api/habits/:id/complete
const completeHabit = async (req, res, next) => {
  try {
    const { isMinimum = false } = req.body;
    const userId = req.user._id;
    const today = getToday();

    const habit = await Habit.findOne({ _id: req.params.id, userId, active: true });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    // Check if already completed today
    const existingCompletion = await HabitCompletion.findOne({ userId, habitId: habit._id, date: today });
    if (existingCompletion) {
      return res.status(400).json({ success: false, message: 'Habit already completed today!' });
    }

    const xpEarned = isMinimum ? habit.minimumXpReward : habit.xpReward;
    const statIncrease = habit.stat !== 'none' ? getStatIncrease(habit.stat, habit.difficulty) : 0;

    // Create completion record
    await HabitCompletion.create({
      userId,
      habitId: habit._id,
      date: today,
      completed: true,
      isMinimumCompletion: isMinimum,
      xpEarned,
      statIncreased: habit.stat !== 'none' ? habit.stat : null,
    });

    // Update habit streak
    const { currentStreak, bestStreak } = await updateHabitStreak(habit, today);
    habit.currentStreak = currentStreak;
    habit.bestStreak = bestStreak;
    habit.totalCompletions += 1;
    habit.lastCompleted = new Date();
    await habit.save();

    // Update user XP and stats
    const user = await User.findById(userId);
    const oldLevel = user.level;
    const oldTotalXp = user.totalXp;

    user.totalXp += xpEarned;
    user.xp += xpEarned;
    user.totalCompletions += 1;
    user.lastActiveDate = new Date();
    user.recoveryMode = false;

    // Update stat
    if (habit.stat !== 'none' && statIncrease > 0) {
      user.stats[habit.stat] = Math.min(100, (user.stats[habit.stat] || 1) + statIncrease);
    }

    // Calculate new level
    const newLevel = calculateLevel(user.totalXp);
    user.level = newLevel;
    user.title = getTitleForLevel(newLevel);

    // Update user streak
    const lastActiveDate = user.lastActiveDate;
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastActiveMidnight = lastActiveDate
      ? new Date(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate())
      : null;

    if (!lastActiveMidnight || lastActiveMidnight.getTime() < today.getTime()) {
      const diffDays = lastActiveMidnight
        ? Math.floor((today.getTime() - lastActiveMidnight.getTime()) / (24 * 60 * 60 * 1000))
        : null;

      if (!lastActiveMidnight) {
        user.currentStreak = 1;
      } else if (diffDays === 1) {
        user.currentStreak += 1;
      } else if (diffDays > 1) {
        user.currentStreak = 1;
      }

      user.bestStreak = Math.max(user.currentStreak, user.bestStreak);
    }

    // Calculate consistency
    user.consistency = await calculateConsistency(userId);
    await user.save();

    // Update weekly boss HP
    const { getWeekStart } = require('../services/questService');
    const weekStart = getWeekStart();
    const weeklyBoss = await Quest.findOne({ userId, type: 'boss', startDate: { $gte: weekStart } });
    if (weeklyBoss && !weeklyBoss.completed) {
      weeklyBoss.progress = Math.min(weeklyBoss.target, weeklyBoss.progress + xpEarned);
      if (weeklyBoss.progress >= weeklyBoss.target) {
        weeklyBoss.completed = true;
        weeklyBoss.completedAt = new Date();
        // Award boss defeat XP
        await User.findByIdAndUpdate(userId, { $inc: { totalXp: 500, xp: 500 } });
      }
      await weeklyBoss.save();
    }

    // Check achievements
    const HabitCompletionModel = require('../models/HabitCompletion');
    const categoryCompletions = {};
    const catAggregation = await HabitCompletionModel.aggregate([
      { $match: { userId: user._id, completed: true } },
      { $lookup: { from: 'habits', localField: 'habitId', foreignField: '_id', as: 'habit' } },
      { $unwind: '$habit' },
      { $group: { _id: '$habit.category', count: { $sum: 1 } } },
    ]);
    catAggregation.forEach(c => { categoryCompletions[c._id] = c.count; });

    const bossesDefeated = await Quest.countDocuments({ userId, type: 'boss', completed: true });
    const achievementsToCheck = await checkAchievements(user, categoryCompletions, bossesDefeated, user.recoveryTokens);

    const existingAchievements = await Achievement.find({ userId }).select('achievementId');
    const existingIds = new Set(existingAchievements.map(a => a.achievementId));

    const newAchievements = [];
    for (const achId of achievementsToCheck) {
      if (!existingIds.has(achId)) {
        await Achievement.create({ userId, achievementId: achId });
        newAchievements.push(achId);
      }
    }

    const leveledUp = newLevel > oldLevel;
    const currentLevelXp = calculateCurrentLevelXp(user.totalXp, newLevel);
    const nextLevelXp = xpForNextLevel(newLevel);

    res.json({
      success: true,
      message: isMinimum ? `Minimum completed! +${xpEarned} XP` : `Quest complete! +${xpEarned} XP`,
      xpEarned,
      leveledUp,
      oldLevel,
      newLevel,
      currentLevelXp,
      nextLevelXp,
      newAchievements,
      statIncreased: habit.stat !== 'none' ? { stat: habit.stat, amount: statIncrease } : null,
      user: {
        level: user.level,
        title: user.title,
        totalXp: user.totalXp,
        xp: currentLevelXp,
        nextLevelXp,
        stats: user.stats,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        consistency: user.consistency,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHabits, createHabit, updateHabit, deleteHabit, completeHabit };
