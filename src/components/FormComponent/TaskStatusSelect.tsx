import { CSSProperties } from 'react';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { CustomSelect } from './CustomSelect';
import { getStatusLabel } from '../../utils/utils';

interface IProps {
  selectedValue: string;
  valuesArray: string[];
  handleChange: (e: SelectChangeEvent) => void;
  isGetStatusLabel?: boolean;
  style?: CSSProperties;
}

export const TaskStatusSelect = ({
  selectedValue,
  isGetStatusLabel = false,
  valuesArray,
  handleChange,
  style,
}: IProps) => {
  return (
    <CustomSelect
      label={''}
      onChange={handleChange}
      selectedValue={selectedValue}
      styling={style}
    >
      {valuesArray.map((value) => (
        <MenuItem
          key={value}
          onClick={(e) => e.stopPropagation()}
          value={value}
        >
          {isGetStatusLabel ? getStatusLabel(value) : value}
        </MenuItem>
      ))}
    </CustomSelect>
  );
};
