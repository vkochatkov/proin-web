import React, { useCallback, useState } from 'react';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { Button } from '../FormElement/Button';
import { useForm } from '../../hooks/useForm';
import { useSelector } from 'react-redux';
import { getPopupStateById } from '../../modules/selectors/popup';
import { useDispatch } from 'react-redux';
import { closePopup } from '../../modules/actions/popup';
import { sendInvitation } from '../../modules/actions/mainProjects';
import { getAuth } from '../../modules/selectors/user';
import { RootState } from '../../modules/store/store';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import { debounce } from '../../utils/debounce';
import {
  foundUsersSuccess,
  searchUsers,
} from '../../modules/actions/foundUsers';
import { getFoundUsers } from '../../modules/selectors/foundUsers';
import { IFoundUser } from '../../modules/types/users';
import { fetchMembers } from '../../modules/actions/projectMembers';
import { useParams } from 'react-router-dom';

export const InvitePopup = () => {
  const { email } = useSelector(getAuth);
  const [open, setOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = useState<IFoundUser[] | []>([]);
  const options = useSelector(getFoundUsers);
  const { pid } = useParams();
  const loading = open && options.length === 0;
  const { formState, inputHandler } = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const openPopup = useSelector((state: RootState) =>
    getPopupStateById(state)('invite')
  );
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closePopup({ id: 'invite' }));
  };

  const submitHandler = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    await dispatch(sendInvitation(selectedUsers) as any);
    if (pid) dispatch(fetchMembers(pid) as any);
    dispatch(closePopup({ id: 'invite' }));
  };

  const handleChange = useCallback(
    debounce((event: React.SyntheticEvent<Element, Event>, value: string) => {
      if (value && value.length > 0) {
        dispatch(searchUsers(value) as any);
      }
    }, 500),
    []
  );

  return (
    <div>
      <Dialog
        open={openPopup}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '400px',
            padding: '10px 0',
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: '1px solid #ccc',
            margin: '0 1rem',
            padding: '5px 0',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: 'medium',
            }}
          >
            Запросити користувача
          </span>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              padding: '0',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={submitHandler}>
          <DialogContent>
            <Autocomplete
              id="asynchronous-demo"
              sx={{ width: '100%' }}
              multiple
              open={open}
              onOpen={() => {
                if (
                  formState.inputs.email &&
                  formState.inputs.email.value.length > 0
                ) {
                  setOpen(true);
                }
              }}
              onClose={() => {
                setOpen(false);
              }}
              onChange={(_, value) => {
                setSelectedUsers(value);
                dispatch(foundUsersSuccess({ foundUsers: [] }));
              }}
              onInputChange={(event, value) => {
                handleChange(event, value);
                inputHandler('email', value, true);
              }}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              options={options}
              loading={loading}
              noOptionsText="Користувачів не знайдено"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Запросити користувача"
                  sx={{
                    '& .MuiChip-root': {
                      margin: 0,
                    },
                  }}
                  value={
                    formState.inputs.email ? formState.inputs.email.value : ''
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              disabled={
                !formState.inputs.email?.isValid ||
                email === formState.inputs.email?.value
              }
            >
              Відправити запрошення
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
