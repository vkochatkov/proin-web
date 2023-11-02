import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PROJECTS_PATH } from '../../config/routes';
import { getValueByTabId } from '../../modules/selectors/tabs';
import { getProjectTransactions } from '../../modules/selectors/transactions';
import { RootState } from '../../modules/store/store';
import { TransactionListSlider } from '../TransactionListSlider/TransactionListSlider';
import { TransactionTabsMenu } from '../TransactionTabsMenu';
import { ITransaction } from '../../modules/types/transactions';
import { Toolbar } from '../Toolbar/Toolbar';
import { useFilter } from '../../hooks/useFilter';
import { FilterModal } from '../Modals/FilterModal';
import { transactionsFilterFunction } from '../../utils/utils';
import { filterNames } from '../../config/contsants';

import './ProjectTransactionsComponent.scss';

interface IProps {}

export const ProjectTransactionsComponent: React.FC<IProps> = () => {
  const transactions: ITransaction[] = JSON.parse(
    JSON.stringify(useSelector(getProjectTransactions)),
  );
  const sortedTransactions = transactions.sort((a, b) => {
    const timestampA = new Date(a.timestamp).getTime();
    const timestampB = new Date(b.timestamp).getTime();
    return timestampB - timestampA;
  });
  const { pid, subprojectId } = useParams();
  const tabValue = useSelector((state: RootState) =>
    getValueByTabId(state)('main-tabs'),
  );
  const transactionsTabValue = useSelector((state: RootState) =>
    getValueByTabId(state)('transaction-tabs'),
  );
  const classifierTab = 'Класифікатори';
  const modalId = 'filter-transaction-modal';
  const {
    searchedItems,
    isSearching,
    selectedSortOption,
    defaultSortOption,
    handleSortByAddingDate,
    handleSortbyLastCommentDate,
    handleSortByDeadline,
    handleSortByDefault,
    handleSearching,
    handleFilterByProjectId,
    filterValue,
  } = useFilter({
    items: sortedTransactions,
    filterFunction: transactionsFilterFunction,
    itemsName: filterNames.projectTransactions,
  });

  const sortableTasks =
    selectedSortOption === defaultSortOption
      ? isSearching
        ? searchedItems
        : sortedTransactions
      : searchedItems;

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

  const handleFilteringTransactions = (
    e: { preventDefault: () => void },
    projectId: string,
  ) => {
    e.preventDefault();

    handleFilterByProjectId(projectId);
  };

  return (
    <>
      <FilterModal
        submitHandler={handleFilteringTransactions}
        modalId={modalId}
        label={'Виберіть фільтр для фінансів'}
        itemsName={filterNames.projectTransactions}
      />
      <div className='project-transactions__top'>
        <p
          style={{
            margin: 0,
          }}
        >
          Загалом: {handleCountTotal()}
        </p>
      </div>
      <Toolbar
        selectedSortOption={selectedSortOption}
        modalId={modalId}
        handleSearching={handleSearching}
        onSortByAddingDate={handleSortByAddingDate}
        onSortByDeadline={handleSortByDeadline}
        onSortByLastCommentDate={handleSortbyLastCommentDate}
        onSortDefaultState={handleSortByDefault}
        filterValue={filterValue}
      />
      <TransactionTabsMenu />
      {tabValue === 'Фінанси' &&
        sortedTransactions &&
        sortedTransactions.length > 0 &&
        transactionsTabValue !== classifierTab && (
          <div>
            <TransactionListSlider
              generateNavigationString={handleGenerateNavigationQuery}
              transactions={sortableTasks}
            />
          </div>
        )}
      {sortedTransactions &&
        sortedTransactions.length === 0 &&
        transactionsTabValue !== classifierTab && (
          <h2 className='project-transactions__empty-field'>
            Транзакції відсутні
          </h2>
        )}
    </>
  );
};
