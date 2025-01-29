// app/poll/[pollId]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import PollResults from '@/app/components/PollResults';
import AdminControls from '@/app/components/AdminControls';
import { v4 as uuidv4 } from 'uuid';

export default function PollPage() {
  const params = useParams();
  const pollId = params.pollId;
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [userSessionId, setUserSessionId] = useState('');
  const [adminSessionId, setAdminSessionId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      // Generate admin sessionId using FingerprintJS
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const adminId = result.visitorId;
      setAdminSessionId(adminId);

      // Check if a userId exists in local storage
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem('userId', userId);
      }
      setUserSessionId(userId);

      // Fetch Poll Data
      const res = await fetch(`/api/polls/${pollId}`);
      if (res.ok) {
        const data = await res.json();
        setPoll(data);

        // Determine if the current user is the admin
        if (data.sessionId === adminId) {
            
          setIsAdmin(true);
          // Check if the admin has already voted
          if (data.voters && data.voters.includes(adminId)) {
            setHasVoted(true);
          }
        } else {
          // Regular user
          // Check if the user has already voted
          if (data.voters && data.voters.includes(userId)) {
            setHasVoted(true);
          }
        }
      } else {
        router.push('/');
      }
    };

    initialize();
  }, [pollId, router]);

  const handleVote = async () => {
    if (selectedOption === null) {
      alert('Please select an option');
      return;
    }

    // Determine which session ID to use
    const sessionIdToUse = isAdmin ? adminSessionId : userSessionId;

    const res = await fetch(`/api/polls/${pollId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionIndex: selectedOption, sessionId: sessionIdToUse }),
    });

    if (res.ok) {
      const updatedPoll = await res.json();
      setPoll(updatedPoll);
      setHasVoted(true);
    } else {
      const error = await res.json();
      alert(error.error || 'Something went wrong');
    }
  };

  if (!poll) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <h1 className="text-3xl font-bold">{poll.question}</h1>
        <span
          className={`ml-4 px-2 py-1 text-sm font-medium rounded ${
            !poll.isActive
              ? 'bg-red-200 text-red-800'
              : poll.isPaused
              ? 'bg-yellow-200 text-yellow-800'
              : 'bg-green-200 text-green-800'
          }`}
        >
          {!poll.isActive ? 'Inactive' : poll.isPaused ? 'Paused' : 'Active'}
        </span>
      </div>

      {/* Poll Status Messages */}
      {!poll.isActive && (
        <p className="text-red-600 mt-4">This poll is no longer active.</p>
      )}
      {poll.isPaused && poll.isActive && (
        <p className="text-yellow-600 mt-4">This poll is currently paused.</p>
      )}

      {/* Poll Options or Results */}
      {poll.isActive && !hasVoted && !poll.isPaused && !isAdmin ? (
        <div className="space-y-4">
          {poll.options.map((option, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name="option"
                value={index}
                onChange={() => setSelectedOption(index)}
                className="radio checked:bg-blue-500"
              />
              <span>{option.text}</span>
            </label>
          ))}

          <button
            onClick={handleVote}
            className={`mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ${
              selectedOption === null ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={selectedOption === null}
          >
            Vote
          </button>
        </div>
      ) : (
        <PollResults options={poll.options} pollId={poll._id} />
      )}

      {/* Admin Controls */}
      {isAdmin && <AdminControls poll={poll} setPoll={setPoll} />}
    </div>
  );
}