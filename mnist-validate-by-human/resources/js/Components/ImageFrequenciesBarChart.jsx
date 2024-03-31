import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ImageFrequenciesBarChart = ({ imageFrequencies, filteredId }) => {
  const [chartView, setChartView] = useState('all'); // 'all', 'top10_response', 'top10_generation', or 'top10_misidentifications'
  const [sortOrder, setSortOrder] = useState('ascending'); // 'ascending' or 'descending'

  useEffect(() => {
    // Reset chart view when filtered ID changes
    setChartView('all');
  }, [filteredId]);

  const handleChartViewChange = (view) => {
    setChartView(view);
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
  };

  let filteredData = [...imageFrequencies]; // Create a copy of the original data

  if (filteredId !== null) {
    // Filter data by the selected image ID
    filteredData = filteredData.filter(item => item.image_id === filteredId);
  }

  switch (chartView) {
    case 'top10_response':
      filteredData = filteredData.sort((a, b) => b.response_count - a.response_count).slice(0, 10);
      break;
    case 'top10_generation':
      filteredData = filteredData.sort((a, b) => b.generation_count - a.generation_count).slice(0, 10);
      break;
    case 'top10_misidentifications':
      filteredData = filteredData.sort((a, b) => b.misidentifications_count - a.misidentifications_count).slice(0, 10);
      break;
    default:
      // Sort by count (Y axis) in descending order
      filteredData = filteredData.sort((a, b) => b.response_count + b.generation_count + (b.misidentifications_count || 0) - (a.response_count + a.generation_count + (a.misidentifications_count || 0)));
      break;
  }

  // Sort based on sortOrder
  if (sortOrder === 'descending') {
    filteredData.reverse();
  }

  // Extract image IDs from filtered data
  const filteredImageIds = filteredData.map((item) => item.image_id);

  // Generate datasets based on the selected view
  const datasets = [
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
  ];

  if (chartView === 'top10_response') {
    datasets[1] = null; // Exclude Generation Count dataset
    datasets[2] = null; // Exclude Misidentifications Count dataset
  } else if (chartView === 'top10_generation') {
    datasets[0] = null; // Exclude Response Count dataset
    datasets[2] = null; // Exclude Misidentifications Count dataset
  } else if (chartView === 'top10_misidentifications') {
    datasets[0] = null; // Exclude Response Count dataset
    datasets[1] = null; // Exclude Generation Count dataset
  }

  const data = {
    labels: filteredImageIds, // Set labels to include all image IDs
    datasets: datasets.filter(dataset => dataset !== null), // Remove null datasets
  };

  return (
    <div className="relative">
      {/* Dropdown menu to choose display option */}
      <select
        id="displayOption"
        onChange={(e) => handleChartViewChange(e.target.value)}
        className="w-full border-gray-300 rounded-md">
        <option value="all">All Counts</option>
        <option value="top10_response">Top 10 Response Count</option>
        <option value="top10_generation">Top 10 Generation Count</option>
        <option value="top10_misidentifications">Top 10 Misidentifications Count</option>
      </select>
      {/* Button to change sort order */}
      <button onClick={handleSortOrderChange} className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center">
        {sortOrder === 'ascending' ? 'Sort ↓' : 'Sort ↑'}
      </button>
      {/* Display the filtered chart */}
      <Bar data={data} />
    </div>
  );
};

export default ImageFrequenciesBarChart;

