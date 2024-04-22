import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Feedback({ feedbacks, auth }) {
    const [currentPage, setCurrentPage] = useState(1);
    const feedbacksPerPage = 10;

    const indexOfLastFeedback = currentPage * feedbacksPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
    const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);

    const totalFeedbacks = feedbacks.length;

    const paginate = (direction) => {
        setCurrentPage((prevPage) => {
            if (direction === 'next' && indexOfLastFeedback < totalFeedbacks) {
                return prevPage + 1;
            }
            if (direction === 'prev' && prevPage !== 1) {
                return prevPage - 1;
            }
            return prevPage;
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Feedbacks</h2>}
        >
            <Head title="Feedbacks" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-lg font-semibold mb-4">Feedbacks</h2>
                            {currentFeedbacks.map((feedback) => (
                                <div key={feedback.id} className="bg-gray-100 p-4 rounded-lg mb-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="font-semibold">{feedback.comment}</p>
                                            <p className="text-gray-500">{feedback.session_id}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">{feedback.formatted_created_at}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center mt-4">
                                <p>{`${totalFeedbacks} / ${currentFeedbacks.length}`}</p>
                                <div>
                                    <button
                                        className={`px-3 py-1 mx-1 focus:outline-none ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                                        onClick={() => paginate('prev')}
                                        disabled={currentPage === 1}
                                    >
                                        {'<'}
                                    </button>
                                    <button
                                        className={`px-3 py-1 mx-1 focus:outline-none ${indexOfLastFeedback >= totalFeedbacks ? 'cursor-not-allowed opacity-50' : ''}`}
                                        onClick={() => paginate('next')}
                                        disabled={indexOfLastFeedback >= totalFeedbacks}
                                    >
                                        {'>'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
