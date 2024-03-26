import React, { useState, useEffect } from 'react';

const ImageDisplay = ({ imageId, showImage }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (showImage && imageId !== null) {
      fetchImage(imageId);
    }
  }, [imageId, showImage]);

  const fetchImage = async (id) => {
    try {
      const response = await fetch(`/get-image/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const imageData = await response.blob();
      setImage(URL.createObjectURL(imageData));
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  return (
    <div>
      {showImage && image && <img src={image} alt="Filtered Image" />}
    </div>
  );
};

export default ImageDisplay;
