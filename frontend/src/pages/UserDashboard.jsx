import { useState, useEffect } from 'react';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/me');
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStats = () => {
    const stats = {
      Applied: 0,
      Shortlisted: 0,
      Selected: 0,
      Rejected: 0
    };
    
    applications.forEach(app => {
      stats[app.status]++;
    });
    
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">My Applications</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-blue-50">
          <div className="text-blue-600 text-3xl font-bold">{stats.Applied}</div>
          <div className="text-gray-600 mt-2">Applied</div>
        </div>
        <div className="card bg-yellow-50">
          <div className="text-yellow-600 text-3xl font-bold">{stats.Shortlisted}</div>
          <div className="text-gray-600 mt-2">Shortlisted</div>
        </div>
        <div className="card bg-green-50">
          <div className="text-green-600 text-3xl font-bold">{stats.Selected}</div>
          <div className="text-gray-600 mt-2">Selected</div>
        </div>
        <div className="card bg-red-50">
          <div className="text-red-600 text-3xl font-bold">{stats.Rejected}</div>
          <div className="text-gray-600 mt-2">Rejected</div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-xl">Loading applications...</div>
        </div>
      ) : applications.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-xl text-gray-600 mb-4">You haven't applied to any jobs yet</p>
          <a href="/jobs" className="btn-primary inline-block">
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {application.jobId?.title || 'Job Title Not Available'}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {application.jobId?.location || 'N/A'}
                    </span>
                    <span className={`badge ${
                      application.jobId?.type === 'Job' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {application.jobId?.type || 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Applied on: {new Date(application.appliedAt).toLocaleDateString()}
                  </div>
                  {application.coverNote && (
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Cover Note:</strong> {application.coverNote}
                    </div>
                  )}
                  <div className="mt-2">
                    <a 
                      href={application.resumeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 text-sm"
                    >
                      View Resume →
                    </a>
                  </div>
                </div>
                <div className="ml-4">
                  <StatusBadge status={application.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
