import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ResponsesBarChart from '@/Components/ResponsesBarChart.jsx';
import Dropdown from '@/Components/Dropdown.jsx'; 

export default function All({ auth, responses }) {
  const [filteredId, setFilteredId] = useState('');
  const [heatmapImage, setHeatmapImage] = useState(null);

  const handleFilterChange = (event) => {
    setFilteredId(event.target.value.trim());
  };

  useEffect(() => {
    fetchHeatmapImage();
  }, []);

  const fetchHeatmapImage = async () => {
    try {
      // Fetch the JSON data from the backend
      const response = await fetch('/statistics/heatmap');
      if (!response.ok) {
        throw new Error('Failed to fetch heatmap image');
      }
      const data = await response.json(); // Parse response as JSON
      // Extract the base64-encoded image data from the JSON response
      const heatmapBase64 = data.heatmap_base64;
      setHeatmapImage(heatmapBase64);
    } catch (error) {
      console.error('Error fetching heatmap image:', error.message);
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div>
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            <Dropdown>
              <Dropdown.Trigger>
                <span className="flex items-center">
                  Responses
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transition-transform duration-200 transform"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 12a.75.75 0 0 1-.53-.22l-4.25-4.25a.75.75 0 1 1 1.06-1.06L10 10.94l3.72-3.72a.75.75 0 0 1 1.06 1.06l-4.25 4.25A.75.75 0 0 1 10 12z"
                    />
                  </svg>
                </span>
              </Dropdown.Trigger>
              <Dropdown.Content align="left">
                <Dropdown.Link href={route('statistics.imageFrequencies')}>
                  Image Frequencies
                </Dropdown.Link>
                <Dropdown.Link href={route('statistics.responsesGraphsCharts')}>
                  Responses
                </Dropdown.Link>
              </Dropdown.Content>
            </Dropdown>
          </h2>
        </div>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-4">
              {/* Search field */}
              <label htmlFor="searchInput" className="block text-xl font-medium text-gray-700">Search by ID:</label>
              <input
                type="text"
                name="searchInput"
                id="searchInput"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                value={filteredId}
                onChange={handleFilterChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {/* Responses Bar Chart Card */}
              <div className="p-4 bg-white border rounded-md">
                <h3 className="text-lg font-semibold">Responses Bar Chart</h3>
                <div className="chart-container">
                  <ResponsesBarChart responses={responses} filteredId={filteredId} />
                </div>
              </div>

              {/* Heatmap Image Card */}
              <div className="p-4 bg-white border rounded-md">
                <h3 className="text-lg font-semibold">Heatmap Image</h3>
                <div className="chart-container">
                  {heatmapImage && <img src={`data:image/png;base64,${heatmapImage}`} alt="Heatmap" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
