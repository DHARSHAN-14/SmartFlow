const express = require('express');
const router = express.Router();
const Streak = require('../models/Streak');
const auth = require('../middleware/auth');

router.use(auth);

// ── GET /api/streak ───────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let streak = await Streak.findOne({ userId: req.user._id });
    if (!streak) streak = await new Streak({ userId: req.user._id }).save();
    res.json(streak);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
