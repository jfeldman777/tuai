const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  results: [{
    profession: String,
    pairs: [Number]
  }],
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'contacted'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Comparison', comparisonSchema); 