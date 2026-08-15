const Achievement = require('../models/Achievement');
const { getAllAchievements } = require('../services/achievementService');

// @desc  Get all achievements (with unlock status)
// @route GET /api/achievements
const getAchievements = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    const userAchievements = await Achievement.find({ userId });
    const unlockedMap = {};
    userAchievements.forEach(ua => {
      unlockedMap[ua.achievementId] = ua.unlockedAt;
    });

    const allAchievements = getAllAchievements();
    const achievementsWithStatus = allAchievements.map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      icon: a.icon,
      rarity: a.rarity,
      unlocked: !!unlockedMap[a.id],
      unlockedAt: unlockedMap[a.id] || null,
    }));

    // Sort: unlocked first, then by rarity
    const rarityOrder = { legendary: 4, rare: 3, uncommon: 2, common: 1 };
    achievementsWithStatus.sort((a, b) => {
      if (a.unlocked !== b.unlocked) return b.unlocked - a.unlocked;
      return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
    });

    res.json({
      success: true,
      achievements: achievementsWithStatus,
      stats: {
        total: allAchievements.length,
        unlocked: userAchievements.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAchievements };
