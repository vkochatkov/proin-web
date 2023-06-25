import { Dispatch } from 'redux';
import { createAction } from 'redux-act';
import { Api } from '../../utils/API';
import ApiErrors from '../../utils/API/APIErrors';
import { RootState } from '../store/store';
import { ITransaction } from '../types/transactions';
import { changeSnackbarState } from './snackbar';

export const setCurrentTransaction = createAction<ITransaction>('setCurrentTransaction');

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