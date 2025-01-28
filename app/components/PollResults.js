// app/components/PollResults.jsx
'use client';

import React from 'react';

const PollResults = ({ options }) => {
  const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Poll Results</h2>
      <div className="space-y-4">
        {options.map((option, index) => {
          const percentage = totalVotes === 0 ? 0 : ((option.votes / totalVotes) * 100).toFixed(1);

          return (
            <div key={index} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{option.text}</span>
                <span className="text-sm text-gray-600">{`${percentage}% (${option.votes} vote${option.votes !== 1 ? 's' : ''})`}</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-4">
                <div
                  className="bg-blue-500 h-4 rounded"
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