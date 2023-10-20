import React, { CSSProperties } from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface IProps {
  selectedValue: string;
  valuesArray: { id: string; value: string }[];
  handleChange: (value: string) => void;
  style?: CSSProperties;
  label: string;
}

export const SearchSelectComponent: React.FC<IProps> = ({
  selectedValue,
  valuesArray,
  handleChange,
  label,
}) => {
  return (
    <Autocomplete
      value={valuesArray.find((option) => option.id === selectedValue) || null}
      options={valuesArray}
      getOptionLabel={(option) => option.value}
      onChange={(_, newValue) => {
        if (newValue) {
          handleChange(newValue.id);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} variant='outlined' fullWidth />
      )}
    />
  );
};
