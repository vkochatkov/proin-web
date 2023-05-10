import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closePopup } from '../../modules/actions/popup';
import { getPopupStateById } from '../../modules/selectors/popup';
import { RootState } from '../../modules/store/store';
import { Button } from '../FormElement/Button';
import CloseIcon from '@mui/icons-material/Close';
import { SelectComponent } from '../FormComponent/SelectComponent';
import { getSelectedProjectId } from '../../modules/selectors/mainProjects';
import {
  moveToProject,
  selectProject,
} from '../../modules/actions/mainProjects';
import { useParams } from 'react-router-dom';

export const MoveProjectPopup = () => {
  const [selectedProject, setSelectedProject] = React.useState('');
  const popupId = 'move-project';
  const open = useSelector((state: RootState) =>
    getPopupStateById(state)(popupId)
  );
  const currentProjectId = useSelector(getSelectedProjectId);
  const dispatch = useDispatch();
  const { pid } = useParams();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedProject(event.target.value);
  };

  const handleClose = () => {
    dispatch(closePopup({ id: popupId }));
    dispatch(selectProject(''));
    setSelectedProject('');
  };

  const submitHandler = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!currentProjectId) {
      dispatch(closePopup({ id: popupId }));
      return;
    }

    await dispatch(
      moveToProject(selectedProject, currentProjectId, !pid) as any
    );
    dispatch(closePopup({ id: popupId }));
    setSelectedProject('');
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '400px',
            padding: '10px 0',
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: '1px solid #ccc',
            margin: '0 1rem',
            padding: '5px 0',
            display: 'flex',
            justifyContent: 'space-between',
            minWidth: '230px',
          }}
        >
          <span>Перемістити проект</span>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              padding: '0',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
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
      </Dialog>
    </>
  );
};
