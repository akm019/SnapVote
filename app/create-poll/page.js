// app/create-poll/page.jsx
'use client';

import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useRouter } from 'next/navigation';

export default function CreatePoll() {
  const [sessionId, setSessionId] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with two options
  const router = useRouter();

  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setSessionId(result.visitorId);
    };
    getFingerprint();
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((opt, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!question.trim()) {
      alert('Question is required');
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      alert('All options must be filled');
      return;
    }

    const res = await fetch('/api/polls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, question, options }),
    });

    if (res.ok) {
      const poll = await res.json();
      router.push(`/poll/${poll._id}`);
    } else {
      const error = await res.json();
      alert(error.error || 'Something went wrong');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create a New Poll</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Options:</label>
          {options.map((option, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="ml-2 text-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="text-blue-500"
          >
            Add Option
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
}