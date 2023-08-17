import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getValueByTabId } from '../../modules/selectors/tabs';
import { getProjectTransactions } from '../../modules/selectors/transactions';
import { RootState } from '../../modules/store/store';
import { TransactionListSlider } from '../TransactionListSlider/TransactionListSlider';
import { TransactionTabsMenu } from '../TransactionTabsMenu';

import './ProjectTransactionsComponent.scss';

interface IProps {}

export const ProjectTransactionsComponent: React.FC<IProps> = () => {
  const transactions = useSelector(getProjectTransactions);
  const { pid, subprojectId } = useParams();
  const tabValue = useSelector((state: RootState) =>
    getValueByTabId(state)('main-tabs'),
  );
  const transactionsTabValue = useSelector((state: RootState) =>
    getValueByTabId(state)('transaction-tabs'),
  );
  const classifierTab = 'Класифікатори';
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

  const handleGenerateNavigationQuery = (id: string) => {
    const query =
      pid && subprojectId
        ? `/project-edit/${pid}/${subprojectId}/transaction/${id}`
        : `/project-edit/${pid}/transaction/${id}`;

    return query;
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
      </div>
      <TransactionTabsMenu />
      {tabValue === 'Фінанси' &&
        transactions &&
        transactions.length > 0 &&
        transactionsTabValue !== classifierTab && (
          <div>
            <TransactionListSlider
              generateNavigationString={handleGenerateNavigationQuery}
              transactions={transactions}
            />
          </div>
        )}
      {transactions &&
        transactions.length === 0 &&
        transactionsTabValue !== classifierTab && (
          <h2 className='project-transactions__empty-field'>
            Транзакції відсутні
          </h2>
        )}
    </>
  );
};
