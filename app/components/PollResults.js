'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const PollResults = ({ options: initialOptions, pollId }) => {
  const [options, setOptions] = useState([...initialOptions].sort((a, b) => b.votes - a.votes));
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connectSocket = async () => {
      try {
        const socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000', {
          path: '/api/socketio',
          transports: ['websocket'],
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketInstance.on('connect', () => {
          console.log('Socket connected successfully');
          socketInstance.emit('joinPoll', pollId);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });

        socketInstance.on('voteUpdate', (updatedOptions) => {
          console.log('Received vote update:', updatedOptions);
          if (Array.isArray(updatedOptions)) {
            const sortedOptions = [...updatedOptions].sort((a, b) => b.votes - a.votes);
            setOptions(sortedOptions);
          }
        });

        setSocket(socketInstance);

        return socketInstance;
      } catch (error) {
        console.error('Error setting up socket:', error);
        return null;
      }
    };

    const socketInstance = connectSocket();

    return () => {
      if (socketInstance) {
        socketInstance.then(socket => {
          if (socket) {
            socket.emit('leavePoll', pollId);
            socket.disconnect();
          }
        });
      }
    };
  }, [pollId]);

  const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Poll Results</h2>
      <div className="space-y-4">
        {options.map((option, index) => {
          const percentage = totalVotes === 0 ? 0 : ((option.votes / totalVotes) * 100).toFixed(1);

          return (
            <div 
              key={option._id || index}
              className="flex flex-col transform transition-all duration-300 ease-in-out"
              style={{
                order: index
              }}
            >
              <div className="flex justify-between mb-1">
                <span className="font-medium">{option.text}</span>
                <span className="text-sm text-gray-600">
                  {`${percentage}% (${option.votes} vote${option.votes !== 1 ? 's' : ''})`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
                <div
                  className="bg-blue-500 h-4 rounded transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <span className="text-sm text-gray-600">{`Total Votes: ${totalVotes}`}</span>
      </div>
    </div>
  );
};

export default PollResults;