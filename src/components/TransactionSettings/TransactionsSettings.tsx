import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentTransaction } from '../../modules/selectors/currentTransaction';
import { TransactionSelect } from '../FormComponent/TransactionSelect';
import { Button } from '../FormElement/Button';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';

import './TransactionSettings.scss';

export const TransactionsSettings = () => {
  const [selectedEdittingValue, setSelectedEdittingsValue] = useState('');
  const currentTransaction = useSelector(getCurrentTransaction);

  return (
    <>
      <div className='transaction-settings__select-wrapper'>
        <TransactionSelect
          label={'Класифікатор'}
          keyValue={'classifier'}
          selectedValue={selectedEdittingValue}
          setSelectedValue={setSelectedEdittingsValue}
          values={currentTransaction.classifiers}
          styling={{ margin: 1, width: '80%' }}
        />
        <Button
          transparent
          icon
          customClassName='transaction-settings__btn transaction-settings__btn--1 '
        >
          <AddIcon />
        </Button>
        <Button
          transparent
          icon
          customClassName='transaction-settings__btn transaction-settings__btn--2'
        >
          <CreateIcon />
        </Button>
        <Button
          transparent
          icon
          customClassName='transaction-settings__btn transaction-settings__btn--3'
        >
          <DeleteIcon />
        </Button>
      </div>
    </>
  );
};
