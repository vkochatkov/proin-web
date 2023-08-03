import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { saveProjectTransactionsOrder } from '../modules/actions/transactions';
import { getProjectTransactions } from '../modules/selectors/transactions';
import { ITransaction } from '../modules/types/transactions';
import { TransactionItemList } from './TransactionItemList/TransactionItemList';

interface IProps {}

export const ProjectTransactionsComponent: React.FC<IProps> = () => {
  const { pid, subprojectId } = useParams();
  const transactions = useSelector(getProjectTransactions);
  const dispatch = useDispatch();

  const handleChangeTaskItemOrder = (newOrder: ITransaction[]) => {
    if (!pid) return;

    if (!subprojectId) {
      dispatch(saveProjectTransactionsOrder(newOrder, pid) as any);
    } else {
      dispatch(saveProjectTransactionsOrder(newOrder, subprojectId) as any);
    }
  };

  const handleGenerateNavigationQuery = (id: string) => {
    const query =
      pid && subprojectId
        ? `/project-edit/${pid}/${subprojectId}/transaction/${id}`
        : `/project-edit/${pid}/transaction/${id}`;

    return query;
  };

  return (
    <TransactionItemList
      changeOrder={handleChangeTaskItemOrder}
      generateNavigationString={handleGenerateNavigationQuery}
      transactions={transactions}
    />
  );
};
