const mongoose = require('mongoose');

const habitCompletionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    },
  },
  completed: { type: Boolean, default: true },
  isMinimumCompletion: { type: Boolean, default: false },
  xpEarned: { type: Number, default: 0 },
  statIncreased: { type: String, default: null },
  notes: { type: String, default: '' },
}, { timestamps: true });

// Compound index to prevent duplicate completions per day
habitCompletionSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitCompletion', habitCompletionSchema);
