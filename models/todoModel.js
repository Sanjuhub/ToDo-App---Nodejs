const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  taskName: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  createdById: { type: mongoose.Schema.Types.ObjectId, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, required: true },
});
module.exports = mongoose.model('Todo', todoSchema);
