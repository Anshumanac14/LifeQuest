/**
 * Streak Service
 * Handles streak calculations and consistency tracking
 */
const HabitCompletion = require('../models/HabitCompletion');
const Habit = require('../models/Habit');

// Get today's date at midnight UTC
const getToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Get yesterday's date
const getYesterday = () => {
  const today = getToday();
  return new Date(today.getTime() - 24 * 60 * 60 * 1000);
};

// Update habit streak after completion
const updateHabitStreak = async (habit, completionDate) => {
  const today = getToday();
  const yesterday = getYesterday();

  const lastCompleted = habit.lastCompleted
    ? new Date(new Date(habit.lastCompleted).getFullYear(), new Date(habit.lastCompleted).getMonth(), new Date(habit.lastCompleted).getDate())
    : null;

  let newStreak = habit.currentStreak;

  if (!lastCompleted) {
    newStreak = 1;
  } else {
    const diffMs = today.getTime() - lastCompleted.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffDays === 0) {
      // Already completed today, no streak change
      newStreak = habit.currentStreak;
    } else if (diffDays === 1) {
      // Consecutive day
      newStreak = habit.currentStreak + 1;
    } else {
      // Streak broken
      newStreak = 1;
    }
  }

  const bestStreak = Math.max(newStreak, habit.bestStreak);

  return { currentStreak: newStreak, bestStreak };
};

// Calculate user consistency based on last 30 days
const calculateConsistency = async (userId) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get active habits count
  const activeHabits = await Habit.countDocuments({ userId, active: true, paused: false });
  if (activeHabits === 0) return 0;

  // Count completions in last 30 days
  const completions = await HabitCompletion.countDocuments({
    userId,
    date: { $gte: thirtyDaysAgo },
    completed: true,
  });

  // Max possible completions = active habits * 30 days
  const maxPossible = activeHabits * 30;
  const consistency = Math.min(100, Math.round((completions / maxPossible) * 100));
  return consistency;
};

// Check if user is in recovery mode (missed 3+ days)
const checkRecoveryMode = (user) => {
  if (!user.lastActiveDate) return false;

  const today = getToday();
  const lastActive = new Date(
    new Date(user.lastActiveDate).getFullYear(),
    new Date(user.lastActiveDate).getMonth(),
    new Date(user.lastActiveDate).getDate()
  );

  const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (24 * 60 * 60 * 1000));
  return diffDays >= 3;
};

module.exports = {
  getToday,
  getYesterday,
  updateHabitStreak,
  calculateConsistency,
  checkRecoveryMode,
};
