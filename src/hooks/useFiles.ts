import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '../modules/actions/modal';

export interface FilesContextType {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  generateDataUrl: (files: File[]) => Promise<unknown[]>;
}

export const useFiles = (modalId: string) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFileId, setSelectedFileId] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (!files.length) {
      return;
    }

    files.forEach((file, i) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
    });
  }, [files]);

  const generateDataUrl = async (files: File[]) => {
    return await Promise.all(
      files.map(async (file, i) => {
        const isImageFile = file.type.startsWith('image/');
        const dataUrl = await new Promise((resolve) => {
          const fileReader = new FileReader();
          fileReader.onload = () => resolve(fileReader.result as string);
          fileReader.readAsDataURL(file);
        });

        if (isImageFile) {
          const image = new Image();
          image.src = dataUrl as string;

          return new Promise((resolve) => {
            image.onload = () => {
              const width = image.naturalWidth;
              const height = image.naturalHeight;
              resolve({ dataUrl, name: file.name, width, height });
            };

            image.onerror = () => {
              // Handle image loading errors here
              console.log(`Image ${i + 1} failed to load.`);
              resolve({ dataUrl, name: file.name, width: 0, height: 0 });
            };
          });
        }

        // For non-image files, return dataUrl, name, width, and height as 0
        return { dataUrl, name: file.name, width: 0, height: 0 };
      }),
    );
  };

  const handleOpenRemoveFileModal = (id: string) => {
    setSelectedFileId(id);
    dispatch(openModal({ id: modalId }));
  };

  return {
    files,
    setFiles,
    generateDataUrl,
    selectedFileId,
    setSelectedFileId,
    handleOpenRemoveFileModal,
  };
};
