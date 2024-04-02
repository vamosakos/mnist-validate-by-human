import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable.jsx';
import Dropdown from '@/Components/Dropdown.jsx';

const columns = ['image_id', 'guest_response', 'session_id', 'response_time', 'hand', 'field_of_study']; // Added 'field_of_study' column

export default function ResponsesDataList({ auth, responses }) {
    const [tableData, setTableData] = useState(responses.map((response) => ({
        id: response.id,
        image_id: response.image_id,
        guest_response: response.guest_response,
        session_id: response.session_id,
        response_time: response.response_time,
        hand: response.hand, // Added 'hand' column
        field_of_study: response.field_of_study // Added 'field_of_study' column
    })));

    const deleteRoute = '/statistics/delete-selected-responses';

    const handleDataUpdate = (newData) => {
        setTableData(newData);
    };

    // Function to export data as NumPy array
    const exportAsNumPyArray = () => {
        // Convert tableData to a NumPy array string
        const numpyArrayString = '[' + tableData.map(row =>
            '[' + Object.values(row).join(',') + ']'
        ).join(',') + ']';
    
        // Create a temporary anchor element
        const numpyArrayUri = encodeURI("data:text/plain;charset=utf-8," + numpyArrayString);
        const link = document.createElement("a");
        link.setAttribute("href", numpyArrayUri);
        link.setAttribute("download", "responses_numpy_array.txt");
        document.body.appendChild(link);
        link.click();
    };

    // Function to export data as CSV
    const exportAsCSV = () => {
        // Convert tableData to a CSV string
        const csvContent = "data:text/csv;charset=utf-8," +
            columns.join(",") + "\n" +
            tableData.map(row =>
                columns.map(column => row[column]).join(",")
            ).join("\n");

        // Create a temporary anchor element
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "responses.csv");
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
            <Head title="Dashboard" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="overflow-hidden mt-8">
                    <div className="flex justify-end mb-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={exportAsCSV}>
                            Export CSV
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={exportAsNumPyArray}>
                            Export as NumPy Array
                        </button>
                    </div>
                    <DataTable data={tableData} columns={columns} deleteRoute={deleteRoute} onDataUpdate={handleDataUpdate}/>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
