import React from 'react';
import { DialogActions } from '@mui/material';
import { Button } from '../FormElement/Button';
import { Modal } from './Modal';
import { useSelector } from 'react-redux';
import { getModalStateById } from '../../modules/selectors/modal';
import { RootState } from '../../modules/store/store';
import { v4 as uuidv4 } from 'uuid';

import './UploadImageModal.scss';

interface IProps {
  modalId: string;
  handleClose: () => void;
  selectedImages: File[] | null;
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
}

export const UploadImageModal: React.FC<IProps> = ({
  modalId,
  handleClose,
  selectedImages,
  setSelectedImages,
}) => {
  const open = useSelector((state: RootState) =>
    getModalStateById(state)(modalId),
  );

  const handleCloseModal = () => {
    handleClose();
    setSelectedImages([]);
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleCloseModal();
  };

  const renderImages = () => {
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
  };

  return (
    <>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        label={'Завантажити зображення'}
      >
        <form onSubmit={submitHandler}>
          {renderImages()}
          <DialogActions>
            <Button type='submit'>Завантажити</Button>
          </DialogActions>
        </form>
      </Modal>
    </>
  );
};
