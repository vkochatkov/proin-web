import { Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { CustomSelect } from './CustomSelect';
import { updateTaskById } from '../../modules/actions/currentProjectTasks';
import { useParams } from 'react-router-dom';
import { getStatusLabel } from '../../utils/utils';

interface IProps {
  id: string;
  selectedValue: string;
  setSelectedValue: Dispatch<SetStateAction<string>>;
  valuesArray: string[];
}

export const TaskStatusSelect = ({
  id,
  selectedValue,
  setSelectedValue,
  valuesArray,
}: IProps) => {
  const dispatch = useDispatch();
  const { pid } = useParams();

  const handleChange = (e: SelectChangeEvent) => {
    const newValue = e.target.value;

    setSelectedValue(newValue);

    if (!pid) return;

    dispatch(updateTaskById(newValue, pid, id) as any);
  };

  return (
    <CustomSelect
      label={''}
      onChange={handleChange}
      selectedValue={selectedValue}
      styling={{ width: '45%' }}
    >
      {valuesArray.map((status) => (
        <MenuItem
          key={status}
          onClick={(e) => e.stopPropagation()}
          value={status}
        >
          {getStatusLabel(status)}
        </MenuItem>
      ))}
    </CustomSelect>
  );
};
