import React from 'react';
import { ReactNode } from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MenuItem } from '@mui/material';

interface IProps {
  onChange: (e: SelectChangeEvent) => void;
  selectedValue: string;
  children: ReactNode;
  label: string;
  styling?: React.CSSProperties;
}

export const CustomSelect = ({
  onChange,
  selectedValue,
  label,
  children,
  styling = { margin: 1, width: '90%' },
}: IProps) => {
  const customFormControlStyles = {
    margin: '8px 0',
  };
  const noOptionsAvailable = React.Children.count(children) === 0;

  return (
    <FormControl
      variant='standard'
      sx={{ ...styling, ...customFormControlStyles }}
    >
      <InputLabel id='label'>{label}</InputLabel>
      <Select
        labelId='label'
        id='component-simple'
        value={selectedValue}
        label={label}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
        sx={{
          '& .MuiInputBase-input:focus': {
            background: 'transparent',
          },
          ...(label === '' ? { '&.MuiInputBase-root': { marginTop: 0 } } : {}),
        }}
      >
        {noOptionsAvailable ? (
          <MenuItem
            key={''}
            onClick={(e) => e.stopPropagation()}
            value={''}
            disabled
          >
            Пусто. Додайте класифікатор
          </MenuItem>
        ) : (
          children
        )}
      </Select>
    </FormControl>
  );
};
