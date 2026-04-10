import mongoose from 'mongoose';

const errorLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  errorText: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'Unknown',
  },
  explanation: String,
  rootCause: String,
  fix: {
    description: String,
    code: String,
  },
  prevention: String,
  docsLink: String,
  tags: [String],
  isShared: {
    type: Boolean,
    default: false,
  },
  isAnonymous: {
    type: Boolean,
    default: true,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  userNotes: {
    type: String,
    default: '',
  },
  isSolved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('ErrorLog', errorLogSchema);
