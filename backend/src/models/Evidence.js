const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  title: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  files: {
    type: [String],
    default: []
  },
  isPrivate: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Evidence = mongoose.model('Evidence', evidenceSchema);

module.exports = Evidence;
