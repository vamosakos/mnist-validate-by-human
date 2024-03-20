import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ImageFrequenciesBarChart from '@/Components/ImageFrequenciesBarChart.jsx';
import ImageFrequenciesPieChart from '@/Components/ImageFrequenciesPieChart.jsx';
import ImageDisplay from '@/Components/ImageDisplay';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function All({ auth, imageFrequencies }) {
  const [filteredId, setFilteredId] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [heatmapImage, setHeatmapImage] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleFilterChange = (event) => {
    const inputValue = event.target.value;
    // Check if the input contains only numeric characters
    if (/^\d*$/.test(inputValue) && inputValue.length <= 5) {
      setFilteredId(inputValue !== '' ? parseInt(inputValue) : null);
      setError(null);
    } else {
      setError("Please enter a positive number with maximum 5 digits.");
    }
    // Do not show the image when the input value changes
    setShowImage(false);
  };
  
  const handleButtonClick = () => {
    setShowImage(filteredId !== null);
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
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Image Frequencies</h2>}
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
          {/* Search field */}
          <div className="mb-4">
            <InputLabel value="Search by ID:" className="text-xl font-medium text-gray-700" />
            <TextInput
              type="text"
              name="searchInput"
              id="searchInput"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              value={filteredId !== null ? filteredId.toString() : ''}
              onChange={handleFilterChange}
              ref={inputRef}
            />
            <InputError message={error} />
          </div>
          <div className="flex">
            <PrimaryButton className="ml-auto" disabled={filteredId === null} onClick={handleButtonClick}>
              Get Image
            </PrimaryButton>
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
                <ImageDisplay imageId={filteredId} showImage={showImage} />
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
