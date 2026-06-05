import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId, // Connects to MongoDB's unique tracking ID
    ref: 'Course', // Points directly to the Course model
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true, // Prevents two subjects from having the same URL extension
    lowercase: true,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);