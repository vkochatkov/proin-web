import { useState } from 'react';
import { useSelector } from 'react-redux';
import { IFile } from '../../modules/types/mainProjects';
import { LoadingSpinner } from '../UIElements/LoadingSpinner';
import { getIsFilesLoading } from '../../modules/selectors/loading';
import { Button } from '../FormElement/Button';
import { Gallery } from 'react-photoswipe-gallery';
import { File } from '../File/File';
import Grid from '../Grid';

import './FilesList.scss';

interface IProps {
  files: IFile[];
  saveFilesOrder: (order: IFile[]) => void;
  handleOpenModal: (id: string) => void;
}

export const FilesList = ({ files, handleOpenModal }: IProps) => {
  const isLoading = useSelector(getIsFilesLoading);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const filesToShow = showAllFiles ? files : files ? files.slice(0, 20) : [];

  const toggleShowAllFiles = () => {
    setShowAllFiles(!showAllFiles);
  };

  return (
    <>
      <Gallery>
        <Grid>
          {filesToShow &&
            filesToShow.map((file, index) => (
              <File
                key={file.id}
                name={file.name}
                url={file.url}
                id={file.id}
                width={file.width ? file.width : 1024}
                height={file.height ? file.height : 768}
                onDelete={handleOpenModal}
              />
            ))}
        </Grid>
      </Gallery>

      {files.length > 20 && (
        <Button onClick={toggleShowAllFiles} customClassName='files-list__btn'>
          {showAllFiles ? 'Показати менше' : 'Показати більше'}
        </Button>
      )}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner blue />
        </div>
      )}
    </>
  );
};
