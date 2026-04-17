const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const { updateStreak } = require('../utils/streakHelper');

// All task routes require authentication
router.use(auth);

// ── Auto-categorise by keyword analysis ──────────────────────
function autoCategory(title) {
  const t = title.toLowerCase();
  if (/urgent|asap|critical|emergency|immediately/.test(t)) return 'Urgent';
  if (/meeting|client|project|deadline|report|presentation|email|office|sprint/.test(t)) return 'Work';
  if (/study|learn|read|course|exam|assignment|homework|lecture|research/.test(t)) return 'Study';
  return 'Personal';
}

// ── GET /api/tasks ────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { status, category, priority, energyLevel, search } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (energyLevel) filter.energyLevel = energyLevel;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/tasks ───────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user._id };
    if (!data.category || data.category === 'auto') {
      data.category = autoCategory(data.title || '');
    }
    const task = await new Task(data).save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PUT /api/tasks/:id ────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body };

    // Ensure the task belongs to this user
    const existing = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!existing) return res.status(404).json({ message: 'Task not found' });

    if (updates.status === 'Completed' && existing.status !== 'Completed') {
      updates.completedAt = new Date();
      await updateStreak(req.user._id);
    }
    if (updates.status && updates.status !== 'Completed') {
      updates.completedAt = null;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE /api/tasks/:id ─────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/tasks/suggest ────────────────────────────────────
router.get('/suggest', async (req, res) => {
  try {
    const now = new Date();
    const tasks = await Task.find({ userId: req.user._id, status: { $ne: 'Completed' } });
    if (!tasks.length) return res.json(null);

    const scored = tasks.map((task) => {
      let score = 0;

      if (task.priority === 'High') score += 40;
      else if (task.priority === 'Medium') score += 25;
      else score += 10;

      if (task.dueDate) {
        const daysLeft = (new Date(task.dueDate) - now) / 86400000;
        if (daysLeft < 0) score += 60;
        else if (daysLeft < 1) score += 50;
        else if (daysLeft < 3) score += 30;
        else if (daysLeft < 7) score += 15;
      }

      if (task.isFocusTask) score += 20;
      if (task.category === 'Urgent') score += 30;

      return { task, score };
    });

    scored.sort((a, b) => b.score - a.score);
    res.json(scored[0].task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
