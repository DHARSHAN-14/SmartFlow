const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

router.use(auth);

// ── GET /api/insights ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const all = await Task.find({ userId: req.user._id });
    const total = all.length;
    const completed = all.filter(t => t.status === 'Completed').length;
    const inProgress = all.filter(t => t.status === 'In Progress').length;
    const pending = all.filter(t => t.status === 'Pending').length;

    const byCategory = {};
    all.forEach(t => { byCategory[t.category] = (byCategory[t.category] || 0) + 1; });

    const byPriority = {};
    all.forEach(t => { byPriority[t.priority] = (byPriority[t.priority] || 0) + 1; });

    const byEnergy = {};
    all.forEach(t => { byEnergy[t.energyLevel] = (byEnergy[t.energyLevel] || 0) + 1; });

    const now = new Date();
    const overdue = all.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed').length;
    const productivity = total ? Math.round((completed / total) * 100) : 0;

    res.json({ total, completed, inProgress, pending, overdue, productivity, byCategory, byPriority, byEnergy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
