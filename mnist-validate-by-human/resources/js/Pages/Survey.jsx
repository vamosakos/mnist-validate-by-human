import React, { useState } from 'react';
import axios from 'axios';

export default function Survey() {
    const [imageId, setImageId] = useState(null);
    const [imageLabel, setImageLabel] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [selectedNumber, setSelectedNumber] = useState(null);

    const handleTakeTest = async () => {
        try {
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
        } catch (error) {
            console.error('Error taking the test:', error);
        }
    };

    const handleNumberSelection = (number) => {
        setSelectedNumber(number);
    };

    const handleNext = async () => {
        try {
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
        }
    };    

    return (
        <div>
            <h1>Survey</h1>
            <button onClick={handleTakeTest}>Take Test</button>
            <div class="bg-gray-127 min-h-screen flex justify-center items-center">
            <div class="container bg-gray-194 rounded-lg p-12 flex justify-center items-center">
                {imageId && (
                <div class="flex flex-col md:flex-row items-center">
                    <div class="image-container mb-8 md:mb-0 mr-4">
                        {imageBase64 && <img src={imageBase64} alt="MNIST Image" class="max-w-3/4 max-h-3/4" />}
                    </div>
                    <div class="flex flex-col">
                    <div class="number-buttons grid grid-cols-3 gap-4 mb-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0].map((number) => (
                            number !== null ? (
                                <button 
                                    key={number} 
                                    onClick={() => handleNumberSelection(number)}
                                    class={`text-lg rounded-lg py-2 px-9 ${
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
                            class="text-lg bg-green-custom text-white rounded-full py-2 px-4 hover:bg-emerald-600"
                            onClick={handleNext}>Next
                        </button>
                    </div>
                </div>
                )}
            </div>
            </div>
        </div>
    );     
}
