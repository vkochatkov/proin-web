import { Alert, Snackbar } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { clearSnackbarState } from '../../modules/actions/snackbar';
import { getSnackbar } from '../../modules/selectors/snackbar';

export const SnackbarUI = () => {
  const { id, open, message } = useSelector(getSnackbar);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(clearSnackbarState());
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={id} sx={{ width: '100%' }}>
        {message}
      </Alert>
      {/* <Alert severity="error">This is an error message!</Alert>
        <Alert severity="warning">This is a warning message!</Alert>
        <Alert severity="info">This is an information message!</Alert>
         */}
    </Snackbar>
  );
};
