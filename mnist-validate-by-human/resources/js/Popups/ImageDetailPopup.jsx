import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import axios from 'axios';

const ImageDetailPopup = ({ show, onClose, rowData }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [imageLabel, setImageLabel] = useState(null);

    const handleNoClick = () => {
        onClose({ preserveScroll: true });
    };

    useEffect(() => {
        if (rowData && rowData.image_id) {
            axios.get(`/get-image/${rowData.image_id}`)
                .then((response) => {
                    setImageSrc(response.data.image_data);
                    setImageLabel(response.data.image_label);
                })
                .catch((error) => {
                    console.error('Error fetching image:', error);
                });
        }
    }, [rowData]);

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6 text-center">
                <p>Image ID: {rowData.image_id}</p>
                {imageSrc && <img src={`data:image/png;base64,${imageSrc}`} alt="Image" className="max-w-full max-h-80 mx-auto my-4" />}
                {rowData && <p>Correct Label: {imageLabel}</p>}
                <div className="mt-4 flex justify-center flex-col items-center">
                    <div className="flex">
                        <button className="bg-red-500 text-white rounded-full font-bold py-2 px-4 hover:bg-red-700" onClick={handleNoClick}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ImageDetailPopup;
