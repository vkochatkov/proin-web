import { useSelector } from 'react-redux';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { IFile } from '../modules/types/mainProjects';
import { File } from './File';
import { useState } from 'react';
import { LoadingSpinner } from './UIElements/LoadingSpinner';
import { getIsFilesLoading } from '../modules/selectors/loading';
import { Button } from './FormElement/Button';
import { useDispatch } from 'react-redux';
import { removeFile } from '../modules/actions/mainProjects';

import './FilesList.scss';

export const FilesList = () => {
  const currentProject = useSelector(getCurrentProject);
  const isLoading = useSelector(getIsFilesLoading);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteFile = (id: string) => {
    dispatch(removeFile(id) as any);
  };

  const filesToShow = showAllFiles
    ? currentProject?.files
    : currentProject?.files
    ? currentProject?.files.slice(0, 4)
    : [];

  const toggleShowAllFiles = () => {
    setShowAllFiles(!showAllFiles);
  };

  return (
    <>
      {filesToShow &&
        filesToShow.map((file: IFile) => (
          <File
            key={file.id}
            name={file.name}
            url={file.url}
            id={file.id}
            onDelete={handleDeleteFile}
          />
        ))}
      {currentProject?.files && currentProject?.files.length > 4 && (
        <Button onClick={toggleShowAllFiles} customClassName="files-list__btn">
          {showAllFiles ? 'Показати менше' : 'Показати більше'}
        </Button>
      )}
      {isLoading && (
        <div className="center">
          <LoadingSpinner blue />
        </div>
      )}
    </>
  );
};
