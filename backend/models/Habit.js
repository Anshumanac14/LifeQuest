const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: { type: String, trim: true, maxlength: [500, ''] },
  category: {
    type: String,
    enum: ['Health', 'Fitness', 'Learning', 'Career', 'Mind', 'Personal', 'Social', 'Custom'],
    default: 'Personal',
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Epic'],
    default: 'Medium',
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily',
  },
  target: { type: String, default: '' }, // e.g. "60 minutes"
  minimumTarget: { type: String, default: '' }, // e.g. "10 minutes"
  stat: {
    type: String,
    enum: ['strength', 'intelligence', 'focus', 'wisdom', 'recovery', 'discipline', 'none'],
    default: 'none',
  },
  xpReward: { type: Number, default: 20 },
  minimumXpReward: { type: Number, default: 10 },
  icon: { type: String, default: '⚡' },
  active: { type: Boolean, default: true },
  paused: { type: Boolean, default: false },
  currentStreak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  totalCompletions: { type: Number, default: 0 },
  lastCompleted: { type: Date, default: null },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);
