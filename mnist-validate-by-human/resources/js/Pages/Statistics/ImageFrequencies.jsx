import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ImageFrequenciesBarChart from '@/Components/ImageFrequenciesBarChart.jsx';
import ImageFrequenciesPieChart from '@/Components/ImageFrequenciesPieChart.jsx';
import ImageDisplay from '@/Components/ImageDisplay';

export default function All({ auth, imageFrequencies }) {
  const [filteredId, setFilteredId] = useState(null);

  const handleFilterChange = (event) => {
    const inputValue = event.target.value;
    // Check if the input contains only numeric characters
    if (/^\d*$/.test(inputValue)) {
      setFilteredId(inputValue !== '' ? parseInt(inputValue) : null);
    }
  };

  const tableData = imageFrequencies.map((item) => ({
    id: item.id, // Assuming there is an ID field in your data
    image_id: item.image_id,
    generation_count: item.generation_count,
    response_count: item.response_count,
  }));

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Image Frequencies</h2>}
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex flex-wrap">
            <div className="w-1/4 px-4">
              <div>
                {/* Search field */}
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
              </div >
              <ImageFrequenciesPieChart imageFrequencies={imageFrequencies} filteredId={filteredId} /> {/* Pass filteredId */}
              <ImageDisplay imageId={filteredId} />
            </div>
            <div className="w-1/2 px-4">
              <div className="chart-container" style={{ width: '150%', height: '800px' }}>
                <ImageFrequenciesBarChart imageFrequencies={imageFrequencies} filteredId={filteredId} /> {/* Pass filteredId */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
