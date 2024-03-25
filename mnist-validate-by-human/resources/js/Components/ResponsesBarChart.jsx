import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ResponsesBarChart = ({ responses }) => {
  const [sessionCounts, setSessionCounts] = useState({});
  const [chartView, setChartView] = useState('guest_response'); // 'guest_response' or 'response_time'

  useEffect(() => {
    // Calculate session counts
    const counts = {};
    responses.forEach(response => {
      const sessionId = response.session_id;
      counts[sessionId] = counts[sessionId] ? counts[sessionId] + 1 : 1;
    });
    setSessionCounts(counts);
  }, [responses]);

  const handleChartViewChange = (view) => {
    setChartView(view);
  };

  let data;
  if (chartView === 'guest_response') {
    data = {
      labels: Object.keys(sessionCounts), // Session ID-k
      datasets: [
        {
          label: 'Number of Occurrences',
          data: Object.values(sessionCounts), // Session előfordulásainak száma
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  } else if (chartView === 'response_time') {
    data = {
      labels: responses.map(response => response.image_id), // Image ID-k
      datasets: [
        {
          label: 'Response Time',
          data: responses.map(response => response.response_time),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  }

  return (
    <div className="relative">
      {/* Dropdown menu to choose display option */}
      <label htmlFor="displayOption" className="block text-xl font-medium text-gray-700 mb-2">
        Display Option:
      </label>
      <select
        id="displayOption"
        onChange={(e) => handleChartViewChange(e.target.value)}
        className="w-full border-gray-300 rounded-md"
      >
        <option value="guest_response">Guest Response</option>
        <option value="response_time">Response Time</option>
      </select>
      {/* Display the chart */}
      <Bar data={data} />
    </div>
  );
};

export default ResponsesBarChart;
