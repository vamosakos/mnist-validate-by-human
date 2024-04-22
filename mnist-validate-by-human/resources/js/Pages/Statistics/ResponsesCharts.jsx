import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ResponsesBarChart from '@/Components/ResponsesBarChart.jsx';
import Dropdown from '@/Components/Dropdown.jsx';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import ImageDetailPopup from '@/Popups/ImageDetailPopup';
import axios from 'axios';

export default function ResponsesCharts({ auth, responses }) {
    const [filteredId, setFilteredId] = useState('');
    const [heatmapImage, setHeatmapImage] = useState(null);
    const [showImage, setShowImage] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef();

    const handleFilterChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue.includes('-')) {
            setError("Negative values are not allowed. Please enter a valid ID.");
            setShowImage(false);
            return;
        }

        if (inputValue.length <= 60) {
            setFilteredId(event.target.value.trim());
            setError(null);
        } else {
            setError("Please enter a session id or an image id with maximum 60 digits.");
        }
        setShowImage(false);
    };

    const handleButtonClick = () => {
        if (!isNaN(filteredId) && filteredId !== '') {
            if (filteredId <= 69999) {
                axios.get(`/get-image/${filteredId}`, { responseType: 'blob' })
                    .then((response) => {
                        setShowImage(true);
                    })
                    .catch((error) => {
                        console.error('Error fetching image:', error);
                    });
            } else {
                setError("Please enter a valid image ID (maximum value is 69.999).");
            }
        } else {
            setError("Please enter a valid image ID.");
        }
    };

    useEffect(() => {
        fetchHeatmapImage();
    }, []);

    const fetchHeatmapImage = async (filteredId = '') => {
        try {
            const response = await axios.get(`/statistics/heatmap/${filteredId}`);
            const { data } = response;
            const heatmapBase64 = data.heatmap_base64;
            setHeatmapImage(heatmapBase64);
        } catch (error) {
            console.error('Error fetching heatmap image:', error.message);
        }
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
                                <Dropdown.Link href={route('statistics.responsesCharts')}>
                                    Responses
                                </Dropdown.Link>
                                <Dropdown.Link href={route('statistics.imageFrequenciesCharts')}>
                                    Image Frequencies
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </h2>
                </div>
            }
        >
            <Head title="Responses Charts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4">
                            <InputLabel value="Search by ID:" className="text-xl font-medium text-gray-700 mr-2" />
                            <TextInput
                                type="text"
                                name="searchInput"
                                id="searchInput"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-1/3"
                                value={filteredId !== null ? filteredId.toString() : ''}
                                onChange={handleFilterChange}
                                ref={inputRef}
                            />
                            <PrimaryButton className="ml-2" disabled={!filteredId} onClick={handleButtonClick}>
                                Show Image
                            </PrimaryButton>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <div className="p-4 bg-white border rounded-md">
                                <h3 className="text-lg font-semibold">Responses Bar Chart</h3>
                                <div className="chart-container">
                                    <ResponsesBarChart responses={responses} filteredId={filteredId} />
                                </div>
                            </div>

                            <div className="p-4 bg-white border rounded-md">
                                <h3 className="text-lg font-semibold">Overall Response Heatmap</h3>
                                <div className="chart-container">
                                    {heatmapImage && <img src={`data:image/png;base64,${heatmapImage}`} alt="Heatmap" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showImage && (
                <ImageDetailPopup
                    show={showImage}
                    onClose={() => setShowImage(false)}
                    rowData={{ image_id: filteredId }}
                />
            )}
        </AuthenticatedLayout>
    );
}
