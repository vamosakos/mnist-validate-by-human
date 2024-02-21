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
            {imageId && (
                <div>
                    <p>Image ID: {imageId}</p>
                    <p>Image Label: {imageLabel}</p>
                    {imageBase64 && <img src={imageBase64} alt="MNIST Image" />}
                    <div>
                        <p>Select a number:</p>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                            <button key={number} onClick={() => handleNumberSelection(number)}>
                                {number}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleNext}>Next</button>
                </div>
            )}
        </div>
    );
}