import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useHttpClient } from '../../hooks/useHttpClient';
import {
  endFilesLoading,
  startFilesLoading,
} from '../../modules/actions/loading';
import { updateProjectFiles } from '../../modules/actions/mainProjects';
import { getAuth } from '../../modules/selectors/user';
import { FileUploader } from '../FormElement/FileUploader';

interface IFileUpload {
  id: string;
  projectId?: string;
}

export const FilesUpload = ({ id, projectId }: IFileUpload) => {
  const { sendRequest } = useHttpClient();
  const [files, setFiles] = useState<File[]>([]);
  const { token } = useSelector(getAuth);
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

  const sendFilesToServer = async (id: string, files: File[]) => {
    const fileDataArray = await Promise.all(
      files.map(async (file) => {
        const dataUrl = await new Promise((resolve) => {
          const fileReader = new FileReader();
          fileReader.onload = () => resolve(fileReader.result as string);
          fileReader.readAsDataURL(file);
        });

        return {
          dataUrl: dataUrl,
          name: file.name,
        };
      })
    );

    try {
      return await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/projects/${id}`,
        'PATCH',
        JSON.stringify({
          files: fileDataArray,
        }),
        {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }
      );
    } catch (err) {
      // handle error
    }
  };

  const pickedHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const pickedFiles = event.target.files;

    if (!pickedFiles?.length) {
      return;
    }

    const newFiles = Array.from(pickedFiles);

    setFiles([...files, ...newFiles]);

    if (projectId && newFiles.length) {
      dispatch(startFilesLoading());
      const res = await sendFilesToServer(projectId, newFiles);
      dispatch(endFilesLoading());
      dispatch(updateProjectFiles({ projectId, files: res.project.files }));
    }
  };

  return (
    <FileUploader
      id={id}
      pickedHandler={pickedHandler}
      buttonLabel={'Додати вкладення'}
      multiple
    />
  );
};
