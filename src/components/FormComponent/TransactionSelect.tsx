import { Dispatch, SetStateAction } from 'react';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { CustomSelect } from './CustomSelect';
import { getTransactionLabel } from '../../utils/utils';

interface IProps {
  setSelectedValue: Dispatch<SetStateAction<string>>;
  selectedValue: string;
  types: string[];
}

export const TransactionSelect: React.FC<IProps> = ({
  setSelectedValue,
  selectedValue,
  types,
}) => {
  const handleChange = (e: SelectChangeEvent) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    // dispatch update transaction
  };

  return (
    <CustomSelect
      label={'Тип транзакції'}
      onChange={handleChange}
      selectedValue={selectedValue}
    >
      {types.map((type) => (
        <MenuItem key={type} onClick={(e) => e.stopPropagation()} value={type}>
          {getTransactionLabel(type)}
        </MenuItem>
      ))}
    </CustomSelect>
  );
};
