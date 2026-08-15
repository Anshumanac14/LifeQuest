const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Habit = require('../models/Habit');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc  Register user
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      level: 1,
      xp: 0,
      totalXp: 0,
      title: 'Novice',
      stats: {
        strength: 1,
        intelligence: 1,
        focus: 1,
        wisdom: 1,
        recovery: 1,
        discipline: 1,
      },
    });

    // Create default starter habits
    await Habit.insertMany([
      {
        userId: user._id,
        name: 'Morning Routine',
        category: 'Health',
        difficulty: 'Easy',
        target: '15 minutes',
        minimumTarget: '5 minutes',
        stat: 'recovery',
        xpReward: 20,
        minimumXpReward: 10,
        icon: '🌅',
        order: 1,
      },
      {
        userId: user._id,
        name: 'Exercise',
        category: 'Fitness',
        difficulty: 'Medium',
        target: '30 minutes',
        minimumTarget: '10 minutes',
        stat: 'strength',
        xpReward: 40,
        minimumXpReward: 20,
        icon: '💪',
        order: 2,
      },
      {
        userId: user._id,
        name: 'Reading',
        category: 'Learning',
        difficulty: 'Easy',
        target: '20 minutes',
        minimumTarget: '5 minutes',
        stat: 'wisdom',
        xpReward: 25,
        minimumXpReward: 12,
        icon: '📚',
        order: 3,
      },
    ]);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        totalXp: user.totalXp,
        title: user.title,
        stats: user.stats,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        consistency: user.consistency,
        settings: user.settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Auto-seed demo user if requested
    if (email.toLowerCase() === 'alex@lifequest.app') {
      const { seedDemoUser } = require('../services/seedService');
      await seedDemoUser();
    }

    // Include password in query
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        totalXp: user.totalXp,
        title: user.title,
        stats: user.stats,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        consistency: user.consistency,
        recoveryMode: user.recoveryMode,
        settings: user.settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Logout user
// @route POST /api/auth/logout
const logout = async (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc  Get current user profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
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
        stats: user.stats,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        consistency: user.consistency,
        recoveryMode: user.recoveryMode,
        totalCompletions: user.totalCompletions,
        settings: user.settings,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, getMe };
