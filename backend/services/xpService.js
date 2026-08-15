/**
 * XP and Level Service
 * Handles all XP calculations, level progression, and stat increases
 */

// Level thresholds - progressively increasing XP requirements
const XP_PER_LEVEL = (level) => {
  // Base XP needed: 100 * level^1.5 (scaled for engaging progression)
  return Math.floor(100 * Math.pow(level, 1.5));
};

// Calculate total XP needed to reach a specific level from 0
const totalXpForLevel = (level) => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += XP_PER_LEVEL(i);
  }
  return total;
};

// Get XP needed for the next level (current level's XP requirement)
const xpForNextLevel = (currentLevel) => {
  return XP_PER_LEVEL(currentLevel);
};

// Calculate level from total XP
const calculateLevel = (totalXp) => {
  let level = 1;
  let xpAccumulated = 0;
  while (true) {
    const xpNeeded = XP_PER_LEVEL(level);
    if (xpAccumulated + xpNeeded > totalXp) {
      break;
    }
    xpAccumulated += xpNeeded;
    level++;
    if (level > 1000) break; // safety cap
  }
  return level;
};

// Calculate current XP within the level (not total XP)
const calculateCurrentLevelXp = (totalXp, currentLevel) => {
  let xpAccumulated = 0;
  for (let i = 1; i < currentLevel; i++) {
    xpAccumulated += XP_PER_LEVEL(i);
  }
  return totalXp - xpAccumulated;
};

// Get title based on level
const getTitleForLevel = (level) => {
  if (level < 5) return 'Novice';
  if (level < 10) return 'Apprentice';
  if (level < 15) return 'Journeyman';
  if (level < 20) return 'Adventurer';
  if (level < 25) return 'Warrior';
  if (level < 30) return 'Champion';
  if (level < 40) return 'Veteran';
  if (level < 50) return 'Master';
  if (level < 60) return 'Grandmaster';
  if (level < 75) return 'Legend';
  if (level < 100) return 'Mythic';
  return 'Transcendent';
};

// XP multipliers by difficulty
const XP_MULTIPLIERS = {
  Easy: 1.0,
  Medium: 1.5,
  Hard: 2.0,
  Epic: 3.0,
};

// Base XP by category
const BASE_XP = {
  Health: 25,
  Fitness: 30,
  Learning: 35,
  Career: 30,
  Mind: 25,
  Personal: 20,
  Social: 20,
  Custom: 20,
};

// Calculate XP reward for a habit completion
const calculateXpReward = (habit, isMinimum = false) => {
  const base = BASE_XP[habit.category] || 20;
  const multiplier = XP_MULTIPLIERS[habit.difficulty] || 1.5;
  const reward = Math.floor(base * multiplier);
  return isMinimum ? Math.floor(reward * 0.5) : reward;
};

// Stat increase mapping by habit category/stat
const getStatIncrease = (stat, difficulty) => {
  const baseIncrease = { Easy: 0.1, Medium: 0.2, Hard: 0.35, Epic: 0.5 };
  return baseIncrease[difficulty] || 0.2;
};

module.exports = {
  calculateLevel,
  calculateCurrentLevelXp,
  xpForNextLevel,
  getTitleForLevel,
  calculateXpReward,
  getStatIncrease,
  XP_PER_LEVEL,
};
