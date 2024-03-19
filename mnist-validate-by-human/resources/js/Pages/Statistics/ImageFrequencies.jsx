import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ImageFrequenciesBarChart from '@/Components/ImageFrequenciesBarChart.jsx';
import ImageFrequenciesPieChart from '@/Components/ImageFrequenciesPieChart.jsx';
import ImageDisplay from '@/Components/ImageDisplay';

export default function All({ auth, imageFrequencies }) {
  const [filteredId, setFilteredId] = useState(null);
  const [heatmapImage, setHeatmapImage] = useState(null);

  const handleFilterChange = (event) => {
    const inputValue = event.target.value;
    // Check if the input contains only numeric characters
    if (/^\d*$/.test(inputValue)) {
      setFilteredId(inputValue !== '' ? parseInt(inputValue) : null);
    }
  };

  useEffect(() => {
    fetchHeatmapImage();
  }, [filteredId]);

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
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Image Frequencies</h2>}
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
          {/* Search field */}
          <div className="mb-4">
            <label htmlFor="searchInput" className="block text-xl font-medium text-gray-700">Search by ID:</label>
            <input
              type="text"
              name="searchInput"
              id="searchInput"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              value={filteredId || ''}
              onChange={handleFilterChange}
              pattern="[0-9]*" // Restricts input to numeric characters only
            />
          </div>
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="chart-container" style={{ width: '100%', height: '500px' }}>
                <ImageFrequenciesBarChart imageFrequencies={imageFrequencies} filteredId={filteredId} />
              </div>
              <div className="chart-container flex justify-center" style={{ width: '100%', height: '500px' }}>
                <ImageFrequenciesPieChart imageFrequencies={imageFrequencies} filteredId={filteredId} />
              </div>
              <div className="chart-container" style={{ width: '100%', height: '700px' }}>
                <ImageDisplay imageId={filteredId} />
              </div>
              <div className="chart-container" style={{ width: '100%', height: '400px' }}>
                {heatmapImage && <img src={`data:image/png;base64,${heatmapImage}`} alt="Heatmap" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
