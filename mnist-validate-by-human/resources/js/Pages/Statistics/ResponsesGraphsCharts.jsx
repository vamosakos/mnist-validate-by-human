// All.jsx
import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ResponsesBarChart from '@/Components/ResponsesBarChart.jsx';


export default function All({ auth, responses }) {
  const [filteredId, setFilteredId] = useState('');

  const handleFilterChange = (event) => {
    setFilteredId(event.target.value.trim());
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Responses</h2>}
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
                  value={filteredId}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="w-1/2 px-12">
              <div className="chart-container" style={{ width: '150%', height: '550px' }}>
                <ResponsesBarChart responses={responses} filteredId={filteredId} /> {/* Pass filteredId */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
