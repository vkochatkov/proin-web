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
export const clearProjectTransactions = createAction('clearProjectTransactions');
export const updateUserTransactionsSuccess =
  createAction<{ transactions: ITransaction[] }>('updateUserTransactionsSuccess');
export const fetchUserTransactionsSuccess =
  createAction<{ transactions: ITransaction[] }>('fetchUserTransactionsSuccess');
export const clearUserTransactions = createAction('clearProjectTransactions');


const updateTransactionStates = ({
  transactions,
  transaction,
  userTransactions,
  dispatch,
}: {
  transactions: ITransaction[];
  transaction: ITransaction;
  userTransactions: ITransaction[];
  dispatch: Dispatch;
}) => {
  const updatedTransactions = updateObjects(transactions, transaction);
  const updatedUserTransactions = updateObjects(userTransactions, transaction);

  dispatch(updateProjectTransactionsSuccess({ transactions: updatedTransactions }));
  dispatch(setCurrentTransaction(transaction));
  dispatch(updateUserTransactionsSuccess({ transactions: updatedUserTransactions }));
}

export const fetchTransactionById = (id: string) => async (dispatch: Dispatch) => {
  try {
    const res = await Api.Transactions.getTransactionById(id);

    ApiErrors.checkOnApiError(res);

    dispatch(setCurrentTransaction(res.transaction));
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

export const createTransaction = (projectId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const projectTransactions = getState().projectTransactions;

    try {
      const res = await Api.Transactions.create({
        projectId,
        timestamp: new Date().toISOString(),
      });

      ApiErrors.checkOnApiError(res);

      const updatedTransactions = [...projectTransactions, res.transaction];

      dispatch(setCurrentTransaction(res.transaction));
      dispatch(updateProjectTransactionsSuccess({ transactions: updatedTransactions }));

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
    const projectTransactions = getState().projectTransactions;
    const userTransactions = getState().userTransactions;
    const updatedTransaction = {
      ...currentTransaction,
      ...data
    };

    try {
      updateTransactionStates({
        transactions: projectTransactions,
        transaction: updatedTransaction,
        userTransactions,
        dispatch
      });

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

      const res = await Api.Transactions
        .updateTransactionsByProjectId(transactions, projectId);

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
    const userTransactions = getState().userTransactions;
    try {
      const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
      const updatedUserTransactions = userTransactions
        .filter(transaction => transaction.id !== id);

      dispatch(updateProjectTransactionsSuccess({ transactions: updatedTransactions }));
      dispatch(updateUserTransactionsSuccess({ transactions: updatedUserTransactions }));

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

export const fetchUserTransactions = () => async (dispatch: Dispatch) => {
  try {
    const res = await Api.Transactions.getUserTransactions();
    ApiErrors.checkOnApiError(res);

    dispatch(fetchUserTransactionsSuccess({ transactions: res.transactions }));
  } catch (e) {
    dispatch(
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `Сталася помилка. Перезавантажте сторінку!`,
      })
    );
  }
};

export const saveUserTransactionOrder = (transactions: ITransaction[], userId: string) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(updateUserTransactionsSuccess({ transactions }));

      const res = await Api.Transactions.updateTransactionsByUserId(transactions, userId);

      ApiErrors.checkOnApiError(res);
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Сталася помилка. Перезавантажте сторінку!`,
        })
      );
    }
  }
