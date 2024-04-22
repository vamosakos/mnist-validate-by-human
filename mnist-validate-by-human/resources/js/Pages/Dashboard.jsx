import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-center mb-4">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-semibold flex justify-center">This page belongs to the 'mnist validate by human' test site.</p>
                                        <p className="font-semibold flex justify-center">The website contains the following tabs:</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <strong>Overview:</strong>
                                <p>Summarized statistics highlighting the most important information and top records.</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <strong>Graphs & Charts:</strong>
                                <p>Here, responses and generation-related information are displayed in diagrammatic view. There are two different views. One of them is 'Responses' and the other one is the 'Image Frequencies' view. You can search among the data. Within the views there is the possibility to view multiple types of charts.</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <strong>Data Listing:</strong>
                                <p>The tabular listing of the data can be viewed in two views, one is the "Responses" view and the other is the "Image Frequencies" view. The data can be deleted and exported in customizable way. Each record is clickable to show more details.</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <strong>Image Generation:</strong>
                                <p>This is the control panel for manipulating the images randomness appearing in the test with 'weighted random'. This way we can control the most important information according to our priorities.</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <strong>Feedbacks:</strong>
                                <p>This page serves to view the feedbacks given by guests.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
