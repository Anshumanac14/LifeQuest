const User = require('../models/User');

// @desc  Get user profile
// @route GET /api/user/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        totalXp: user.totalXp,
        title: user.title,
        avatar: user.avatar,
        stats: user.stats,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        consistency: user.consistency,
        totalCompletions: user.totalCompletions,
        recoveryMode: user.recoveryMode,
        settings: user.settings,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Update user profile
// @route PUT /api/user/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, settings } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name.trim();
    if (settings) {
      user.settings = { ...user.settings, ...settings };
    }

    await user.save();
    res.json({
      success: true,
      message: 'Profile updated!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        settings: user.settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
