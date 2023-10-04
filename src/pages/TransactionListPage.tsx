import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Container } from '@mui/material';
import { TransactionItemList } from '../components/TransactionItemList/TransactionItemList';
import { ITransaction } from '../modules/types/transactions';
import { getUserTransactions } from '../modules/selectors/transactions';
import {
  fetchUserTransactions,
  saveUserTransactionOrder,
} from '../modules/actions/transactions';
import { getAuth } from '../modules/selectors/user';
import { RemoveTransactionModal } from '../components/Modals/RemoveTransactionModal';
import { useFilter } from '../hooks/useFilter';
import { transactionsFilterFunction } from '../utils/utils';
import { FilterModal } from '../components/Modals/FilterModal';
import { Toolbar } from '../components/Toolbar/Toolbar';

type Props = {};

const TransactionListPage: React.FC<Props> = () => {
  const transactions = useSelector(getUserTransactions);
  const dispatch = useDispatch();
  const { userId } = useSelector(getAuth);
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
  } = useFilter({
    items: transactions,
    filterFunction: transactionsFilterFunction,
  });
  const isDraggable = selectedSortOption === defaultSortOption && !isSearching;
  const sortableTasks =
    selectedSortOption === defaultSortOption
      ? isSearching
        ? searchedItems
        : transactions
      : searchedItems;

  useEffect(() => {
    dispatch(fetchUserTransactions() as any);
  }, [dispatch]);

  const handleSaveTransactionItemOrder = (newOrder: ITransaction[]) => {
    dispatch(saveUserTransactionOrder(newOrder, userId) as any);
  };

  const handleGenerateNavigationQuery = (id: string) => {
    return `/transactions/${id}`;
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
      />
      <Container
        sx={{
          padding: '0 10px',
        }}
      >
        {transactions.length > 0 && (
          <Card
            sx={{
              '&.MuiPaper-root': {
                backgroundColor: 'rgba(248, 248, 248, 0.8)',
                padding: '0 5px 5px',
              },
            }}
          >
            <Toolbar
              selectedSortOption={selectedSortOption}
              modalId={modalId}
              handleSearching={handleSearching}
              onSortByAddingDate={handleSortByAddingDate}
              onSortByDeadline={handleSortByDeadline}
              onSortByLastCommentDate={handleSortbyLastCommentDate}
              onSortDefaultState={handleSortByDefault}
            />
            <TransactionItemList
              transactions={sortableTasks}
              changeOrder={handleSaveTransactionItemOrder}
              generateNavigationString={handleGenerateNavigationQuery}
              isDraggable={isDraggable}
            />
          </Card>
        )}
      </Container>
      <RemoveTransactionModal />
    </>
  );
};

export default TransactionListPage;
