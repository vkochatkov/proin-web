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
import { useFiles } from '../hooks/useFiles';
import { useParams } from 'react-router-dom';

interface IProps {
  setIsTextareaActive: Dispatch<SetStateAction<boolean>>;
}

export const CommentImageUploader: React.FC<IProps> = ({
  setIsTextareaActive,
}) => {
  const modalId = 'imageUploadModal';
  const { files, setFiles, generateDataUrl } = useFiles(modalId);
  const dispatch = useDispatch();
  const filePickerRef = useContext(FilePickerRefContext);
  const { pid } = useParams();

  useEffect(() => {
    if (files && files.length > 0) {
      dispatch(
        openModal({
          id: modalId,
        }),
      );
    }
  }, [files]);

  const sendFilesToServer = async (id: string, files: File[]) => {
    try {
      const fileDataArray = await generateDataUrl(files);
      console.log(fileDataArray);
      //   return await request
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const pickedFiles = event.target.files;

    if (!pickedFiles?.length) {
      return;
    }

    const newFiles = Array.from(pickedFiles);

    setFiles([...files, ...newFiles]);

    if (pid) {
      sendFilesToServer(pid, newFiles);
    }
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
        modalId='imageUploadModal'
        handleClose={handleClose}
        selectedImages={files}
        setSelectedImages={setFiles}
        setIsTextareaActive={setIsTextareaActive}
      />
    </>
  );
};
