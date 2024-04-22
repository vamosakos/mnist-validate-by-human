import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable.jsx';
import Dropdown from '@/Components/Dropdown.jsx';

const columns = ['image_id', 'generation_count', 'response_count', 'misidentifications_count'];

export default function ImageFrequenciesDataList({ auth, imageFrequencies }) {
    const [tableData, setTableData] = useState(imageFrequencies.map((item) => ({
        id: item.id,
        image_id: item.image_id,
        generation_count: item.generation_count,
        response_count: item.response_count,
        misidentifications_count: item.misidentifications_count,
    })));

    const deleteRoute = '/statistics/delete-selected-image-frequencies';
    const [showExportSettings, setShowExportSettings] = useState(false);

    const handleDataUpdate = (newData) => {
        setTableData(newData);
    };

    const exportAsCSV = () => {
        const selectedColumns = columns.filter(column => document.getElementById(column).checked);
        const csvContent = "data:text/csv;charset=utf-8," +
            selectedColumns.join(",") + "\n" +
            tableData.map(row =>
                selectedColumns.map(column => row[column]).join(",")
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "image_frequencies.csv");
        document.body.appendChild(link);
        link.click();
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
                                <Dropdown.Link href={route('statistics.imageFrequenciesDataList')}>
                                    Image Frequencies
                                </Dropdown.Link>
                                <Dropdown.Link href={route('statistics.responsesDataList')}>
                                    Responses
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </h2>
                </div>
            }
        >
            <Head title="Image Frequencies Table" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="overflow-hidden mt-8">
                    <div className="flex justify-end mb-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => setShowExportSettings(!showExportSettings)}>
                            Export Settings
                        </button>
                        {showExportSettings && (
                            <>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={exportAsCSV}>
                                    Export CSV
                                </button>
                            </>
                        )}
                    </div>
                    {showExportSettings && (
                        <div className="mb-4">
                            <h3 className="font-bold mb-2 ml-2">Export Settings</h3>
                            <h3 className="ml-2 mb-2">tick the exported field(s):</h3>
                            {columns.map(column => (
                                <label key={column} className="inline-flex items-center">
                                    <span className="ml-2">{column}</span>
                                    <input type="checkbox" id={column} className="ml-2" defaultChecked />
                                </label>
                            ))}
                        </div>
                    )}
                    <DataTable data={tableData} columns={columns} deleteRoute={deleteRoute} onDataUpdate={handleDataUpdate} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
