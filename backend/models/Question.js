import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject', // Points directly to the Subject model
    required: true
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String], // An array of strings representing multiple-choice options
    validate: [arrayLimit, 'An MCQ must have exactly 4 options.']
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3 // Restricts the answer to index 0 (A), 1 (B), 2 (C), or 3 (D)
  },
  explanation: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

// Helper validator function to enforce standard 4 options (A, B, C, D)
function arrayLimit(val) {
  return val.length === 4;
}

export default mongoose.model('Question', questionSchema);