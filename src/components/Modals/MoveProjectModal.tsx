import React from 'react';
import { DialogActions, DialogContent, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../modules/actions/modal';
import { getModalStateById } from '../../modules/selectors/modal';
import { RootState } from '../../modules/store/store';
import { Button } from '../FormElement/Button';
import { SelectComponent } from '../FormComponent/SelectComponent';
import { getSelectedProjectId } from '../../modules/selectors/mainProjects';
import {
  moveToProject,
  selectProject,
} from '../../modules/actions/mainProjects';
import { useParams } from 'react-router-dom';
import { Modal } from './Modal';

export const MoveProjectModal = () => {
  const [selectedProject, setSelectedProject] = React.useState('');
  const popupId = 'move-project';
  const open = useSelector((state: RootState) =>
    getModalStateById(state)(popupId)
  );
  const currentProjectId = useSelector(getSelectedProjectId);
  const dispatch = useDispatch();
  const { pid } = useParams();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedProject(event.target.value);
  };

  const handleClose = () => {
    dispatch(closeModal({ id: popupId }));
    dispatch(selectProject(''));
    setSelectedProject('');
  };

  const submitHandler = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!currentProjectId) {
      dispatch(closeModal({ id: popupId }));
      return;
    }

    await dispatch(
      moveToProject(selectedProject, currentProjectId, !pid) as any
    );
    dispatch(closeModal({ id: popupId }));
    setSelectedProject('');
  };

  return (
    <>
      <Modal open={open} handleClose={handleClose} label={'Перемістити проект'}>
        <form onSubmit={submitHandler}>
          <DialogContent>
            <SelectComponent
              selectedProject={selectedProject}
              onChange={handleChange}
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
