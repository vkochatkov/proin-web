import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { FilePickerRefProvider } from '../../ContextProvider/FilesPickerRefProvider';
import { FileUploader } from '../../FormElement/FileUploader';

interface IProps {
  id: string;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  sendFilesToServer: (newFiles: File[]) => void;
}

export const FileUploadComponent: React.FC<IProps> = ({
  id,
  setFiles,
  files,
  sendFilesToServer,
}) => {
  const pickedHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const pickedFiles = event.target.files;

    if (!pickedFiles?.length) {
      return;
    }

    const newFiles = Array.from(pickedFiles);

    setFiles([...files, ...newFiles]);

    try {
      sendFilesToServer(newFiles);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <FilePickerRefProvider>
      <FileUploader
        id={id}
        pickedHandler={pickedHandler}
        buttonLabel={'Завантажити файли'}
        multiple
        className='file-uploader__btn'
      />
    </FilePickerRefProvider>
  );
};
