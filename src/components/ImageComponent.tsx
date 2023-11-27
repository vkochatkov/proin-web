import React from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ImageComponent = React.memo(
  ({ selectedImages }: { selectedImages: File[] | null }) => {
    if (!selectedImages || selectedImages.length === 0) return null;

    return (
      <div
        className={`upload-image-modal ${
          selectedImages && selectedImages.length <= 2 ? 'short' : ''
        }`}
      >
        {selectedImages &&
          selectedImages.map((image, index) => (
            <div key={uuidv4()}>
              <img
                src={URL.createObjectURL(image)}
                alt={`selected image ${index}`}
                className={'upload-image-modal__img'}
              />
            </div>
          ))}
      </div>
    );
  },
);
