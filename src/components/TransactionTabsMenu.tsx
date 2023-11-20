import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { saveProjectTransactionsOrder } from '../modules/actions/transactions';
import { ITransaction } from '../modules/types/transactions';
import { TabsMenu } from './TabsMenu/TabsMenu';
import { TransactionItemList } from './TransactionItemList/TransactionItemList';
import { TransactionsSettings } from './TransactionSettings/TransactionsSettings';
import { getIsLoading } from '../modules/selectors/loading';
import { LoadingSpinner } from './UIElements/LoadingSpinner';

interface IProps {
  transactions: ITransaction[];
  generateNavigationString: (id: string) => void;
}

export const TransactionTabsMenu: React.FC<IProps> = ({
  transactions,
  generateNavigationString,
}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);

  const { pid } = useParams();
  const tabsId = 'transaction-tabs';
  const expensesTransactions = transactions.filter(
    (transaction) => transaction.type === 'expenses',
  );
  const transferTransactions = transactions.filter(
    (transaction) => transaction.type === 'transfer',
  );
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === 'income',
  );

  const isTransactionsExist = (transactions: ITransaction[]) => {
    if (!transactions) return;

    return transactions && transactions.length > 0;
  };

  const handleChangeItemOrder = (transactions: ITransaction[]) => {
    if (!pid) return;

    dispatch(saveProjectTransactionsOrder(transactions, pid) as any);
  };

  const renderElement = (
    transactions: ITransaction[],
    isDraggable?: boolean,
  ) => (
    <div className='slider-transaction-list__wrapper'>
      {isLoading ? (
        <div className='loading'>
          <LoadingSpinner blue />
        </div>
      ) : (
        <>
          {isTransactionsExist(transactions) ? (
            <>
              <TransactionItemList
                transactions={transactions}
                generateNavigationString={generateNavigationString}
                changeOrder={handleChangeItemOrder}
                isDraggable={isDraggable ? isDraggable : undefined}
              />
            </>
          ) : (
            <h2>Транзакцій немає</h2>
          )}
        </>
      )}
    </div>
  );

  const tabs = [
    {
      label: 'Всі',
      panel: <>{renderElement(transactions, true)}</>,
    },
    {
      label: 'Витрати',
      panel: <>{renderElement(expensesTransactions)}</>,
    },
    {
      label: 'Доходи',
      panel: <>{renderElement(incomeTransactions)}</>,
    },
    {
      label: 'Перекази',
      panel: <>{renderElement(transferTransactions)}</>,
    },
    {
      label: 'Класифікатори',
      panel: (
        <>
          <TransactionsSettings />
        </>
      ),
    },
  ];

  return <TabsMenu tabs={tabs} isTabIndex tabsId={tabsId} />;
};
