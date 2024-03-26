import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable.jsx';
import Dropdown from '@/Components/Dropdown.jsx'; 

const columns = ['image_id', 'guest_response', 'session_id', 'response_time'];

export default function ResponsesDataList({ auth, responses }) {
    const tableData = responses.map((response) => ({
        id: response.id, // Assuming there is an ID field in your data
        image_id: response.image_id,
        guest_response: response.guest_response,
        session_id: response.session_id,
        response_time: response.response_time,
    }));

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
                    <DataTable data={tableData} columns={columns} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
