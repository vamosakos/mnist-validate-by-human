import React from 'react';
import { Pie } from 'react-chartjs-2';

const OverallImageFrequenciesPieChart = ({ imageFrequencies }) => {
  // Extract counts for response, generation, and misidentifications from imageFrequencies
  const overallResponseCount = imageFrequencies.reduce((acc, curr) => acc + curr.response_count, 0);
  const overallGenerationCount = imageFrequencies.reduce((acc, curr) => acc + curr.generation_count, 0);
  const overallMisidentificationsCount = imageFrequencies.reduce((acc, curr) => acc + Number(curr.misidentifications_count || 0), 0);

  // Data for the Pie chart
  const data = {
    labels: ['Response Count', 'Generation Count', 'Misidentifications Count'],
    datasets: [
      {
        label: 'Overall Count',
        data: [overallResponseCount, overallGenerationCount, overallMisidentificationsCount],
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

  return (
    <div>
      <h2>Overall Image Frequencies</h2>
      {/* Display the Pie chart */}
      <Pie data={data} />
    </div>
  );
};

export default OverallImageFrequenciesPieChart;
