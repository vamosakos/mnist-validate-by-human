// resources/js/Pages/Overview/Overview.jsx
import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';


export default function Overview({ auth,
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
     mostMisidentificatedImageId,
     mostGeneratedNumber,
     mostMisidentifiedNumber,
     averageResponseTime,
     averageResponsePerDay,
     mostGeneratedImageData,
     mostRespondedImageData,
     mostMisidentificatedImageData,
     mostGeneratedImageCount,
     mostMisidentificatedImageCount,
     mostRespondedImageCount,
     mostMisidentifiedNumberCount,
     mostGeneratedNumberCount }) {
  const [expandedCards, setExpandedCards] = useState([]);

  const toggleExpandedCard = (card) => {
    setExpandedCards((prevExpandedCards) => {
      if (prevExpandedCards.includes(card)) {
        // Card is already expanded, so remove it
        return prevExpandedCards.filter((c) => c !== card);
      } else {
        // Card is not expanded, so add it
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
      <div className="max-w-7xl mx-auto mb-8">
        <h3 className="text-2xl font-semibold mb-4">Generation Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Total Generated Images Card */}
            <div className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${isCardExpanded('totalGeneratedImages') ? 'h-auto' : 'h-32'}`}>
              <h3 className="text-lg font-semibold">Total Generated Images</h3>
              <p className="text-xl font-bold">{totalGeneratedImages}</p>
              {isCardExpanded('totalGeneratedImages') && (
                <div>
                  <p className="text-sm">From Train Images: {trainImagesCount}</p>
                  <p className="text-sm">From Test Images: {testImagesCount}</p>
                </div>
              )}
              <button
                className="text-blue-500 underline mt-2"
                onClick={() => toggleExpandedCard('totalGeneratedImages')}
              >
                {isCardExpanded('totalGeneratedImages') ? 'Show less' : 'Show more'}
              </button>
            </div>

            {/* Most Generated Image Id Card */}
            <div className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${isCardExpanded('mostGeneratedImage') ? 'h-auto' : 'h-32'}`}>
                <h3 className="text-lg font-semibold">Most Generated Image Id:</h3>
                <p className="text-xl font-bold">{mostGeneratedImageId}</p>
                {isCardExpanded('mostGeneratedImage') && (
                    <div className="flex flex-col items-center">
                        {mostGeneratedImageData && (
                            <img
                                src={`data:image/png;base64,${mostGeneratedImageData}`}
                                alt="Most Generated Image"
                                className="mt-2"
                            />
                        )}
                        <p className="mt-2">{mostGeneratedImageCount} time(s)</p>
                    </div>
                )}
                <button
                    className="text-blue-500 underline mt-2"
                    onClick={() => toggleExpandedCard('mostGeneratedImage')}
                >
                    {isCardExpanded('mostGeneratedImage') ? 'Show less' : 'Show more'}
                </button>
            </div>


            {/* Most Generated Image Id Card */}
            <div className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${isCardExpanded('mostGeneratedNumber') ? 'h-auto' : 'h-32'}`}>
                <h3 className="text-lg font-semibold">Most Generated Number:</h3>
                <p className="text-xl font-bold">{mostGeneratedNumber}</p>
                <p className="mt-2">{mostGeneratedNumberCount} time(s)</p>
                
            </div>

        </div>
      </div>

      {/* Image Statistics Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h3 className="text-2xl font-semibold mb-4">Misidentification Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {/* Total Misidentifications Card */}
            <div className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${isCardExpanded('totalMisidentifications') ? 'h-auto' : 'h-32'}`}>
              <h3 className="text-lg font-semibold">Total Misidentifications</h3>
              <p className="text-xl font-bold">{totalMisidentifications}</p>
              {isCardExpanded('totalMisidentifications') && (
                <div>
                  <p className="text-sm">From Train Images: {misidentificationsFromTrain}</p>
                  <p className="text-sm">From Test Images: {misidentificationsFromTest}</p>
                </div>
              )}
              <button
                className="text-blue-500 underline mt-2"
                onClick={() => toggleExpandedCard('totalMisidentifications')}
              >
                {isCardExpanded('totalMisidentifications') ? 'Show less' : 'Show more'}
              </button>
            </div>

            {/* Most Misidentificated Image Id Card */}
            <div className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${isCardExpanded('mostMisidentificatedImage') ? 'h-auto' : 'h-32'}`}>
                <h3 className="text-lg font-semibold">Most Misidentificated Image Id:</h3>
                <p className="text-xl font-bold">{mostMisidentificatedImageId}</p>
                {isCardExpanded('mostMisidentificatedImage') && (
                  <div className="flex flex-col items-center">
                      {mostMisidentificatedImageData && (
                          <img
                              src={`data:image/png;base64,${mostMisidentificatedImageData}`}
                              alt="Most Generated Image"
                              className="mt-2"
                          />
                      )}
                      <p className="mt-2">{mostMisidentificatedImageCount} time(s)</p>
                  </div>
              )}
              <button
                  className="text-blue-500 underline mt-2"
                  onClick={() => toggleExpandedCard('mostMisidentificatedImage')}
              >
                  {isCardExpanded('mostMisidentificatedImage') ? 'Show less' : 'Show more'}
              </button>
            </div>

            {/* Most Generated Image Id Card */}
            <div className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${isCardExpanded('mostMisidentificatedNumber') ? 'h-auto' : 'h-32'}`}>
                <h3 className="text-lg font-semibold">Most Misidentificated Number:</h3>
                <p className="text-xl font-bold">{mostMisidentifiedNumber}</p>
                <p className="mt-2">{mostMisidentifiedNumberCount} time(s)</p>
            </div>

        </div>
      </div>

      {/* Image Statistics Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h3 className="text-2xl font-semibold mb-4">Response Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {/* Total Responses Card */}
            <div className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${isCardExpanded('totalResponses') ? 'h-auto' : 'h-32'}`}>
              <h3 className="text-lg font-semibold">Total Responses</h3>
              <p className="text-xl font-bold">{totalResponses}</p>
              {isCardExpanded('totalResponses') && (
                <div>
                  <p className="text-sm">From Train Images: {responsesFromTrain}</p>
                  <p className="text-sm">From Test Images: {responsesFromTest}</p>
                </div>
              )}
              <button
                className="text-blue-500 underline mt-2"
                onClick={() => toggleExpandedCard('totalResponses')}
              >
                {isCardExpanded('totalResponses') ? 'Show less' : 'Show more'}
              </button>
            </div>

            {/* Most Responded Image Id Card */}
            <div className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${isCardExpanded('mostRespondedImage') ? 'h-auto' : 'h-32'}`}>
                <h3 className="text-lg font-semibold">Most Responded Image Id:</h3>
                <p className="text-xl font-bold">{mostRespondedImageId}</p>
                {isCardExpanded('mostRespondedImage') && (
                  <div className="flex flex-col items-center">
                      {mostRespondedImageData && (
                          <img
                              src={`data:image/png;base64,${mostRespondedImageData}`}
                              alt="Most Generated Image"
                              className="mt-2"
                          />
                      )}
                      <p className="mt-2">{mostRespondedImageCount} time(s)</p>
                  </div>
              )}
              <button
                  className="text-blue-500 underline mt-2"
                  onClick={() => toggleExpandedCard('mostRespondedImage')}
              >
                  {isCardExpanded('mostRespondedImage') ? 'Show less' : 'Show more'}
              </button>
            </div>

            {/* Average response time Card */}
            <div className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${isCardExpanded('averageResponseTime') ? 'h-auto' : 'h-32'}`}>
                <h3 className="text-lg font-semibold">Average Response Time / Image</h3>
                <p className="text-xl font-bold">{averageResponseTime} sec</p>
            </div>

            {/* Average response / day Card */}
            <div className={`p-4 bg-white border rounded-md flex flex-col items-center justify-center ${isCardExpanded('averageResponsePerDay') ? 'h-auto' : 'h-32'}`}>
                <h3 className="text-lg font-semibold">Average Response / Day</h3>
                <p className="text-xl font-bold">{averageResponsePerDay}</p>
            </div>

        </div>
      </div>

      {/* Other Cards go here... */}
    </AuthenticatedLayout>
  );
}
