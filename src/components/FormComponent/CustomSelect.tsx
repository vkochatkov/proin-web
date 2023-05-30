import { ReactNode } from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
  return (
    <FormControl variant="standard" sx={styling}>
      <InputLabel id="label">{label}</InputLabel>
      <Select
        labelId="label"
        id="component-simple"
        value={selectedValue}
        label="Оберіть проект"
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
        sx={{
          '& .MuiInputBase-input:focus': {
            background: 'transparent',
          },
          '&.MuiInputBase-root': {
            marginTop: 0,
          },
        }}
      >
        {children}
      </Select>
    </FormControl>
  );
};
