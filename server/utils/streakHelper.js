const Streak = require('../models/Streak');

async function updateStreak(userId) {
  try {
    let streak = await Streak.findOne({ userId });
    if (!streak) streak = new Streak({ userId });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (streak.lastCompletedDate) {
      const last = new Date(streak.lastCompletedDate);
      last.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today - last) / 86400000);

      if (diffDays === 0) {
        // Same day – nothing changes
      } else if (diffDays === 1) {
        streak.currentStreak += 1;
        streak.totalCompletedDays += 1;
      } else {
        // Streak broken
        streak.currentStreak = 1;
        streak.totalCompletedDays += 1;
      }
    } else {
      streak.currentStreak = 1;
      streak.totalCompletedDays = 1;
    }

    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
    streak.lastCompletedDate = today;
    await streak.save();
  } catch (err) {
    console.error('Streak update error:', err.message);
  }
}

module.exports = { updateStreak };
