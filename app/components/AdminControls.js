// app/components/AdminControls.jsx
'use client';

import React from 'react';

const AdminControls = ({ poll, setPoll }) => {
  if (!poll) return null; // Ensure poll data is available

  const handlePause = async () => {
    try {
      const res = await fetch(`/api/polls/${poll._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaused: !poll.isPaused }),
      });

      if (res.ok) {
        const updatedPoll = await res.json();
        setPoll(updatedPoll);
        alert(`Poll has been ${updatedPoll.isPaused ? 'paused' : 'resumed'}.`);
      } else {
        const error = await res.json();
        alert(error.error || 'Something went wrong while pausing/resuming the poll.');
      }
    } catch (error) {
      console.error('Error pausing/resuming poll:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const sharePoll = () => {
    const pollURL = `${window.location.origin}/poll/${poll._id}`;
    navigator.clipboard.writeText(pollURL)
      .then(() => {
        alert('Poll link copied to clipboard!');
      })
      .catch((error) => {
        console.error('Error copying poll link:', error);
        alert('Failed to copy the poll link. Please try again.');
      });
  };

  return (
    <div className="mt-6 space-x-4 flex items-center">
      {/* Pause/Resume Button */}
      <button
        onClick={handlePause}
        className={`flex items-center ${
          poll.isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
        } text-white px-4 py-2 rounded`}
      >
        {poll.isPaused ? 'Resume Poll' : 'Pause Poll'}
      </button>

      {/* Share Poll Button */}
      <button
        onClick={sharePoll}
        className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
      >
        Share Poll
      </button>
    </div>
  );
};

export default AdminControls;