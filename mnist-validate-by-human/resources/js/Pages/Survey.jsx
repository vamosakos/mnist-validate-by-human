import React, { useState } from 'react';
import axios from 'axios';

export default function Survey() {
    const [imageId, setImageId] = useState(null);
    const [imageLabel, setImageLabel] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);

    const handleTakeTest = async () => {
        try {
            const response = await axios.get('/api/generate-image');
            const { image_id, image_label, image_base64 } = response.data;
            setImageId(image_id);
            setImageLabel(image_label);
            setImageBase64(image_base64);

            // Dekódoljuk a base64 kódot
            const decodedImage = atob(image_base64);

            // Most megjelenítjük a dekódolt képet
            setImageBase64(`data:image/png;base64,${image_base64}`);
        } catch (error) {
            console.error('Error taking the test:', error);
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
                </div>
            )}
        </div>
    );
}
