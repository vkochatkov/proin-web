import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Container } from '@mui/material';
import { TransactionItemList } from '../components/TransactionItemList/TransactionItemList';
import { ITransaction } from '../modules/types/transactions';
import { getUserTransactions } from '../modules/selectors/transactions';
import {
  createUserTransaction,
  fetchUserTransactions,
  saveUserTransactionOrder,
} from '../modules/actions/transactions';
import { getAuth } from '../modules/selectors/user';
import { RemoveTransactionModal } from '../components/Modals/RemoveTransactionModal';
import { useFilter } from '../hooks/useFilter';
import { transactionsFilterFunction } from '../utils/utils';
import { FilterModal } from '../components/Modals/FilterModal';
import { Toolbar } from '../components/Toolbar/Toolbar';
import { filterNames } from '../config/contsants';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '../components/FormElement/Button';
import { useNavigate } from 'react-router-dom';
import { startLoading } from '../modules/actions/loading';
import { getIsLoading } from '../modules/selectors/loading';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';

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
    filterValue,
    handleSortByAddingDate,
    handleSortbyLastCommentDate,
    handleSortByDeadline,
    handleSortByDefault,
    handleSearching,
    handleFilterByProjectId,
  } = useFilter({
    items: transactions,
    filterFunction: transactionsFilterFunction,
    itemsName: filterNames.userTransactions,
  });
  const navigate = useNavigate();
  const isDraggable = selectedSortOption === defaultSortOption && !isSearching;
  const sortableTasks =
    selectedSortOption === defaultSortOption
      ? isSearching
        ? searchedItems
        : transactions
      : searchedItems;
  const isLoading = useSelector(getIsLoading);

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

  const handleCreateTransaction = async () => {
    dispatch(startLoading());
    const {
      transaction: { id },
    } = await dispatch(createUserTransaction() as any);

    navigate(`/transactions/${id}`); //navigate to transaction page
  };

  return (
    <>
      <FilterModal
        submitHandler={handleFilteringTransactions}
        modalId={modalId}
        label={'Виберіть фільтр для фінансів'}
        itemsName={filterNames.userTransactions}
      />
      <Container
        sx={{
          padding: '0 10px',
        }}
      >
        {isLoading && (
          <div className='loading'>
            <LoadingSpinner />
          </div>
        )}
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
              filterValue={filterValue}
            >
              <Button transparent icon onClick={handleCreateTransaction}>
                <AddIcon />
              </Button>
            </Toolbar>
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
