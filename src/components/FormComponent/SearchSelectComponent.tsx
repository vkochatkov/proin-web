import React, { CSSProperties, useEffect, useState } from 'react';
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
  const EMPTY = 'пусто';
  const storedOptionsName = 'options';
  const storedOptions = JSON.parse(
    sessionStorage.getItem(storedOptionsName) || '[]',
  );
  const [options, setOptions] = useState<{ id: string; value: string }[]>(
    storedOptions || valuesArray,
  );

  useEffect(() => {
    const emptyOption = options.find((option) => option.id === EMPTY);

    if (!emptyOption) {
      setOptions((prevState) => {
        const updatedState = [
          {
            id: EMPTY,
            value: EMPTY,
          },
          ...prevState,
        ];

        sessionStorage.setItem(storedOptionsName, JSON.stringify(updatedState));

        return updatedState;
      });
    }
  }, [options]);

  return (
    <Autocomplete
      value={options.find((option) => option.id === selectedValue) || null}
      options={options}
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
