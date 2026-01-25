const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Shortlisted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Selected':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`badge ${getStatusStyle()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
