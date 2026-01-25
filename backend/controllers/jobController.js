import Job from '../models/Job.js';

// Get all jobs (with filters)
export const getAllJobs = async (req, res) => {
  try {
    const { type, location, search, isActive } = req.query;
    
    let query = {};
    
    if (type) query.type = type;
    if (location) query.location = new RegExp(location, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const jobs = await Job.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get Jobs Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching jobs' 
    });
  }
};

// Get single job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Get Job Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching job' 
    });
  }
};

// Create job (Admin only)
export const createJob = async (req, res) => {
  try {
    const { title, description, skills, type, location, stipend, duration } = req.body;

    if (!title || !description || !type || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const job = await Job.create({
      title,
      description,
      skills: skills || [],
      type,
      location,
      stipend,
      duration,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create Job Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating job' 
    });
  }
};

// Update job (Admin only)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    res.json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update Job Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating job' 
    });
  }
};

// Delete job (Admin only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete Job Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting job' 
    });
  }
};
