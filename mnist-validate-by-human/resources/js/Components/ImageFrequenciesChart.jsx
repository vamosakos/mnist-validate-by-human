import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ImageFrequenciesChart = ({ imageFrequencies }) => {
  const [filteredId, setFilteredId] = useState(null);

  // Filter imageFrequencies based on the entered image_id
  const filteredData = filteredId
    ? imageFrequencies.filter((item) => item.image_id === parseInt(filteredId))
    : imageFrequencies;

  const data = {
    labels: filteredData.map((item) => item.image_id),
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
    ],
  };

  // Define the handleFilterChange function
  const handleFilterChange = (event) => {
    setFilteredId(event.target.value);
  };

  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Image ID',
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Count',
        },
      },
    },
  };

  return (
    <div>
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
      <Bar data={data} options={options} />
    </div>
  );
};

export default ImageFrequenciesChart;