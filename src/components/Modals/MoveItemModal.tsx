import React from 'react';
import { DialogActions, DialogContent, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../modules/actions/modal';
import { getModalStateById } from '../../modules/selectors/modal';
import { RootState } from '../../modules/store/store';
import { Button } from '../FormElement/Button';
import { getCurrentProjects } from '../../modules/selectors/mainProjects';
import { selectItemId } from '../../modules/actions/mainProjects';
import { Modal } from './Modal';
import { ProjectSelect } from '../FormComponent/ProjectSelect';
import { Project } from '../../modules/types/mainProjects';

interface IProps {
  modalId: string;
  handleSubmit: (projectId: string) => void;
  currentProjectId: string;
}

const flattenProjects = (projects: Project[]): Project[] => {
  const flattened: Project[] = [];

  const flattenRecursive = (project: Project) => {
    flattened.push(project);

    if (project.subProjects && project.subProjects.length > 0) {
      project.subProjects.forEach(flattenRecursive);
    }
  };

  projects.forEach(flattenRecursive);

  return flattened;
};

export const MoveItemModal: React.FC<IProps> = ({
  modalId,
  handleSubmit,
  currentProjectId,
}) => {
  const [selectedProjectId, setSelectedProjectId] = React.useState('');
  const projects = useSelector(getCurrentProjects);
  const allProjects = flattenProjects(projects);
  const filteredProjects = allProjects.filter(
    (project) => project._id !== currentProjectId,
  );

  const open = useSelector((state: RootState) =>
    getModalStateById(state)(modalId),
  );
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal({ id: modalId }));
    dispatch(selectItemId(''));
    setSelectedProjectId('');
  };

  const submitHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    handleSubmit(selectedProjectId);
    dispatch(closeModal({ id: modalId }));
    setSelectedProjectId('');
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedProjectId(event.target.value);
  };

  return (
    <>
      <Modal open={open} handleClose={handleClose} label={'Перемістити проект'}>
        <form onSubmit={submitHandler}>
          <DialogContent>
            <ProjectSelect
              handleChange={handleChange}
              selectedValue={selectedProjectId}
              projects={filteredProjects}
            />
          </DialogContent>
          <DialogActions>
            <Button type='submit'>Перемістити</Button>
          </DialogActions>
        </form>
      </Modal>
    </>
  );
};
