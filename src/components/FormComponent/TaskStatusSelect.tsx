import { useState } from 'react';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { CustomSelect } from './CustomSelect';
import { useSelector } from 'react-redux';
import { getTask } from '../../modules/selectors/currentProjectTasks';
import { RootState } from '../../modules/store/store';

interface IProps {
  id: string;
}

interface IStatusLabels {
  [key: string]: string;
}

const statusLabels: IStatusLabels = {
  new: 'Новий',
  'in progress': 'У процесі',
  done: 'Зроблено',
  canceled: 'Відмінено',
};

export const TaskStatusSelect = ({ id }: IProps) => {
  const currentTask = useSelector((state: RootState) => getTask(state)(id));
  const statusValues = ['new', 'in progress', 'done', 'canceled'];
  const [selectedValue, setSelectedValue] = useState(
    currentTask ? currentTask.status : statusValues[0]
  );

  const handleChange = (e: SelectChangeEvent) => {
    setSelectedValue(e.target.value);
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
          {statusLabels[status]}
        </MenuItem>
      ))}
    </CustomSelect>
  );
};
