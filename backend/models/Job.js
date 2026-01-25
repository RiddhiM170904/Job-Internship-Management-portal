import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  skills: [{
    type: String,
    trim: true
  }],
  type: {
    type: String,
    enum: ['Internship', 'Job'],
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  stipend: {
    type: String,
    default: 'Not specified'
  },
  duration: {
    type: String,
    default: 'Not specified'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better search performance
jobSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Job', jobSchema);
