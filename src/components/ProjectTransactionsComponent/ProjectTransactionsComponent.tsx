import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getProjectTransactions } from '../../modules/selectors/transactions';
import { TransactionsSettings } from '../TransactionSettings/TransactionsSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from '../FormElement/Button';

import './ProjectTransactionsComponent.scss';

interface IProps {}

export const ProjectTransactionsComponent: React.FC<IProps> = () => {
  const transactions = useSelector(getProjectTransactions);
  const [showSettings, setShowSettings] = useState(false);
  const totals = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc += transaction.sum;
    } else if (
      transaction.type === 'expenses' ||
      transaction.type === 'transfer'
    ) {
      acc -= transaction.sum;
    }
    return acc;
  }, 0);

  const handleShowingSettings = () => {
    setShowSettings((prevState) => !prevState);
  };

  return (
    <>
      <div className='project-transactions__top'>
        <p
          style={{
            margin: 0,
          }}
        >
          Загалом: {totals}
        </p>
        <Button icon transparent onClick={handleShowingSettings}>
          <SettingsIcon />
        </Button>
      </div>
      {showSettings && <TransactionsSettings />}
    </>
  );
};
