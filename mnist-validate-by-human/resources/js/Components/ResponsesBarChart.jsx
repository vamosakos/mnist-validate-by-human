import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ResponsesBarChart = ({ responses }) => {
  const [chartView, setChartView] = useState('guest_response'); // 'guest_response' or 'response_time'

  const handleChartViewChange = (view) => {
    setChartView(view);
  };

  const data = {
    labels: responses.map((response) => response.image_id),
    datasets: [
      {
        label: chartView === 'guest_response' ? 'Guest Response' : 'Response Time',
        data: responses.map((response) =>
          chartView === 'guest_response' ? response.guest_response : response.response_time
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

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
