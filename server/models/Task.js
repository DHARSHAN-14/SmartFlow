const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    note: { type: String, default: '', trim: true },

    category: {
      type: String,
      enum: ['Work', 'Study', 'Personal', 'Urgent'],
      default: 'Personal',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    energyLevel: {
      type: String,
      enum: ['Low Energy', 'Medium Energy', 'High Energy'],
      default: 'Medium Energy',
    },

    dueDate: { type: Date },
    completedAt: { type: Date },
    isFocusTask: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);

