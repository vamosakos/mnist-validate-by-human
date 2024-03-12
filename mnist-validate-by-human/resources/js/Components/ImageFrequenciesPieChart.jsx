import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';

const OverallImageFrequenciesPieChart = ({ imageFrequencies }) => {
  const [filteredId, setFilteredId] = useState(null);

  // Extract counts for response, generation, and misidentifications from imageFrequencies
  const overallResponseCount = imageFrequencies.reduce((acc, curr) => acc + curr.response_count, 0);
  const overallGenerationCount = imageFrequencies.reduce((acc, curr) => acc + curr.generation_count, 0);
  const overallMisidentificationsCount = imageFrequencies.reduce((acc, curr) => acc + Number(curr.misidentifications_count || 0), 0);

  // Extract counts for response, generation, and misidentifications from imageFrequencies for the filtered ID
  const filteredImageData = filteredId ? imageFrequencies.filter(item => item.image_id === filteredId) : null;
  const responseCount = filteredImageData ? filteredImageData.reduce((acc, curr) => acc + curr.response_count, 0) : overallResponseCount;
  const generationCount = filteredImageData ? filteredImageData.reduce((acc, curr) => acc + curr.generation_count, 0) : overallGenerationCount;
  const misidentificationsCount = filteredImageData ? filteredImageData.reduce((acc, curr) => acc + Number(curr.misidentifications_count || 0), 0) : overallMisidentificationsCount;

  // Data for the Pie chart
  const data = {
    labels: ['Response Count', 'Generation Count', 'Misidentifications Count'],
    datasets: [
      {
        label: 'Overall Count',
        data: [responseCount, generationCount, misidentificationsCount],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Define the handleFilterChange function to update filteredId state
  const handleFilterChange = (event) => {
    setFilteredId(event.target.value ? parseInt(event.target.value) : null);
  };

  return (
    <div>
      <h2>Overall Image Frequencies</h2>
      {/* Search field for image_id */}
      <label htmlFor="imageId">Filter by Image ID: </label>
      <input
        type="number"
        id="imageId"
        name="imageId"
        value={filteredId || ''}
        onChange={handleFilterChange}
      />
      {/* Display the Pie chart */}
      <Pie data={data} />
    </div>
  );
};

export default OverallImageFrequenciesPieChart;
