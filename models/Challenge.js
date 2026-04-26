const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  mentor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    maxlength: 100
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard']
  },
  deadline: {
    type: Date
  },
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);
