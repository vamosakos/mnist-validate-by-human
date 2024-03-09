import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import axios from 'axios';

const ImageDetailPopup = ({ show, onClose, rowData }) => {
  const [imageSrc, setImageSrc] = useState(null);

  const handleNoClick = () => {
    onClose({ preserveScroll: true });
  };

  useEffect(() => {
    // Fetch image details based on rowData.image_id
    if (rowData && rowData.image_id) {
      axios.get(`/get-image/${rowData.image_id}`, { responseType: 'blob' })
        .then((response) => {
          const imageUrl = URL.createObjectURL(new Blob([response.data]));
          setImageSrc(imageUrl);
        })
        .catch((error) => {
          console.error('Error fetching image:', error);
        });
    }
  }, [rowData]);

  return (
    <Modal show={show} onClose={onClose} maxWidth="md">
      <div className="p-6 text-center">
        <p>Display image details here</p>
        {imageSrc && <img src={imageSrc} alt="Image" className="max-w-full max-h-80 mx-auto my-4" />}
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
