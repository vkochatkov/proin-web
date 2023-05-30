import { useState } from 'react';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { CustomSelect } from './CustomSelect';

export const TaskStatusSelect = () => {
  const [selectedValue, setSelectedValue] = useState('');
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
      <MenuItem onClick={(e) => e.stopPropagation()} value={'В роботі'}>
        В роботі
      </MenuItem>
    </CustomSelect>
  );
};
