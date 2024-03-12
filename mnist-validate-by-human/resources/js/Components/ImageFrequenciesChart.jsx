import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ImageFrequenciesChart = ({ imageFrequencies, filteredId }) => {
  const [chartView, setChartView] = useState('all'); // 'all', 'top10_response', 'top10_generation', or 'top10_misidentifications'

  useEffect(() => {
    // Reset chart view when filtered ID changes
    setChartView('all');
  }, [filteredId]);

  const handleChartViewChange = (view) => {
    setChartView(view);
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
      filteredData = filteredData.sort((a, b) => a.image_id - b.image_id); // Sort by image ID in increasing order for 'all' view
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
    <div>
      {/* Dropdown menu to choose display option */}
      <label htmlFor="displayOption">Display Option: </label>
      <select id="displayOption" onChange={(e) => handleChartViewChange(e.target.value)}>
        <option value="all">All Counts</option>
        <option value="top10_response">Top 10 Response Count</option>
        <option value="top10_generation">Top 10 Generation Count</option>
        <option value="top10_misidentifications">Top 10 Misidentifications Count</option>
      </select>

      {/* Display the filtered chart */}
      <Bar data={data} />
    </div>
  );
};

export default ImageFrequenciesChart;
