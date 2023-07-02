import { Dispatch } from 'redux';
import { createAction } from 'redux-act';
import { Api } from '../../utils/API';
import ApiErrors from '../../utils/API/APIErrors';
import { updateObjects } from '../../utils/utils';
import { RootState } from '../store/store';
import { ITransaction } from '../types/transactions';
import { changeSnackbarState } from './snackbar';

export const setCurrentTransaction = createAction<ITransaction>('setCurrentTransaction');
export const fetchProjectTransactionsSuccess =
  createAction<{ transactions: ITransaction[] }>('fetchProjectTransactionsSuccess');
export const updateProjectTransactionsSuccess =
  createAction<{ transactions: ITransaction[] }>('updateProjectTransactionsSuccess');
export const updateUserTransactionsSuccess =
  createAction<{ transactions: ITransaction[] }>('updateUserTransactionsSuccess');

const updateTransactionStates = ({
  transactions,
  transaction,
  // userTransactions,
  dispatch,
}: {
  transactions: ITransaction[];
  transaction: ITransaction;
  // userTransactions: ITransaction[];
  dispatch: Dispatch;
}) => {
  const updatedTransactions = updateObjects(transactions, transaction);
  // const updatedUserTransactions = updateObjects(userTransactions, transaction);

  dispatch(updateProjectTransactionsSuccess({ transactions: updatedTransactions }));
  // dispatch(setCurrentTransaction(transaction));
  // dispatch(updateUserTransactionsSuccess({ transactions: updatedUserTransactions }));
}

export const fetchTransactionById = (id: string) => async (dispatch: Dispatch) => {
  try {
    const res = await Api.Transactions.getTransactionById(id);

    ApiErrors.checkOnApiError(res);

    dispatch(setCurrentTransaction(res.transaction))
  } catch (e) {
    dispatch(
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `Завантажити транзакцію не вдалося. Спробуйте перезавантажити сторінку!`,
      })
    );
  }
}

export const fetchTransactions = (projectId: string) => async (dispatch: Dispatch) => {
  try {
    const res = await Api.Transactions.getProjectTransactions(projectId);

    ApiErrors.checkOnApiError(res);

    dispatch(fetchProjectTransactionsSuccess({ transactions: res.transactions }));
  } catch (e) {
    dispatch(
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `Завантажити транзакції не вдалося. Перезавантажте сторінку!`,
      })
    );
  }
}

export const createTransaction = (projectId: string) => async (dispatch: Dispatch) => {
  try {
    const res = await Api.Transactions.create({
      projectId,
      timestamp: new Date().toISOString(),
    });

    ApiErrors.checkOnApiError(res);

    dispatch(setCurrentTransaction(res.transaction));

    return res;
  } catch (e) {
    dispatch(
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `Створити транзакцію не вдалося. Перезавантажте сторінку!`,
      })
    );
  }
};

export const updateTransactionOnServer = (
  data: Partial<ITransaction>,
  transactionId: string,
  projectId: string
) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const currentTransaction = getState().currentTransaction;
    const updatedTransaction = {
      ...currentTransaction,
      ...data
    }
    try {
      dispatch(setCurrentTransaction(updatedTransaction));

      const res = await Api.Transactions.update({
        ...data,
        projectId
      }, transactionId);

      ApiErrors.checkOnApiError(res);
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Створити транзакцію не вдалося. Перезавантажте сторінку!`,
        })
      );
    }
  }

export const saveProjectTransactionsOrder = (transactions: ITransaction[], projectId: string) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(updateProjectTransactionsSuccess({ transactions }));

      const res = await Api.Transactions.updateTransactionsByProjectId(transactions, projectId);

      ApiErrors.checkOnApiError(res);
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Зберегти порядок транзакцій не вийшло. Перезавантажте сторінку!`,
        })
      );
    }
  }

export const deleteTransaction = (id: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const transactions = getState().projectTransactions;
    try {
      const updatedTransactions = transactions.filter(transaction => transaction.id !== id);

      dispatch(updateProjectTransactionsSuccess({ transactions: updatedTransactions }));

      const res = await Api.Transactions.delete(id);

      ApiErrors.checkOnApiError(res);
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Видалити транзакцію не вийшло. Перезавантажте сторінку!`,
        })
      );
    }
  };
