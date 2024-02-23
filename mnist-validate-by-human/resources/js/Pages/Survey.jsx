import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faRotateRight } from '@fortawesome/free-solid-svg-icons';

export default function Survey() {
    const [imageId, setImageId] = useState(null);
    const [imageLabel, setImageLabel] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTakeTest = async () => {
        try {
            setLoading(true); // Set loading state to true
            const response = await axios.get('/api/generate-image');
            const { image_id, image_label, image_base64 } = response.data;
            setImageId(image_id);
            setImageLabel(image_label);
            setImageBase64(image_base64);

            // Decode the base64 code
            const decodedImage = atob(image_base64);

            // Display the decoded image
            setImageBase64(`data:image/png;base64,${image_base64}`);

            // Reset selected number
            setSelectedNumber(null);
            setLoading(false); // Set loading state to false
        } catch (error) {
            console.error('Error taking the test:', error);
            setLoading(false); // Set loading state to false even if there's an error
        }
    };

    const handleNumberSelection = (number) => {
        setSelectedNumber(number);
    };

    const handleNext = async () => {
        try {
            if (selectedNumber === null) {
                console.log('Please select a number before proceeding.');
                return;
            }
            setLoading(true); // Set loading state to true
            console.log('Image ID:', imageId);
            console.log('Selected Number:', selectedNumber);

            // Send the selected number and image_id to the backend
            const response = await axios.post('/api/save-response', {
                image_id: imageId,
                guest_response: selectedNumber
            });

            console.log('Response from server:', response.data);

            // Fetch the next image
            handleTakeTest();
        } catch (error) {
            console.error('Error saving response:', error);
            setLoading(false); // Set loading state to false even if there's an error
        }
    };


    return (
        <div>
            <h1>Survey</h1>
            <button onClick={handleTakeTest}>Take Test</button>
            <div className="bg-gray-127 min-h-screen flex justify-center items-center">
                <div className="container bg-gray-194 rounded-lg p-12 flex justify-center items-center relative">
                    <FontAwesomeIcon icon={faTimes} style={{ color: "#000000" }} className="absolute top-0 right-2 cursor-pointer fa-2x" onClick={() => alert('Close clicked')} />
                    {imageId && (
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="image-container mb-8 md:mb-0 mr-4">
                                {loading ? (
                                    <FontAwesomeIcon icon={faRotateRight} spin style={{ color: "#000000" }} className="fa-4x"/>
                                ) : (
                                    imageBase64 && <img src={imageBase64} alt="MNIST Image" className="max-w-3/4 max-h-3/4" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <div className="number-buttons grid grid-cols-3 gap-4 mb-8">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0].map((number) => (
                                        number !== null ? (
                                            <button
                                                key={number}
                                                onClick={() => handleNumberSelection(number)}
                                                className={`text-lg rounded-lg py-2 px-9 ${
                                                    selectedNumber === number ? 'bg-gray-127 text-white' : 'bg-gray-43 text-white'
                                                } hover:bg-gray-127`}>
                                                {number}
                                            </button>
                                        ) : (
                                            <div key="empty"></div>
                                        )
                                    ))}
                                </div>
                                <button
                                    className={`text-lg bg-green-custom text-white rounded-full py-2 px-4 hover:bg-emerald-600 ${selectedNumber !== null && selectedNumber !== undefined ? '' : 'opacity-50 cursor-not-allowed'}`}
                                    onClick={handleNext}
                                    disabled={selectedNumber === null || selectedNumber === undefined}>{loading ? 'Loading...' : 'Next'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
