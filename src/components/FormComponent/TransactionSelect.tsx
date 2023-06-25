import { Dispatch, ReactNode, SetStateAction } from 'react';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { CustomSelect } from './CustomSelect';
import { useDispatch } from 'react-redux';
import { updateTransactionOnServer } from '../../modules/actions/transactions';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCurrentTransaction } from '../../modules/selectors/currentTransaction';

interface IProps {
  setSelectedValue: Dispatch<SetStateAction<string>>;
  selectedValue: string;
  values: string[];
  keyValue: string;
  getTranslation?: (value: string) => ReactNode;
  label: string
}

export const TransactionSelect: React.FC<IProps> = ({
  setSelectedValue,
  selectedValue,
  values,
  keyValue,
  getTranslation,
  label
}) => {
  const dispatch = useDispatch();
  const { transactionId } = useParams();
  const currentTransaction = useSelector(getCurrentTransaction);

  const handleChange = (e: SelectChangeEvent) => {
    if (!transactionId) return;

    const newValue = e.target.value;
    
    setSelectedValue(newValue);    
    dispatch(updateTransactionOnServer(
      { [keyValue]: newValue }, 
      transactionId, 
      currentTransaction.projectId
      ) as any)
  };

  return (
    <CustomSelect
      label={label}
      onChange={handleChange}
      selectedValue={selectedValue}
    >
      {values.map((value) => (
        <MenuItem key={value} onClick={(e) => e.stopPropagation()} value={value}>
          {getTranslation ? getTranslation(value) : value}
        </MenuItem>
      ))}
    </CustomSelect>
  );
};
