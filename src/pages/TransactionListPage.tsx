import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Container } from '@mui/material';
import { MainNavigation } from '../components/Navigation/MainNavigation';
import { RemoveTaskModal } from '../components/Modals/RemoveTaskModal';
import { TransactionItemList } from '../components/TransactionItemList/TransactionItemList';
import { ITransaction } from '../modules/types/transactions';
import { getUserTransactions } from '../modules/selectors/transactions';
import {
  fetchUserTransactions,
  saveUserTransactionOrder,
} from '../modules/actions/transactions';
import { getAuth } from '../modules/selectors/user';

type Props = {};

const TransactionListPage: React.FC<Props> = () => {
  const transactions = useSelector(getUserTransactions);
  const dispatch = useDispatch();
  const { userId } = useSelector(getAuth);

  useEffect(() => {
    dispatch(fetchUserTransactions() as any);
  }, [dispatch]);

  const handleSaveTransactionItemOrder = (newOrder: ITransaction[]) => {
    dispatch(saveUserTransactionOrder(newOrder, userId) as any);
  };

  const handleGenerateNavigationQuery = (id: string) => {
    return `/transactions/${id}`;
  };

  return (
    <>
      <div
        style={{
          width: '100%',
        }}
      >
        <MainNavigation>
          <div />
        </MainNavigation>
      </div>
      <Container>
        <Card
          sx={{
            '&.MuiPaper-root': {
              backgroundColor: 'rgba(248, 248, 248, 0.8)',
              padding: '0 5px 5px',
            },
          }}
        >
          <TransactionItemList
            transactions={transactions}
            changeOrder={handleSaveTransactionItemOrder}
            generateNavigationString={handleGenerateNavigationQuery}
          />
        </Card>
      </Container>
      <RemoveTaskModal />
    </>
  );
};

export default TransactionListPage;
