import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { CustomSelect } from './CustomSelect';
import { getTask } from '../../modules/selectors/currentProjectTasks';
import { RootState } from '../../modules/store/store';
import { updateTaskById } from '../../modules/actions/currentProjectTasks';
import { useParams } from 'react-router-dom';
import { getStatusLabel } from '../../utils/utils';

interface IProps {
  id: string;
}

export const TaskStatusSelect = ({ id }: IProps) => {
  const currentTask = useSelector((state: RootState) => getTask(state)(id));
  const statusValues = ['new', 'in progress', 'done', 'canceled'];
  const [selectedValue, setSelectedValue] = useState(
    currentTask ? currentTask.status : statusValues[0]
  );
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
      {statusValues.map((status) => (
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
