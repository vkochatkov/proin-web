import { Dispatch } from 'redux';
import { createAction } from 'redux-act';
import { Api } from '../../utils/API';
import ApiErrors from '../../utils/API/APIErrors';
import { RootState } from '../store/store';
import { ITransaction } from '../types/transactions';
import { changeSnackbarState } from './snackbar';

export const setCurrentTransaction = createAction<ITransaction>('setCurrentTransaction');
export const fetchProjectTransactionsSuccess =
  createAction<{ transactions: ITransaction[] }>('fetchProjectTransactionsSuccess');

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