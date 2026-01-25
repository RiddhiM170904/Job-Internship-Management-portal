import Application from '../models/Application.js';
import Job from '../models/Job.js';

// Create application (User)
export const createApplication = async (req, res) => {
  try {
    const { jobId, resumeLink, coverNote } = req.body;

    if (!jobId || !resumeLink) {
      return res.status(400).json({ 
        success: false, 
        message: 'Job ID and resume link are required' 
      });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    if (!job.isActive) {
      return res.status(400).json({ 
        success: false, 
        message: 'This job is no longer accepting applications' 
      });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      userId: req.user._id,
      jobId
    });

    if (existingApplication) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already applied for this job' 
      });
    }

    // Create application
    const application = await Application.create({
      userId: req.user._id,
      jobId,
      resumeLink,
      coverNote
    });

    await application.populate('jobId', 'title type location');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Create Application Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting application' 
    });
  }
};

// Get user's applications (User dashboard)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('jobId', 'title type location company')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get My Applications Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching applications' 
    });
  }
};

// Get all applications (Admin dashboard)
export const getAllApplications = async (req, res) => {
  try {
    const { jobId, status, sortBy } = req.query;

    let query = {};
    if (jobId) query.jobId = jobId;
    if (status) query.status = status;

    let sortOption = { appliedAt: -1 };
    if (sortBy === 'oldest') sortOption = { appliedAt: 1 };

    const applications = await Application.find(query)
      .populate('userId', 'name email')
      .populate('jobId', 'title type location')
      .sort(sortOption);

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get All Applications Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching applications' 
    });
  }
};

// Update application status (Admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['Applied', 'Shortlisted', 'Selected', 'Rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'name email')
     .populate('jobId', 'title type');

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating application status' 
    });
  }
};

// Get single application details
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('jobId');

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && application.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get Application Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching application' 
    });
  }
};
