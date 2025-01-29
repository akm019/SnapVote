'use client';

import React, { useState } from 'react';
import { Pause, Play, Share2, BarChart } from 'lucide-react';
import PollAnalyticsDashboard from './PoleAnalytics';

const AdminControls = ({ poll, setPoll }) => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  if (!poll) return null;

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
        showNotification(`Poll has been ${updatedPoll.isPaused ? 'paused' : 'resumed'}.`);
      } else {
        const error = await res.json();
        showNotification(error.error || 'Something went wrong while pausing/resuming the poll.', 'error');
      }
    } catch (error) {
      console.error('Error pausing/resuming poll:', error);
      showNotification('An error occurred. Please try again.', 'error');
    }
  };

  const sharePoll = () => {
    const pollURL = `${window.location.origin}/poll/${poll._id}`;
    navigator.clipboard.writeText(pollURL)
      .then(() => {
        showNotification('Poll link copied to clipboard!');
      })
      .catch((error) => {
        console.error('Error copying poll link:', error);
        showNotification('Failed to copy the poll link. Please try again.', 'error');
      });
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg 
                            transform transition-all duration-500 translate-y-0 opacity-100
                            ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white
                            flex items-center space-x-2`;
    
    notification.innerHTML = `
      <span class="w-5 h-5">
        ${type === 'success' ? 
          '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>' :
          '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
        }
      </span>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <button
          onClick={handlePause}
          className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg
                     font-medium transition-all duration-300 transform hover:-translate-y-0.5
                     ${poll.isPaused ? 
                       'bg-green-600 hover:bg-green-700 text-white' : 
                       'bg-yellow-600 hover:bg-yellow-700 text-white'
                     } shadow-md hover:shadow-lg`}
        >
          {poll.isPaused ? (
            <>
              <Play className="w-5 h-5" />
              <span>Resume Poll</span>
            </>
          ) : (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause Poll</span>
            </>
          )}
        </button>

        <button
          onClick={sharePoll}
          className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg
                   bg-gray-700 hover:bg-gray-800 text-white font-medium
                   transition-all duration-300 transform hover:-translate-y-0.5
                   shadow-md hover:shadow-lg"
        >
          <Share2 className="w-5 h-5" />
          <span>Share Poll</span>
        </button>

        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg
                   bg-blue-600 hover:bg-blue-700 text-white font-medium
                   transition-all duration-300 transform hover:-translate-y-0.5
                   shadow-md hover:shadow-lg"
        >
          <BarChart className="w-5 h-5" />
          <span>Analytics</span>
        </button>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div className="mt-8">
          <PollAnalyticsDashboard poll={poll} />
        </div>
      )}
    </div>
  );
};

export default AdminControls;