import { Button, DialogActions, DialogContent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask } from '../../modules/actions/tasks';
import { closeModal } from '../../modules/actions/modal';
import { getModalStateById } from '../../modules/selectors/modal';
import { getSelectedTask } from '../../modules/selectors/selectedTask';
import { RootState } from '../../modules/store/store';
import { Modal } from './Modal';

export const RemoveTaskModal = () => {
  const modalId = 'remove-task';
  const open = useSelector((state: RootState) =>
    getModalStateById(state)(modalId)
  );
  const dispatch = useDispatch();
  const selectedTaskId = useSelector(getSelectedTask);

  const handleClose = () => {
    dispatch(closeModal({ id: modalId }));
  };

  const submitHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (selectedTaskId) {
      dispatch(deleteTask(selectedTaskId) as any);
    }

    handleClose();
  };

  return (
    <Modal open={open} handleClose={handleClose} label={'Видалення задачі'}>
      <form onSubmit={submitHandler}>
        <DialogContent>Ви впевнені, що бажаєте видалити задачу?</DialogContent>
        <DialogActions>
          <Button type="submit">Видалити</Button>
        </DialogActions>
      </form>
    </Modal>
  );
};
