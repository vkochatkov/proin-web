import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFiles } from '../../../hooks/useFiles';
import {
  endFilesLoading,
  startFilesLoading,
} from '../../../modules/actions/loading';
import { updateProjectFiles } from '../../../modules/actions/mainProjects';
import { Api } from '../../../utils/API';
import { FileUploader } from '../../FormElement/FileUploader';

import './ProjectFilesUpload.scss';

interface IFileUpload {
  id: string;
  projectId?: string;
}

export const ProjectFilesUpload = ({ id, projectId }: IFileUpload) => {
  const { files, setFiles, generateDataUrl } = useFiles();
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
    const fileDataArray = await generateDataUrl(files);

    try {
      return await Api.Projects.patch({ files: fileDataArray }, id);
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
      className="file-uploader__btn"
    />
  );
};
