import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PROJECTS_PATH } from '../../config/routes';
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

  const handleCountTotal = () => {
    return transactions.reduce((acc, transaction) => {
      switch (transactionsTabValue) {
        case 'Всі':
          if (transaction.type === 'income') {
            acc += transaction.sum;
          } else if (transaction.type === 'expenses') {
            acc -= transaction.sum;
          }
          break;
        case 'Витрати':
          if (transaction.type === 'expenses') {
            acc -= transaction.sum;
          }
          break;
        case 'Доходи':
          if (transaction.type === 'income') {
            acc += transaction.sum;
          }
          break;
        case 'Перекази':
          if (transaction.type === 'transfer') {
            acc += transaction.sum;
          }
          break;
        default:
          break;
      }
      return acc;
    }, 0);
  };

  const handleGenerateNavigationQuery = (id: string) => {
    const query =
      pid && subprojectId
        ? `${PROJECTS_PATH}/${pid}/${subprojectId}/transaction/${id}`
        : `${PROJECTS_PATH}/${pid}/transaction/${id}`;

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
          Загалом: {handleCountTotal()}
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
