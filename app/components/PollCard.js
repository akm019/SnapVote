// app/components/PollCard.jsx
'use client';

import Link from 'next/link';

const PollCard = ({ poll }) => {
  let statusText = 'Active';
  let statusColor = 'text-green-500';

  if (!poll.isActive) {
    statusText = 'Inactive';
    statusColor = 'text-red-500';
  } else if (poll.isPaused) {
    statusText = 'Paused';
    statusColor = 'text-yellow-500';
  }

  return (
    <div className={`p-6 rounded-lg shadow-md bg-white`}>
      <h2 className="text-2xl font-semibold mb-2">{poll.question}</h2>
      <p className={`text-sm mb-4 ${statusColor}`}>{statusText}</p>
      <div className="flex justify-between items-center">
        <Link href={`/poll/${poll._id}`} className="text-blue-600 hover:underline">
          View Poll
        </Link>
        <span className="text-sm text-gray-500">
          Created At: {new Date(poll.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default PollCard;