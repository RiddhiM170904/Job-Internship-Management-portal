import { useState, useEffect } from 'react';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    jobId: '',
    status: ''
  });
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    description: '',
    skills: '',
    type: 'Job',
    location: '',
    stipend: '',
    duration: '',
    isActive: true
  });

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    } else {
      fetchJobs();
    }
  }, [activeTab, filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.jobId) queryParams.append('jobId', filters.jobId);
      if (filters.status) queryParams.append('status', filters.status);

      const response = await api.get(`/applications?${queryParams}`);
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs');
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...jobFormData,
        skills: jobFormData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingJob) {
        await api.put(`/jobs/${editingJob._id}`, jobData);
      } else {
        await api.post('/jobs', jobData);
      }

      setShowJobForm(false);
      setEditingJob(null);
      resetJobForm();
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job');
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobFormData({
      title: job.title,
      description: job.description,
      skills: job.skills.join(', '),
      type: job.type,
      location: job.location,
      stipend: job.stipend || '',
      duration: job.duration || '',
      isActive: job.isActive
    });
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const resetJobForm = () => {
    setJobFormData({
      title: '',
      description: '',
      skills: '',
      type: 'Job',
      location: '',
      stipend: '',
      duration: '',
      isActive: true
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === 'applications'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Applications
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === 'jobs'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Manage Jobs
        </button>
      </div>

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div>
          {/* Filters */}
          <div className="card mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Job
                </label>
                <select
                  className="input-field"
                  value={filters.jobId}
                  onChange={(e) => setFilters({ ...filters, jobId: e.target.value })}
                >
                  <option value="">All Jobs</option>
                  {jobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  className="input-field"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-xl text-gray-600">No applications found</p>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Applicant</th>
                    <th className="text-left py-3 px-4">Job</th>
                    <th className="text-left py-3 px-4">Applied On</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Resume</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{app.userId?.name}</div>
                        <div className="text-sm text-gray-600">{app.userId?.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{app.jobId?.title}</div>
                        <div className="text-sm text-gray-600">{app.jobId?.type}</div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={app.resumeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 text-sm"
                        >
                          View
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          className="input-field text-sm"
                          value={app.status}
                          onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div>
          <div className="mb-6">
            <button
              onClick={() => {
                setShowJobForm(true);
                setEditingJob(null);
                resetJobForm();
              }}
              className="btn-primary"
            >
              + Create New Job
            </button>
          </div>

          {/* Job Form Modal */}
          {showJobForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {editingJob ? 'Edit Job' : 'Create New Job'}
                  </h2>
                  
                  <form onSubmit={handleJobSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={jobFormData.title}
                        onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        className="input-field"
                        value={jobFormData.description}
                        onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type *
                        </label>
                        <select
                          required
                          className="input-field"
                          value={jobFormData.type}
                          onChange={(e) => setJobFormData({ ...jobFormData, type: e.target.value })}
                        >
                          <option value="Job">Job</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location *
                        </label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          value={jobFormData.location}
                          onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="React, Node.js, MongoDB"
                        value={jobFormData.skills}
                        onChange={(e) => setJobFormData({ ...jobFormData, skills: e.target.value })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stipend/Salary
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g., ₹20,000/month"
                          value={jobFormData.stipend}
                          onChange={(e) => setJobFormData({ ...jobFormData, stipend: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g., 6 months"
                          value={jobFormData.duration}
                          onChange={(e) => setJobFormData({ ...jobFormData, duration: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        className="mr-2"
                        checked={jobFormData.isActive}
                        onChange={(e) => setJobFormData({ ...jobFormData, isActive: e.target.checked })}
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Active (accepting applications)
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <button type="submit" className="btn-primary flex-1">
                        {editingJob ? 'Update Job' : 'Create Job'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowJobForm(false);
                          setEditingJob(null);
                          resetJobForm();
                        }}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Jobs List */}
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`badge ${job.type === 'Job' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {job.type}
                        </span>
                        <span className={`badge ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {job.isActive ? 'Active' : 'Closed'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{job.location}</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
