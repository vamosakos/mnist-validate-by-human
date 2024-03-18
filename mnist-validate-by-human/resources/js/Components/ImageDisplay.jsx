import React, { useState, useEffect } from 'react';

const ImageDisplay = ({ imageId }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (imageId !== null) {
      fetchImage(imageId);
    }
  }, [imageId]);

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
      {image && <img src={image} alt="Filtered Image" />}
    </div>
  );
};

export default ImageDisplay;
