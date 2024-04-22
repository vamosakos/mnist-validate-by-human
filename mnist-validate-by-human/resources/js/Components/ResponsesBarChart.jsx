import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
};

const ResponsesBarChart = ({ responses, filteredId }) => {
    const [responseCountsBySession, setResponseCountsBySession] = useState({});
    const [averageResponseTimeByImage, setAverageResponseTimeByImage] = useState({});
    const [chartView, setChartView] = useState('response_counts_by_session');
    const [sortOrder, setSortOrder] = useState('ascending');

    useEffect(() => {
        if (responses.length === 0) return;

        const responsesCopy = [...responses];

        let filteredResponses = responsesCopy;
        if (filteredId !== '') {
            if (chartView === 'response_counts_by_session') {
                filteredResponses = responsesCopy.filter(response => response.session_id === filteredId);
            } else if (chartView === 'response_time_by_image') {
                filteredResponses = responsesCopy.filter(response => response.image_id.toString() === filteredId);
            }
        }
        
        if (chartView === 'response_counts_by_session') {
            const countsBySession = {};
            filteredResponses.forEach(response => {
                const sessionId = response.session_id;
                countsBySession[sessionId] = countsBySession[sessionId] ? countsBySession[sessionId] + 1 : 1;
            });
            setResponseCountsBySession(countsBySession);
        }

        if (chartView === 'response_time_by_image') {
            const totalTimeByImage = {};
            const countByImage = {};
            filteredResponses.forEach(response => {
                const imageId = response.image_id;
                totalTimeByImage[imageId] = totalTimeByImage[imageId] ? totalTimeByImage[imageId] + response.response_time : response.response_time;
                countByImage[imageId] = countByImage[imageId] ? countByImage[imageId] + 1 : 1;
            });
            const averageResponseTime = {};
            Object.keys(totalTimeByImage).forEach(imageId => {
                averageResponseTime[imageId] = totalTimeByImage[imageId] / countByImage[imageId];
            });
            setAverageResponseTimeByImage(averageResponseTime);
        }
    }, [responses, filteredId, chartView]);

    const handleSortOrderChange = () => {
        setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
    };

    const sortData = (data) => {
        return Object.entries(data).sort((a, b) => {
            if (sortOrder === 'ascending') {
                return a[1] - b[1];
            } else {
                return b[1] - a[1];
            }
        });
    };

    return (
        <div className="relative">
            <select
                id="displayOption"
                onChange={(e) => setChartView(e.target.value)}
                value={chartView}
                className="w-full border-gray-300 rounded-md mb-2"
            >
                <option value="response_counts_by_session">Response Count by Session</option>
                <option value="response_time_by_image">Average Response Time by Image</option>
            </select>
            <button
                onClick={handleSortOrderChange}
                className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
            >
                {sortOrder === 'ascending' ? 'Sort ↓' : 'Sort ↑'}
            </button>
            {chartView === 'response_counts_by_session' && (
                <Bar
                    data={{
                        labels: sortData(responseCountsBySession).map(entry => truncateText(entry[0], 8)),
                        datasets: [{
                            label: 'Response Count',
                            data: sortData(responseCountsBySession).map(entry => entry[1]),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        }],
                    }}
                />
            )}
            {chartView === 'response_time_by_image' && (
                <Bar
                    data={{
                        labels: sortData(averageResponseTimeByImage).map(entry => truncateText(entry[0], 8)),
                        datasets: [{
                            label: 'Average Response Time',
                            data: sortData(averageResponseTimeByImage).map(entry => entry[1]),
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                        }],
                    }}
                />
            )}
        </div>
    );
};

export default ResponsesBarChart;
