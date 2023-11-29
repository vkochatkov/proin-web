import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { UploadImageModal } from './Modals/UploadImageModal';
import { closeModal, openModal } from '../modules/actions/modal';
import FilePickerRefContext from './ContextProvider/FilesPickerRefProvider';
import { useParams } from 'react-router-dom';
import { FilesContext } from './FilesContextProvider';

interface IProps {
  setIsTextareaActive: Dispatch<SetStateAction<boolean>>;
}

export const CommentImageUploader: React.FC<IProps> = ({
  setIsTextareaActive,
}) => {
  const modalId = 'imageUploadModal';
  const context = useContext(FilesContext);
  const { files = [], setFiles = () => {} } = context || {};
  const dispatch = useDispatch();
  const filePickerRef = useContext(FilePickerRefContext);

  useEffect(() => {
    if (files && files.length > 0) {
      dispatch(
        openModal({
          id: modalId,
        }),
      );
    }
  }, [files]);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const pickedFiles = event.target.files;

    if (!pickedFiles?.length) {
      return;
    }

    const newFiles = Array.from(pickedFiles);

    setFiles([...files, ...newFiles]);
  };

  const handleClose = () => {
    dispatch(closeModal({ id: modalId }));
  };

  return (
    <>
      <input
        type='file'
        accept='image/*'
        onChange={handleImageSelect}
        ref={filePickerRef}
        multiple
        style={{
          display: 'none',
        }}
      />
      <UploadImageModal
        modalId={modalId}
        handleClose={handleClose}
        selectedImages={files}
        setSelectedImages={setFiles}
        setIsTextareaActive={setIsTextareaActive}
      />
    </>
  );
};
