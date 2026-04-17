const mongoose = require('mongoose');

const StreakSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletedDate: { type: Date },
    totalCompletedDays: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Streak', StreakSchema);
