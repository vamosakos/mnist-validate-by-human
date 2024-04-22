import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ImageDetailPopup from '@/Popups/ImageDetailPopup';

export default function Overview({
    auth,
    totalGeneratedImages,
    trainImagesCount,
    testImagesCount,
    totalResponses,
    responsesFromTrain,
    responsesFromTest,
    totalMisidentifications,
    misidentificationsFromTrain,
    misidentificationsFromTest,
    mostGeneratedImageId,
    mostRespondedImageId,
    mostMisidentifiedImageId,
    mostGeneratedNumber,
    mostMisidentifiedNumber,
    averageResponseTime,
    averageResponsePerDay,
    mostGeneratedImageCount,
    mostMisidentifiedImageCount,
    mostRespondedImageCount,
    mostMisidentifiedNumberCount,
    mostGeneratedNumberCount,
}) {
    const [expandedCards, setExpandedCards] = useState([]);

    const toggleExpandedCard = (card) => {
        setExpandedCards((prevExpandedCards) => {
            if (prevExpandedCards.includes(card)) {
                return prevExpandedCards.filter((c) => c !== card);
            } else {
                return [...prevExpandedCards, card];
            }
        });
    };

    const isCardExpanded = (card) => expandedCards.includes(card);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Overview</h2>}
        >
            <Head title="Overview" />

            {/* Total Overview Section */}
            <div className="max-w-7xl mx-auto mb-8 lg:px-8">
                <h3 className="text-2xl font-semibold mb-4">Generation Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Total Generated Images Card */}
                    <div
                        className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${
                            isCardExpanded('totalGeneratedImages') ? 'h-auto' : 'h-32'
                        }`}
                    >
                        <h3 className="text-lg font-semibold">Total Generated Images</h3>
                        <p className="text-xl font-bold">{totalGeneratedImages}</p>
                        <p className="text-sm">From Train Images: {trainImagesCount}</p>
                        <p className="text-sm">From Test Images: {testImagesCount}</p>
                    </div>

                    {/* Most Generated Image Id Card */}
                    <div
                        className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${
                            isCardExpanded('mostGeneratedImage') ? 'h-auto' : 'h-32'
                        }`}
                    >
                        <h3 className="text-lg font-semibold">Most Generated Image Id:</h3>
                        <p className="text-xl font-bold">{mostGeneratedImageId}</p>
                        <p className="mt-2">{mostGeneratedImageCount} time(s)</p>
                        {isCardExpanded('mostGeneratedImage') && (
                            <div className="flex flex-col items-center">
                                <ImageDetailPopup show={true} onClose={() => toggleExpandedCard('mostGeneratedImage')} rowData={{ image_id: mostGeneratedImageId }} />
                            </div>
                        )}
                        {!isCardExpanded('mostGeneratedImage') && (
                            <button
                                className="text-blue-500 underline mt-2"
                                onClick={() => toggleExpandedCard('mostGeneratedImage')}
                            >
                                Show image
                            </button>
                        )}
                    </div>

                    {/* Most Generated Number Card */}
                    <div
                        className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${
                            isCardExpanded('mostGeneratedNumber') ? 'h-auto' : 'h-32'
                        }`}
                    >
                        <h3 className="text-lg font-semibold">Most Generated Number:</h3>
                        <p className="text-xl font-bold">{mostGeneratedNumber}</p>
                        <p className="mt-2">{mostGeneratedNumberCount} time(s)</p>
                    </div>
                </div>
            </div>

            {/* Misidentification Statistics Section */}
            <div className="max-w-7xl mx-auto mb-8 lg:px-8">
                <h3 className="text-2xl font-semibold mb-4">Misidentification Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                    {/* Total Misidentifications Card */}
                    <div
                        className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${
                            isCardExpanded('totalMisidentifications') ? 'h-auto' : 'h-32'
                        }`}
                    >
                        <h3 className="text-lg font-semibold">Total Misidentifications</h3>
                        <p className="text-xl font-bold">{totalMisidentifications}</p>
                        <p className="text-sm">From Train Images: {misidentificationsFromTrain}</p>
                        <p className="text-sm">From Test Images: {misidentificationsFromTest}</p>
                    </div>

                    {/* Most Misidentified Image Id Card */}
                    <div
                        className={`p-2 bg-white border rounded-md flex flex-col items-center justify-center ${
                            isCardExpanded('mostMisidentifiedImage') ? 'h-auto' : 'h-32'
                        }`}
                    >
                        <h3 className="text-lg font-semibold">Most Misidentified Image Id:</h3>
                        <p className="text-xl font-bold">{mostMisidentifiedImageId}</p>
                        <p className="mt-2">{mostMisidentifiedImageCount} time(s)</p>
                        {isCardExpanded('mostMisidentifiedImage') && (
                            <div className="flex flex-col items-center">
                                <ImageDetailPopup show={true} onClose={() => toggleExpandedCard('mostMisidentifiedImage')} rowData={{ image_id: mostMisidentifiedImageId }} />
                            </div>
                        )}
                        {!isCardExpanded('mostMisidentifiedImage') && (
                            <button
                                className="text-blue-500 underline mt-2"
                                onClick={() => toggleExpandedCard('mostMisidentifiedImage')}
                            >
                                Show image
                            </button>
                        )}
                    </div>

                    {/* Most Misidentified Number Card */}
                    <div
                        className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${
                            isCardExpanded('mostMisidentifiedNumber') ? 'h-auto' : 'h-32'
                        }`}
                    >
                        <h3 className="text-lg font-semibold">Most Misidentified Number:</h3>
                        <p className="text-xl font-bold">{mostMisidentifiedNumber}</p>
                        <p className="mt-2">{mostMisidentifiedNumberCount} time(s)</p>
                    </div>
                </div>
            </div>

            {/* Response Statistics Section */}
            <div className="max-w-7xl mx-auto mb-8 lg:px-8">
                <h3 className="text-2xl font-semibold mb-4">Response Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                    {/* Total Responses Card */}
                    <div
                        className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${
                            isCardExpanded('totalResponses') ? 'h-auto' : 'h-32'
                        }`}
                    >
                        <h3 className="text-lg font-semibold">Total Responses</h3>
                        <p className="text-xl font-bold">{totalResponses}</p>
                        <p className="text-sm">From Train Images: {responsesFromTrain}</p>
                        <p className="text-sm">From Test Images: {responsesFromTest}</p>
                    </div>

                    {/* Most Responded Image Id Card */}
                    <div
                        className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${
                            isCardExpanded('mostRespondedImage') ? 'h-auto' : 'h-32'
                        }`}
                    >
                        <h3 className="text-lg font-semibold">Most Responded Image Id:</h3>
                        <p className="text-xl font-bold">{mostRespondedImageId}</p>
                        <p className="mt-2">{mostRespondedImageCount} time(s)</p>
                        {isCardExpanded('mostRespondedImage') && (
                            <div className="flex flex-col items-center">
                                <ImageDetailPopup show={true} onClose={() => toggleExpandedCard('mostRespondedImage')} rowData={{ image_id: mostRespondedImageId }} />
                            </div>
                        )}
                        {!isCardExpanded('mostRespondedImage') && (
                            <button
                                className="text-blue-500 underline mt-2"
                                onClick={() => toggleExpandedCard('mostRespondedImage')}
                            >
                                Show image
                            </button>
                        )}
                    </div>

                    {/* Average Response Time Card */}
                    <div
                        className={`p-2 bg-white border rounded-md flex flex-col items-center justify-center ${
                            isCardExpanded('averageResponseTime') ? 'h-auto' : 'h-32'
                        }`}
                    >
                        <h3 className="text-lg font-semibold">Average Response Time / Image</h3>
                        <p className="text-xl font-bold">{averageResponseTime} sec</p>
                    </div>

                    {/* Average Response Per Day Card */}
                    <div
                        className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${
                            isCardExpanded('averageResponsePerDay') ? 'h-auto' : 'h-32'
                        }`}
                    >
                        <h3 className="text-lg font-semibold">Average Response / Day</h3>
                        <p className="text-xl font-bold">{averageResponsePerDay}</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
