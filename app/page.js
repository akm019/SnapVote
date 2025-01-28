// app/page.jsx
'use client';

import { useEffect, useState } from 'react';
import PollCard from './components/PollCard';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function Home() {
  const [polls, setPolls] = useState([]);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      // Generate sessionId
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const currentSessionId = result.visitorId;
      setSessionId(currentSessionId);
        // console.log("hello",currentSessionId);
      // Fetch polls associated with the current sessionId
      const res = await fetch(`/api/polls?sessionId=${currentSessionId}`);
      
      if (res.ok) {
        const data = await res.json();
        setPolls(data);
      } else {
        const error = await res.json();
        console.error('Error fetching polls:', error);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Polls</h1>
      {polls.length === 0 ? (
        <p>You have not created any polls yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {polls.map((poll) => (
            <PollCard key={poll._id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}