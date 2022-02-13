const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  boardName: { type: String, required: true, unique: true },
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Board', boardSchema);
