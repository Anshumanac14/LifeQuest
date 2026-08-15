const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'boss', 'bonus', 'recovery'],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    default: null,
  },
  target: { type: Number, default: 1 },
  progress: { type: Number, default: 0 },
  reward: { type: Number, default: 0 },
  bonusReward: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  icon: { type: String, default: '⚡' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Epic', 'Boss'], default: 'Medium' },
}, { timestamps: true });

module.exports = mongoose.model('Quest', questSchema);
