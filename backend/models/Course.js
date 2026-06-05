import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true // Automatically removes accidental trailing spaces (e.g., "BCA ")
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true,
    default: "💻"
  },
  semestersCount: {
    type: Number,
    required: true,
    min: 1
  }
}, { timestamps: true }); // Automatically tracks 'createdAt' and 'updatedAt' fields

export default mongoose.model('Course', courseSchema);