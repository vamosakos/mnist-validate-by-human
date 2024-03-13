import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable.jsx';
import ImageFrequenciesBarChart from '@/Components/ImageFrequenciesBarChart.jsx';
import ImageFrequenciesPieChart from '@/Components/ImageFrequenciesPieChart.jsx';

const columns = ['image_id', 'generation_count', 'response_count'];

export default function All({ auth, imageFrequencies }) {
  const [filteredId, setFilteredId] = useState(null);

  const handleFilterChange = (event) => {
    setFilteredId(event.target.value ? parseInt(event.target.value) : null);
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
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                />
              </div>
              <ImageFrequenciesPieChart imageFrequencies={imageFrequencies} filteredId={filteredId} /> {/* Pass filteredId */}
            </div>
            <div className="w-1/2 px-4">
              <div className="chart-container" style={{ width: '150%', height: '550px' }}>
                <ImageFrequenciesBarChart imageFrequencies={imageFrequencies} filteredId={filteredId} /> {/* Pass filteredId */}
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-8">
            <DataTable data={tableData} columns={columns} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
