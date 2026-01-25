import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
          <span className={`badge ${job.type === 'Job' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {job.type}
          </span>
        </div>
        <span className={`badge ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {job.isActive ? 'Active' : 'Closed'}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </div>
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <Link to={`/jobs/${job._id}`} className="btn-primary w-full text-center block">
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
