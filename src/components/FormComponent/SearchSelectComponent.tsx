import React, { CSSProperties } from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface IProps {
  selectedValue: string;
  valuesArray: { id: string; value: string }[];
  handleChange: (value: string) => void;
  style?: CSSProperties;
}

export const SearchSelectComponent: React.FC<IProps> = ({
  selectedValue,
  valuesArray,
  handleChange,
}) => {
  return (
    <Autocomplete
      value={valuesArray.find((option) => option.id === selectedValue) || null}
      options={valuesArray}
      getOptionLabel={(option) => option.value}
      onChange={(_, newValue) => {
        if (newValue) {
          handleChange(newValue.value);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Select an option'
          variant='outlined'
          fullWidth
        />
      )}
    />
  );
};
