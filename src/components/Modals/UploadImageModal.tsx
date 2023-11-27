import React from 'react';
import { DialogActions, TextareaAutosize } from '@mui/material';
import { Button } from '../FormElement/Button';
import { Modal } from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { getModalStateById } from '../../modules/selectors/modal';
import { RootState } from '../../modules/store/store';
import SendIcon from '@mui/icons-material/Send';
import { changeFormInput } from '../../modules/actions/form';
import { ImageComponent } from '../ImageComponent';

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
  const dispatch = useDispatch();
  const inputId = 'comment';
  const { inputs } = useSelector((state: RootState) => state.formData);

  const handleCloseModal = () => {
    handleClose();
    setSelectedImages([]);
  };

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    dispatch(
      changeFormInput({
        value: e.target.value,
        isValid: true,
        inputId,
      }),
    );
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleCloseModal();
  };

  const renderImages = () => <ImageComponent selectedImages={selectedImages} />;

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
            <TextareaAutosize
              placeholder={'Додайте повідомлення'}
              className='textarea'
              value={
                inputs[inputId] && inputs[inputId].value
                  ? inputs[inputId].value
                  : ''
              }
              onChange={handleChangeInput}
            />
            <Button type='submit' icon transparent>
              <SendIcon />
            </Button>
          </DialogActions>
        </form>
      </Modal>
    </>
  );
};
