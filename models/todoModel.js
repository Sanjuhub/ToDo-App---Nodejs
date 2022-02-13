const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  status: { type: String, required: true },
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Board',
  },
});
module.exports = mongoose.model('Todo', todoSchema);
