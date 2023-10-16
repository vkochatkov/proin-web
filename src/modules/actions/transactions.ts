import { Dispatch } from 'redux';
import { createAction } from 'redux-act';
import { Api } from '../../utils/API';
import ApiErrors from '../../utils/API/APIErrors';
import { updateEnitites, updateObjects } from '../../utils/utils';
import { RootState } from '../store/store';
import { IComment, IFile } from '../types/mainProjects';
import { ITransaction } from '../types/transactions';
import { endFilesLoading, startFilesLoading } from './loading';
import { changeSnackbarState } from './snackbar';

export const setCurrentTransaction = createAction<ITransaction>(
  'setCurrentTransaction',
);
export const fetchProjectTransactionsSuccess = createAction<{
  transactions: ITransaction[];
}>('fetchProjectTransactionsSuccess');
export const updateProjectTransactionsSuccess = createAction<{
  transactions: ITransaction[];
}>('updateProjectTransactionsSuccess');
export const clearProjectTransactions = createAction(
  'clearProjectTransactions',
);
export const updateUserTransactionsSuccess = createAction<{
  transactions: ITransaction[];
}>('updateUserTransactionsSuccess');
export const fetchUserTransactionsSuccess = createAction<{
  transactions: ITransaction[];
}>('fetchUserTransactionsSuccess');
export const clearUserTransactions = createAction('clearProjectTransactions');
export const deleteFileFromTransactionSuccess = createAction(
  'deleteFileFromTransactionSuccess',
);

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

  dispatch(
    updateProjectTransactionsSuccess({ transactions: updatedTransactions }),
  );
  dispatch(setCurrentTransaction(transaction));
  dispatch(
    updateUserTransactionsSuccess({ transactions: updatedUserTransactions }),
  );
};

export const fetchTransactionById =
  (id: string) => async (dispatch: Dispatch) => {
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
        }),
      );
    }
  };

export const fetchTransactions =
  (projectId: string) => async (dispatch: Dispatch) => {
    try {
      const res = await Api.Transactions.getProjectTransactions(projectId);

      ApiErrors.checkOnApiError(res);

      dispatch(
        fetchProjectTransactionsSuccess({ transactions: res.transactions }),
      );
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Завантажити транзакції не вдалося. Перезавантажте сторінку!`,
        }),
      );
    }
  };

export const createTransaction =
  (projectId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const projectTransactions = getState().projectTransactions;
    const tabValue = getState().tabs['transaction-tabs'];
    const transactionLabels: { [key: string]: string } = {
      income: 'Доходи',
      expenses: 'Витрати',
      transfer: 'Перекази',
    };

    const selectedLabel = Object.keys(transactionLabels).find(
      (key) => transactionLabels[key] === tabValue,
    );

    try {
      const res = await Api.Transactions.create({
        projectId,
        timestamp: new Date().toISOString(),
        type: selectedLabel ? selectedLabel : '',
      });

      ApiErrors.checkOnApiError(res);

      const updatedTransactions = [...projectTransactions, res.transaction];

      dispatch(setCurrentTransaction(res.transaction));
      dispatch(
        updateProjectTransactionsSuccess({ transactions: updatedTransactions }),
      );

      return res;
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Створити транзакцію не вдалося. Перезавантажте сторінку!`,
        }),
      );
    }
  };

export const uploadFilesToTheServer =
  (data: { files: any[] }, transactionId: string, projectId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const projectTransactions = getState().projectTransactions;
    const userTransactions = getState().userTransactions;

    try {
      dispatch(startFilesLoading());

      const res = await Api.Transactions.update(
        {
          ...data,
          projectId,
        },
        transactionId,
      );

      ApiErrors.checkOnApiError(res);

      const updatedTransaction = {
        ...res.transaction,
      };

      updateTransactionStates({
        transactions: projectTransactions,
        transaction: updatedTransaction,
        userTransactions,
        dispatch,
      });

      dispatch(endFilesLoading());
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Завантажити файл не вдалося. Щось пішло не так!`,
        }),
      );
    }
  };

export const updateTransactionOnServer =
  (data: Partial<ITransaction>, transactionId: string, projectId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const currentTransaction = getState().currentTransaction;
    const projectTransactions = getState().projectTransactions;
    const userTransactions = getState().userTransactions;
    const updatedTransaction = {
      ...currentTransaction,
      ...data,
    };

    try {
      updateTransactionStates({
        transactions: projectTransactions,
        transaction: updatedTransaction,
        userTransactions,
        dispatch,
      });

      const res = await Api.Transactions.update(
        {
          ...data,
          projectId,
        },
        transactionId,
      );

      ApiErrors.checkOnApiError(res);
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Створити транзакцію не вдалося. Перезавантажте сторінку!`,
        }),
      );
    }
  };

