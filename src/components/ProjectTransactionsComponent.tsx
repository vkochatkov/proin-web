import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { saveProjectTransactionsOrder } from '../modules/actions/transactions';
import { getProjectTransactions } from '../modules/selectors/transactions';
import { ITransaction } from '../modules/types/transactions';
import { TransactionItemList } from './TransactionItemList/TransactionItemList';

export const ProjectTransactionsComponent: React.FC = () => {
  const { pid } = useParams();
  const transactions = useSelector(getProjectTransactions);
  const dispatch = useDispatch();

  const handleChangeTaskItemOrder = (newOrder: ITransaction[]) => {
    if (!pid) return;

    dispatch(saveProjectTransactionsOrder(newOrder, pid) as any);
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
