import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProjectTransactions } from '../modules/selectors/transactions';
import { ITransaction } from '../modules/types/transactions';
import { TransactionItemList } from './TransactionItemList/TransactionItemList';

export const ProjectTransactionsComponent: React.FC = () => {
  const { pid } = useParams();
  const transactions = useSelector(getProjectTransactions);

  const handleChangeTaskItemOrder = (newOrder: ITransaction[]) => {
    if (!pid) return;

    // dispatch(changeTasksOrder(pid, newOrder) as any);
  };

  const handleGenerateNavigationQuery = (id: string) => {
    return `/project-edit/${pid}/transaction/${id}`;
  };

  return (
    <TransactionItemList
      changeOrder={handleChangeTaskItemOrder}
      generateNavigationString={handleGenerateNavigationQuery}
      transactions={transactions}
    />
  );
};
