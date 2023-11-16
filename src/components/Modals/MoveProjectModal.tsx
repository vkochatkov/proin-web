import React from 'react';
import { useParams } from 'react-router-dom';
import { DialogActions, DialogContent, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../modules/actions/modal';
import { getModalStateById } from '../../modules/selectors/modal';
import { RootState } from '../../modules/store/store';
import { Button } from '../FormElement/Button';
import {
  getCurrentProject,
  getCurrentProjects,
  getSelectedProjectId,
} from '../../modules/selectors/mainProjects';
import {
  moveToProject,
  selectItemId,
} from '../../modules/actions/mainProjects';
import { Modal } from './Modal';
import { ProjectSelect } from '../FormComponent/ProjectSelect';

export const MoveProjectModal = () => {
  const [selectedId, setSelectedId] = React.useState('');
  const modalId = 'move-project';
  const open = useSelector((state: RootState) =>
    getModalStateById(state)(modalId),
  );
  const currentProjectId = useSelector(getSelectedProjectId);
  const dispatch = useDispatch();
  const { pid } = useParams();
  const projects = useSelector(getCurrentProjects);
  const selectedProjectId = useSelector(getSelectedProjectId);
  const openedProject = useSelector(getCurrentProject);
  const filtered =
    projects &&
    projects
      .filter((project) => project._id !== selectedProjectId)
      .filter((project) => {
        if (!openedProject) return true;
        else return project._id !== openedProject.id;
      });

  const handleClose = () => {
    dispatch(closeModal({ id: modalId }));
    dispatch(selectItemId(''));
    setSelectedId('');
  };

  const submitHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!currentProjectId) {
      dispatch(closeModal({ id: modalId }));
      return;
    }

    dispatch(closeModal({ id: modalId }));
    dispatch(moveToProject(selectedId, currentProjectId, !pid) as any);
    setSelectedId('');
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedId(event.target.value);
  };

  return (
    <>
      <Modal open={open} handleClose={handleClose} label={'Перемістити проект'}>
        <form onSubmit={submitHandler}>
          <DialogContent>
            <ProjectSelect
              handleChange={handleChange}
              selectedValue={selectedId}
              projects={filtered}
              withRootMenuItem
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
