import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    resumeLink: '',
    coverNote: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
      setMessage({ type: 'error', text: 'Job not found' });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setApplying(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/applications', {
        jobId: id,
        resumeLink: formData.resumeLink,
        coverNote: formData.coverNote
      });
      
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      setShowApplyForm(false);
      setFormData({ resumeLink: '', coverNote: '' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to submit application' 
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Job not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <span className={`badge ${job.type === 'Job' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {job.type}
            </span>
          </div>
          <span className={`badge ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {job.isActive ? 'Active' : 'Closed'}
          </span>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            <p className="text-gray-700">{job.location}</p>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.duration && job.duration !== 'Not specified' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Duration</h2>
              <p className="text-gray-700">{job.duration}</p>
            </div>
          )}

          {job.stipend && job.stipend !== 'Not specified' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Stipend/Salary</h2>
              <p className="text-gray-700">{job.stipend}</p>
            </div>
          )}
        </div>

        {job.isActive && (
          <div className="mt-8">
            {!showApplyForm ? (
              <button
                onClick={() => setShowApplyForm(true)}
                className="btn-primary w-full"
              >
                Apply Now
              </button>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 border-t pt-6">
                <h3 className="text-xl font-semibold">Application Form</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Link *
                  </label>
                  <input
                    type="url"
                    required
                    className="input-field"
                    value={formData.resumeLink}
                    onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
                    placeholder="https://drive.google.com/..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Provide a link to your resume (Google Drive, Dropbox, etc.)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Note (Optional)
                  </label>
                  <textarea
                    className="input-field"
                    rows={4}
                    value={formData.coverNote}
                    onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                    placeholder="Tell us why you're a great fit..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-primary flex-1"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
