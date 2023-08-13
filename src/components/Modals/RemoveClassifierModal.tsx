import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../FormElement/Button';
import { Modal } from './Modal';
import { DialogActions, DialogContent } from '@mui/material';
import { RootState } from '../../modules/store/store';
import { getModalStateById } from '../../modules/selectors/modal';
import { closeModal } from '../../modules/actions/modal';

interface IProps {
  submitHandler: (event: { preventDefault: () => void }) => void;
}

export const RemoveClassifierModal: React.FC<IProps> = ({ submitHandler }) => {
  const modalId = 'remove-classifier';
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) =>
    getModalStateById(state)(modalId),
  );

  const handleClose = () => {
    dispatch(closeModal({ id: modalId }));
  };

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      label={'Видалити класифікатор'}
    >
      <form onSubmit={submitHandler}>
        <DialogContent>
          Ви впевнені, що бажаєте видалити класифікатор?
        </DialogContent>
        <DialogActions>
          <Button type='submit'>Видалити</Button>
        </DialogActions>
      </form>
    </Modal>
  );
};
