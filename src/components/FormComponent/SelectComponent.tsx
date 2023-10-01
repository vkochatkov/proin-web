import { CSSProperties } from 'react';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { CustomSelect } from './CustomSelect';

interface IProps {
  selectedValue: string;
  valuesArray: { id: string; value: string }[];
  handleChange: (e: SelectChangeEvent) => void;
  style?: CSSProperties;
}

export const SelectComponent = ({
  selectedValue,
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
      {valuesArray.map((option) => (
        <MenuItem
          key={option.id}
          onClick={(e) => e.stopPropagation()}
          value={option.id}
        >
          {option.value}
        </MenuItem>
      ))}
    </CustomSelect>
  );
};
