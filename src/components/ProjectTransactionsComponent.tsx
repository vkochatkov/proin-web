import { useSelector } from 'react-redux';
import { getProjectTransactions } from '../modules/selectors/transactions';

interface IProps {}

export const ProjectTransactionsComponent: React.FC<IProps> = () => {
  const transactions = useSelector(getProjectTransactions);
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

  return (
    <>
      <p>Загалом: {totals}</p>
    </>
  );
};
