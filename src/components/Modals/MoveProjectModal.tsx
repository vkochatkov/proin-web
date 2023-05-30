import React from 'react';
import { useParams } from 'react-router-dom';
import { DialogActions, DialogContent, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../modules/actions/modal';
import { getModalStateById } from '../../modules/selectors/modal';
import { RootState } from '../../modules/store/store';
import { Button } from '../FormElement/Button';
import { getSelectedProjectId } from '../../modules/selectors/mainProjects';
import {
  moveToProject,
  selectProject,
} from '../../modules/actions/mainProjects';
import { Modal } from './Modal';
import { ProjectSelect } from '../FormComponent/ProjectSelect';

export const MoveProjectModal = () => {
  const [selectedProject, setSelectedProject] = React.useState('');
  const popupId = 'move-project';
  const open = useSelector((state: RootState) =>
    getModalStateById(state)(popupId)
  );
  const currentProjectId = useSelector(getSelectedProjectId);
  const dispatch = useDispatch();
  const { pid } = useParams();

  const handleClose = () => {
    dispatch(closeModal({ id: popupId }));
    dispatch(selectProject(''));
    setSelectedProject('');
  };

  const submitHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!currentProjectId) {
      dispatch(closeModal({ id: popupId }));
      return;
    }

    dispatch(closeModal({ id: popupId }));
    dispatch(moveToProject(selectedProject, currentProjectId, !pid) as any);
    setSelectedProject('');
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedProject(event.target.value);
  };

  return (
    <>
      <Modal open={open} handleClose={handleClose} label={'Перемістити проект'}>
        <form onSubmit={submitHandler}>
          <DialogContent>
            <ProjectSelect
              handleChange={handleChange}
              selectedValue={selectedProject}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit">Перемістити</Button>
          </DialogActions>
        </form>
      </Modal>
    </>
  );
};
