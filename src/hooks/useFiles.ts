import { useEffect, useState } from 'react';

export const useFiles = () => {
  const [files, setFiles] = useState<File[]>([]);

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

  return {
    files,
    setFiles,
    generateDataUrl,
  };
};
