import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '../modules/actions/modal';

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
      files.map(async (file) => {
        const dataUrl = await new Promise((resolve) => {
          const fileReader = new FileReader();
          fileReader.onload = () => resolve(fileReader.result as string);
          fileReader.readAsDataURL(file);
        });

        return {
          dataUrl,
          name: file.name,
        };
      })
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
    handleOpenRemoveFileModal
  };
};
