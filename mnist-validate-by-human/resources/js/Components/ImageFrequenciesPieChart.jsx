import React from 'react';
import { Pie } from 'react-chartjs-2';

const ImageFrequenciesPieChart = ({ imageFrequencies, filteredId }) => {
    const overallResponseCount = imageFrequencies.reduce((acc, curr) => acc + curr.response_count, 0);
    const overallGenerationCount = imageFrequencies.reduce((acc, curr) => acc + curr.generation_count, 0);
    const overallMisidentificationsCount = imageFrequencies.reduce((acc, curr) => acc + Number(curr.misidentifications_count || 0), 0);

    const filteredImageData = filteredId ? imageFrequencies.filter(item => item.image_id === filteredId) : null;
    const responseCount = filteredImageData ? filteredImageData.reduce((acc, curr) => acc + curr.response_count, 0) : overallResponseCount;
    const generationCount = filteredImageData ? filteredImageData.reduce((acc, curr) => acc + curr.generation_count, 0) : overallGenerationCount;
    const misidentificationsCount = filteredImageData ? filteredImageData.reduce((acc, curr) => acc + Number(curr.misidentifications_count || 0), 0) : overallMisidentificationsCount;

    const data = {
        labels: ['Response Count', 'Generation Count', 'Misidentifications Count'],
        datasets: [
            {
                label: 'Overall Count',
                data: [responseCount, generationCount, misidentificationsCount],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <Pie data={data} />
        </div>
    );
};

export default ImageFrequenciesPieChart;
