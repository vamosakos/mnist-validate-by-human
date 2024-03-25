import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ResponsesBarChart from '@/Components/ResponsesBarChart.jsx';
import Dropdown from '@/Components/Dropdown.jsx'; 

export default function All({ auth, responses }) {
  const [filteredId, setFilteredId] = useState('');

  const handleFilterChange = (event) => {
    setFilteredId(event.target.value.trim());
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