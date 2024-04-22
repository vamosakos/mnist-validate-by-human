import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ImageFrequenciesBarChart = ({ imageFrequencies, filteredId }) => {
    const [chartView, setChartView] = useState('all');
    const [sortOrder, setSortOrder] = useState('ascending');

    useEffect(() => {
        setChartView('all');
    }, [filteredId]);

    const handleChartViewChange = (view) => {
        setChartView(view);
    };

    const handleSortOrderChange = () => {
        setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
    };

    let filteredData = [...imageFrequencies];

    if (filteredId !== null) {
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
            filteredData = filteredData.sort((a, b) => b.response_count + b.generation_count + (b.misidentifications_count || 0) - (a.response_count + a.generation_count + (a.misidentifications_count || 0)));
            break;
    }

    if (sortOrder === 'descending') {
        filteredData.reverse();
    }

    const filteredImageIds = filteredData.map((item) => item.image_id);

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
        datasets[1] = null;
        datasets[2] = null;
    } else if (chartView === 'top10_generation') {
        datasets[0] = null;
        datasets[2] = null;
    } else if (chartView === 'top10_misidentifications') {
        datasets[0] = null;
        datasets[1] = null;
    }

    const data = {
        labels: filteredImageIds,
        datasets: datasets.filter(dataset => dataset !== null),
    };

    return (
        <div className="relative">
            <select
                id="displayOption"
                onChange={(e) => handleChartViewChange(e.target.value)}
                className="w-full border-gray-300 rounded-md"
            >
                <option value="all">All Counts</option>
                <option value="top10_response">Top 10 Response Count</option>
                <option value="top10_generation">Top 10 Generation Count</option>
                <option value="top10_misidentifications">Top 10 Misidentifications Count</option>
            </select>
            <button
                onClick={handleSortOrderChange}
                className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
            >
                {sortOrder === 'ascending' ? 'Sort ↓' : 'Sort ↑'}
            </button>
            <Bar data={data} />
        </div>
    );
};

export default ImageFrequenciesBarChart;
