import { useDispatch, useSelector } from 'react-redux';
import { DialogActions, DialogContent } from '@mui/material';
import { Button } from '../FormElement/Button';
import { closeModal } from '../../modules/actions/modal';
import { RootState } from '../../modules/store/store';
import { getModalStateById } from '../../modules/selectors/modal';
import { Modal } from './Modal';
import { getCurrentTransactionId } from '../../modules/selectors/currentTransaction';
import { deleteTransaction } from '../../modules/actions/transactions';

interface IProps {}

export const RemoveTransactionModal: React.FC<IProps> = () => {
  const modalId = 'remove-transaction';
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) =>
    getModalStateById(state)(modalId),
  );
  const selectedTransactionId = useSelector(getCurrentTransactionId);

  const handleClose = () => {
    dispatch(closeModal({ id: modalId }));
  };

  const submitHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (selectedTransactionId) {
      dispatch(deleteTransaction(selectedTransactionId) as any);
    }

    handleClose();
  };

  return (
    <Modal open={open} handleClose={handleClose} label={'Видалення транзакції'}>
      <form onSubmit={submitHandler}>
        <DialogContent>Ви впевнені, що бажаєте видалити задачу?</DialogContent>
        <DialogActions>
          <Button type='submit'>Видалити</Button>
        </DialogActions>
      </form>
    </Modal>
  );
};
