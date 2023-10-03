import { useState } from 'react';
import { DialogActions, DialogContent, SelectChangeEvent } from '@mui/material';
import { Modal } from './Modal';
import { Button } from '../FormElement/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getModalStateById } from '../../modules/selectors/modal';
import { RootState } from '../../modules/store/store';
import { closeModal } from '../../modules/actions/modal';
import { SelectComponent } from '../FormComponent/SelectComponent';
import {
  getAllUserProjects,
  getCurrentProjects,
} from '../../modules/selectors/mainProjects';
import { useParams } from 'react-router-dom';

interface IProps {
  submitHandler: (e: { preventDefault: () => void }, value: string) => void;
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
  const usersProjectNames = useSelector(getAllUserProjects).map((project) => ({
    id: project._id,
    value: project.projectName,
  }));
  const projectNames = useSelector(getCurrentProjects)
    .map((project) => ({ id: project._id, value: project.projectName }))
    .filter((project) => project !== undefined) as {
    id: string;
    value: string;
  }[];
  const { pid } = useParams();

  const open = useSelector((state: RootState) =>
    getModalStateById(state)(modalId),
  );

  const handleClose = () => {
    dispatch(closeModal({ id: modalId }));
    setSelectedValue('');
  };

  const handleChangeValue = (e: SelectChangeEvent) => {
    const value = e.target.value;

    setSelectedValue(value);
  };

  return (
    <Modal open={open} handleClose={handleClose} label={label}>
      <form
        onSubmit={(e) => {
          submitHandler(e, selectedValue);
          dispatch(closeModal({ id: modalId }));
        }}
      >
        <DialogContent>
          <SelectComponent
            selectedValue={selectedValue}
            valuesArray={pid ? projectNames : usersProjectNames}
            handleChange={handleChangeValue}
            style={{
              width: '100%',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button type='submit'>Фільтрувати</Button>
        </DialogActions>
      </form>
    </Modal>
  );
};
