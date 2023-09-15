import { useState } from 'react';
import { IFile } from '../modules/types/mainProjects';
import { FilesList } from './FilesList/FilesList';
import { ProjectFilesUpload } from './FormComponent/ProjectFilesUpload/ProjectFilesUpload';
import { RemoveModal } from './Modals/RemoveModal';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFile,
  updateFilesOrder,
  updateSubprojectFilesOrder,
} from '../modules/actions/mainProjects';
import { closeModal, openModal } from '../modules/actions/modal';
import { getCurrentProject } from '../modules/selectors/mainProjects';

interface IProps {
  subprojectId?: string;
}

export const FilesComponent: React.FC<IProps> = ({ subprojectId }) => {
  const modalId = 'remove-file';
  const [selectedFile, setSelectedFile] = useState('');
  const { pid } = useParams();
  const dispatch = useDispatch();
  const currentProject = useSelector(getCurrentProject);

  const saveFilesOrder = (order: IFile[]) => {
    if (!pid) return;

    if (!subprojectId) {
      dispatch(updateFilesOrder(pid, order) as any);
    } else {
      dispatch(updateSubprojectFilesOrder(pid, subprojectId, order) as any);
    }
  };

  const handleDeleteFile = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    dispatch(removeFile(selectedFile) as any);
    dispatch(closeModal({ id: modalId }));
  };

  const handleOpenModal = (id: string) => {
    setSelectedFile(id);
    dispatch(openModal({ id: modalId }));
  };
  return (
    <>
      <RemoveModal
        submitHandler={handleDeleteFile}
        modalId={modalId}
        text='файл'
      />
      <FilesList
        files={
          currentProject && currentProject.files ? currentProject.files : []
        }
        saveFilesOrder={saveFilesOrder}
        handleOpenModal={handleOpenModal}
      />
      <ProjectFilesUpload
        id={'files'}
        projectId={currentProject ? currentProject._id : undefined}
      />
    </>
  );
};
