import { useState } from 'react';
import { DialogActions, DialogContent } from '@mui/material';
import { Modal } from './Modal';
import { Button } from '../FormElement/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getModalStateById } from '../../modules/selectors/modal';
import { RootState } from '../../modules/store/store';
import { closeModal } from '../../modules/actions/modal';
import { TaskStatusSelect } from '../FormComponent/TaskStatusSelect';

interface IProps {
  submitHandler: (e: { preventDefault: () => void }) => void;
  modalId: string;
  label: string;
}

export const FilterModal: React.FC<IProps> = ({
  submitHandler,
  modalId,
  label,
}) => {
  const dispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState<string>('');

  const open = useSelector((state: RootState) =>
    getModalStateById(state)(modalId),
  );

  const handleClose = () => {
    dispatch(closeModal({ id: modalId }));
  };

  return (
    <Modal open={open} handleClose={handleClose} label={label}>
      <form onSubmit={submitHandler}>
        <DialogContent>
          <TaskStatusSelect
            selectedValue={selectedValue}
            valuesArray={[]}
            handleChange={() => console.log('handleChange')}
            isGetStatusLabel
          />
        </DialogContent>
        <DialogActions>
          <Button type='submit'>Фільтрувати</Button>
        </DialogActions>
      </form>
    </Modal>
  );
};
