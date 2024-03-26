import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ImageFrequenciesBarChart from '@/Components/ImageFrequenciesBarChart.jsx';
import ImageFrequenciesPieChart from '@/Components/ImageFrequenciesPieChart.jsx';
import ImageDisplay from '@/Components/ImageDisplay';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import Dropdown from '@/Components/Dropdown'; // Import Dropdown component

export default function All({ auth, imageFrequencies }) {
  const [filteredId, setFilteredId] = useState(null);
  const [showImage, setShowImage] = useState(false);
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

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div>
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            <Dropdown>
              <Dropdown.Trigger>
                <span className="flex items-center">
                  Image Frequencies
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
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
