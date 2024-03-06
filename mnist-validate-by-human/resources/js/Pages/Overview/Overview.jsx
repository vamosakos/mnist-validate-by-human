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
     mostGeneratedNumber }) {
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
        <h3 className="text-2xl font-semibold mb-4"></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Total Generated Images Card */}
          <div className={`p-4 bg-white border rounded-md ${isCardExpanded('totalGeneratedImages') ? 'h-auto' : 'h-32'}`}>
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

          {/* Total Responses Card */}
          <div className={`p-4 bg-white border rounded-md ${isCardExpanded('totalResponses') ? 'h-auto' : 'h-32'}`}>
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

          {/* Total Misidentifications Card */}
          <div className={`p-4 bg-white border rounded-md ${isCardExpanded('totalMisidentifications') ? 'h-auto' : 'h-32'}`}>
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
        </div>
      </div>

      {/* Image Statistics Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h3 className="text-2xl font-semibold mb-4">Image Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Most Generated Image Id Card */}
            <div className="p-4 bg-white border rounded-md">
                <h3 className="text-lg font-semibold">Most Generated Image Id</h3>
                <p className="text-xl font-bold">{mostGeneratedImageId}</p>
            </div>

            {/* Most Responded Image Id Card */}
            <div className="p-4 bg-white border rounded-md">
                <h3 className="text-lg font-semibold">Most Responded Image Id</h3>
                <p className="text-xl font-bold">{mostRespondedImageId}</p>
            </div>

            {/* Most Misidentificated Image Id Card */}
            <div className="p-4 bg-white border rounded-md">
                <h3 className="text-lg font-semibold">Most Misidentificated Image Id</h3>
                <p className="text-xl font-bold">{mostMisidentificatedImageId}</p>
            </div>

        </div>
      </div>

      {/* Image Statistics Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h3 className="text-2xl font-semibold mb-4">Number Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Most Generated Image Id Card */}
            <div className="p-4 bg-white border rounded-md">
                <h3 className="text-lg font-semibold">Most generated number</h3>
                <p className="text-xl font-bold">{mostGeneratedNumber}</p>
            </div>

        </div>
      </div>
      

      {/* Other Cards go here... */}
    </AuthenticatedLayout>
  );
}
