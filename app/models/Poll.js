// app/models/Poll.js
import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  text: String,
  votes: { type: Number, default: 0 },
});

const PollSchema = new mongoose.Schema({
  sessionId: String, // Admin's session ID
  question: String,
  options: [OptionSchema],
  voters: { type: [String], default: [] },
  isActive: { type: Boolean, default: true }, // Ensure default is true
  isPaused: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Poll || mongoose.model('Poll', PollSchema);