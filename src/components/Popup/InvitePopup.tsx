import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { Button } from '../FormElement/Button';
import { VALIDATOR_EMAIL } from '../../utils/validators';
import { Input } from '../FormElement/Input';
import { useForm } from '../../hooks/useForm';
import { useSelector } from 'react-redux';
import { getPopupState } from '../../modules/selectors/popup';
import { useDispatch } from 'react-redux';
import { closePopup } from '../../modules/actions/popup';
import { sendInvitation } from '../../modules/actions/mainProjects';
import { getAuth } from '../../modules/selectors/user';

export const InvitePopup = () => {
  const { email } = useSelector(getAuth);
  const { formState, inputHandler } = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
    },
    false
  );
  const { open } = useSelector(getPopupState);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closePopup({ id: 'invite' }));
  };

  const submitHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    dispatch(sendInvitation(formState.inputs.email.value) as any);
    dispatch(closePopup({ id: 'invite' }));
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={submitHandler}>
          <DialogContent>
            <h3
              style={{
                marginTop: '0',
              }}
            >
              Запросити користувача
            </h3>
            <Input
              element="input"
              id="email"
              type="email"
              label="Електронна адреса"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} inverse>
              Скасувати
            </Button>
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
