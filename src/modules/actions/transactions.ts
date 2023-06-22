import { Dispatch } from 'redux';
import { changeSnackbarState } from './snackbar';

export const createTransaction = () => (dispatch: Dispatch) => {
  try {
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
