const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  totalXp: { type: Number, default: 0 },
  title: { type: String, default: 'Novice' },
  avatar: { type: String, default: 'default' },
  stats: {
    strength: { type: Number, default: 1 },
    intelligence: { type: Number, default: 1 },
    focus: { type: Number, default: 1 },
    wisdom: { type: Number, default: 1 },
    recovery: { type: Number, default: 1 },
    discipline: { type: Number, default: 1 },
  },
  currentStreak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  consistency: { type: Number, default: 0 },
  totalCompletions: { type: Number, default: 0 },
  recoveryMode: { type: Boolean, default: false },
  lastActiveDate: { type: Date, default: null },
  skillPoints: { type: Number, default: 0 },
  unlockedSkills: { type: [String], default: ['discipline'] },
  equippedTitle: { type: String, default: 'Novice' },
  recoveryTokens: { type: Number, default: 0 },
  settings: {
    theme: { type: String, default: 'dark' },
    soundEnabled: { type: Boolean, default: false },
    reducedMotion: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true },
  },
  isDemo: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
