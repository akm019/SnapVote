import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PollAnalyticsDashboard = ({ poll }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Format data for time series chart
  const getTimeSeriesData = () => {
    const timePoints = poll.voters.length > 0 ? Array(24).fill(0) : [];
    poll.voters.forEach(voter => {
      const hour = new Date(voter.timestamp).getHours();
      timePoints[hour]++;
    });
    
    return timePoints.map((count, hour) => ({
      hour: `${hour}:00`,
      votes: count
    }));
  };

  // Format data for options distribution
  const getOptionsData = () => {
    return poll.options.map(option => ({
      name: option.text,
      votes: option.votes
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="w-full p-4 space-y-4 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Poll Analytics: {poll.question}
        </h1>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex space-x-2 border-b">
          {['overview', 'timeAnalysis', 'distribution'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{poll.voters.length}</div>
              <div className="text-sm text-gray-500">Total Votes</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{poll.options.length}</div>
              <div className="text-sm text-gray-500">Options Available</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.max(...poll.options.map(opt => opt.votes))}
              </div>
              <div className="text-sm text-gray-500">Highest Votes for an Option</div>
            </div>
          </div>
        )}

        {/* Time Analysis Tab Content */}
        {/* {activeTab === 'timeAnalysis' && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getTimeSeriesData()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="votes" stroke="#3B82F6" fill="#93C5FD" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )} */}

        {/* Distribution Tab Content */}
        {activeTab === 'distribution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getOptionsData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getOptionsData()}
                      dataKey="votes"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {getOptionsData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollAnalyticsDashboard;