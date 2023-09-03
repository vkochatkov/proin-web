import React, { useCallback, useState } from 'react';
import {
  CircularProgress,
  DialogActions,
  DialogContent,
  TextField,
} from '@mui/material';
import { Button } from '../FormElement/Button';
import { useForm } from '../../hooks/useForm';
import { useSelector } from 'react-redux';
import { getModalStateById } from '../../modules/selectors/modal';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../modules/actions/modal';
import { sendInvitation } from '../../modules/actions/mainProjects';
import { getAuth } from '../../modules/selectors/user';
import { RootState } from '../../modules/store/store';
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
import { Modal } from './Modal';
import { getMembers } from '../../modules/selectors/projectMembers';

export const InviteModal = () => {
  const { email } = useSelector(getAuth);
  const [open, setOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = useState<IFoundUser[] | []>([]);
  const options = useSelector(getFoundUsers);
  const existingMembers = useSelector(getMembers);
  const { pid } = useParams();
  const { formState, inputHandler } = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
    },
    false,
  );
  const [isLoading, setIsLoading] = useState(false);
  const openModal = useSelector((state: RootState) =>
    getModalStateById(state)('invite'),
  );
  const dispatch = useDispatch();

  const isOptionDisabled = (option: Partial<IFoundUser>) => {
    // Check if the option's id exists in existingMembers
    return existingMembers.some((member) => member.userId === option.id);
  };

  const handleClose = () => {
    dispatch(closeModal({ id: 'invite' }));
  };

  const submitHandler = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    await dispatch(sendInvitation(selectedUsers) as any);
    if (pid) dispatch(fetchMembers(pid) as any);
    dispatch(closeModal({ id: 'invite' }));
  };

  const handleChange = useCallback(
    debounce(
      async (event: React.SyntheticEvent<Element, Event>, value: string) => {
        if (value && value.length > 0) {
          await dispatch(searchUsers(value) as any);
        }

        setIsLoading(false);
      },
      500,
    ),
    [],
  );

  return (
    <>
      <Modal
        open={openModal}
        handleClose={handleClose}
        label={'Запросити користувача'}
      >
        <form onSubmit={submitHandler}>
          <DialogContent>
            <Autocomplete
              id='asynchronous-demo'
              sx={{ width: '100%' }}
              multiple
              open={open}
              getOptionDisabled={isOptionDisabled}
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
                setIsLoading(true);
                handleChange(event, value);
                inputHandler('email', value, true);
              }}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              getOptionLabel={(option) =>
                option.name !== 'Запросити'
                  ? `${option.name} (${option.email})`
                  : `Запросити ${option.email}`
              }
              //@ts-ignore
              options={
                options.length === 0 &&
                formState.inputs.email &&
                formState.inputs.email.value.includes('@')
                  ? [
                      {
                        email: formState.inputs.email.value,
                        name: 'Запросити',
                      },
                    ]
                  : options
              }
              loading={isLoading}
              clearOnBlur={
                formState.inputs.email && formState.inputs.email.value === ''
              }
              noOptionsText='Користувач не знайдений'
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='standard'
                  label="Введіть ім'я або електронну адресу"
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
                        {isLoading ? (
                          <CircularProgress color='inherit' size={20} />
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
              type='submit'
              disabled={
                !formState.inputs.email?.isValid ||
                email === formState.inputs.email?.value
              }
            >
              Відправити запрошення
            </Button>
          </DialogActions>
        </form>
      </Modal>
    </>
  );
};
