'use client';

import Link from 'next/link';
import { Clock, ExternalLink } from 'lucide-react';

const PollCard = ({ poll }) => {
  let statusConfig = {
    text: 'Active',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  };

  if (!poll.isActive) {
    statusConfig = {
      text: 'Inactive',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    };
  } else if (poll.isPaused) {
    statusConfig = {
      text: 'Paused',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    };
  }

  return (
    <div className={`p-6 rounded-xl shadow-md bg-white border ${statusConfig.borderColor} 
                    hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex-grow pr-4">{poll.question}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color} ${statusConfig.bgColor}`}>
          {statusConfig.text}
        </span>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <Link 
          href={`/poll/${poll._id}`} 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 
                   font-medium transition-colors duration-200"
        >
          <span>View Poll</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
        
        <div className="flex items-center space-x-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {new Date(poll.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PollCard;