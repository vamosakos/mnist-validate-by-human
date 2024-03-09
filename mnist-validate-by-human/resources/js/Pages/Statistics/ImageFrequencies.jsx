import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable.jsx';
import ImageFrequenciesChart from '@/Components/ImageFrequenciesChart.jsx';

const columns = ['image_id', 'generation_count', 'response_count'];

export default function All({ auth, imageFrequencies }) {
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
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <ImageFrequenciesChart imageFrequencies={imageFrequencies} />
            <DataTable data={tableData} columns={columns} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}