export const saveProjectTransactionsOrder =
  (transactions: ITransaction[], projectId: string) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(updateProjectTransactionsSuccess({ transactions }));

      const res = await Api.Transactions.updateTransactionsByProjectId(
        transactions,
        projectId,
      );

      ApiErrors.checkOnApiError(res);
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Зберегти порядок транзакцій не вийшло. Перезавантажте сторінку!`,
        }),
      );
    }
  };

export const deleteTransaction =
  (id: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const transactions = getState().projectTransactions;
    const userTransactions = getState().userTransactions;
    try {
      const updatedTransactions = transactions.filter(
        (transaction) => transaction.id !== id,
      );
      const updatedUserTransactions = userTransactions.filter(
        (transaction) => transaction.id !== id,
      );

      dispatch(
        updateProjectTransactionsSuccess({ transactions: updatedTransactions }),
      );
      dispatch(
        updateUserTransactionsSuccess({
          transactions: updatedUserTransactions,
        }),
      );

      const res = await Api.Transactions.delete(id);

      ApiErrors.checkOnApiError(res);
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Видалити транзакцію не вийшло. Перезавантажте сторінку!`,
        }),
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
      }),
    );
  }
};

export const saveUserTransactionOrder =
  (transactions: ITransaction[], userId: string) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(updateUserTransactionsSuccess({ transactions }));

      const res = await Api.Transactions.updateTransactionsByUserId(
        transactions,
        userId,
      );

      ApiErrors.checkOnApiError(res);
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Сталася помилка. Перезавантажте сторінку!`,
        }),
      );
    }
  };

export const removeFileFromTransaction =
  (tid: string, fileId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const transactions: ITransaction[] = JSON.parse(
      JSON.stringify(getState().projectTransactions),
    );
    const userTransactions: ITransaction[] = JSON.parse(
      JSON.stringify(getState().userTransactions),
    );

    try {
      const res = await Api.Files.deleteTransactionsFile(tid, fileId);
      ApiErrors.checkOnApiError(res);

      dispatch(deleteFileFromTransactionSuccess());

      const transaction = res.transaction;

      updateTransactionStates({
        transactions: transactions,
        transaction,
        userTransactions,
        dispatch,
      });
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Неможливо видалити файл. Перезавантажте сторінку`,
        }),
      );
    }
  };

export const changeTransactionFilesOrder =
  ({ files, transactionId }: { files: IFile[]; transactionId: string }) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const userTransactions = getState().userTransactions;
    try {
      const result = updateEnitites(userTransactions, transactionId, files);

      if (!result) return;

      dispatch(setCurrentTransaction(result.updatedEntity));
      dispatch(
        updateProjectTransactionsSuccess({
          transactions: result.updatedEnities,
        }),
      );

      await Api.Files.updateTransactionFilesOrder(
        { files: result.updatedEntity.files },
        transactionId,
      );
    } catch (e: any) {
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `Оновити транзакцію не вдалося`,
      });
    }
  };

export const createTransactionComment =
  (comment: IComment, transactionId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const projectTransactions = getState().projectTransactions;
    const userTransactions = getState().userTransactions;
    const currentTransaction = getState().currentTransaction;

    try {
      const updatedCurrentTask = {
        ...currentTransaction,
        comments: currentTransaction.comments
          ? [comment, ...currentTransaction.comments]
          : [comment],
      };

      updateTransactionStates({
        transactions: projectTransactions,
        transaction: updatedCurrentTask,
        userTransactions,
        dispatch,
      });

      const res = await Api.Transactions.createComment(
        { comment },
        transactionId,
      );

      ApiErrors.checkOnApiError(res);

      const saveTransaction = {
        ...updatedCurrentTask,
        comments: res.transaction.comments,
      };

      dispatch(setCurrentTransaction(saveTransaction));
    } catch (e) {
      console.log(e);
    }
  };

export const deleteTransactionComment =
  (transactionId: string, commentId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const projectTransactions: ITransaction[] = JSON.parse(
      JSON.stringify(getState().projectTransactions),
    );
    const userTransactions: ITransaction[] = JSON.parse(
      JSON.stringify(getState().userTransactions),
    );

    try {
      const res = await Api.Transactions.deleteComment(
        transactionId,
        commentId,
      );

      ApiErrors.checkOnApiError(res);

      const transaction: ITransaction = res.transaction;

      updateTransactionStates({
        transactions: projectTransactions,
        transaction,
        userTransactions,
        dispatch,
      });
    } catch (e) {
      console.log(e);
    }
  };
