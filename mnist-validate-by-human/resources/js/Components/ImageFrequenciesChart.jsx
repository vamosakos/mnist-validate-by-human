import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ImageFrequenciesChart = ({ imageFrequencies }) => {
  const [filteredId, setFilteredId] = useState(null);
  const [chartView, setChartView] = useState('all'); // 'all', 'top10_response', 'top10_generation', or 'top10_misidentifications'

  const handleChartViewChange = (view) => {
    setChartView(view);
  };

  // Sort imageFrequencies based on response count in descending order
  const sortedByResponseCount = imageFrequencies.slice().sort((a, b) => b.response_count - a.response_count);

  // Sort imageFrequencies based on generation count in descending order
  const sortedByGenerationCount = imageFrequencies.slice().sort((a, b) => b.generation_count - a.generation_count);

  // Sort imageFrequencies based on misidentifications count in descending order
  const sortedByMisidentificationsCount = imageFrequencies.slice().sort((a, b) => b.misidentifications_count - a.misidentifications_count);

  let filteredData;
  switch (chartView) {
    case 'top10_response':
      filteredData = sortedByResponseCount.slice(0, 10);
      break;
    case 'top10_generation':
      filteredData = sortedByGenerationCount.slice(0, 10);
      break;
    case 'top10_misidentifications':
      filteredData = sortedByMisidentificationsCount.slice(0, 10);
      break;
    default:
      filteredData = imageFrequencies;
  }

  // Extract image IDs from filtered data and sort them in increasing order
  const filteredImageIds = Array.from(new Set(filteredData.map((item) => item.image_id))).sort((a, b) => a - b);

  const data = {
    labels: filteredImageIds, // Set labels to only include filtered image IDs in increasing order
    datasets: [
      {
        label: 'Response Count',
        data: filteredData.map((item) => item.response_count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Generation Count',
        data: filteredData.map((item) => item.generation_count),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Misidentifications Count',
        data: filteredData.map((item) => item.misidentifications_count || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Define the handleFilterChange function
  const handleFilterChange = (event) => {
    setFilteredId(event.target.value);
  };

  return (
    <div>
      {/* Dropdown menu to choose display option */}
      <label htmlFor="displayOption">Display Option: </label>
      <select id="displayOption" onChange={(e) => handleChartViewChange(e.target.value)}>
        <option value="all">All Counts</option>
        <option value="top10_response">Top 10 Response Count</option>
        <option value="top10_generation">Top 10 Generation Count</option>
        <option value="top10_misidentifications">Top 10 Misidentifications Count</option>
      </select>

      {/* Search field for image_id */}
      <label htmlFor="imageId">Filter by Image ID: </label>
      <input
        type="number"
        id="imageId"
        name="imageId"
        value={filteredId || ''}
        onChange={handleFilterChange}
      />

      {/* Display the filtered chart */}
      <Bar data={data} />
    </div>
  );
};

export default ImageFrequenciesChart;
