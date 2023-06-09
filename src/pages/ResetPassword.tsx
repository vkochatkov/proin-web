import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button } from '../components/FormElement/Button';
import { Input } from '../components/FormElement/Input';
import { MainNavigation } from '../components/Navigation/MainNavigation';
import { Card } from '../components/UIElements/Card';
import { SnackbarUI } from '../components/UIElements/SnackbarUI';
import { useForm } from '../hooks/useForm';
import { resetPassword } from '../modules/actions/user';
import { VALIDATOR_MINLENGTH } from '../utils/validators';

import './ForgotPassword.scss';
import './HomePage.scss';

const ResetPassword = () => {
  const { token } = useParams();
  const { formState, inputHandler } = useForm(
    {
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );
  const dispatch = useDispatch();

  const submitHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (token) {
      dispatch(resetPassword(token) as any);
    } else {
      throw Error('something went wrong in submitHandler, token is undefined');
    }
  };

  return (
    <>
      <SnackbarUI />
      <div className="container forgot-password__container">
        <MainNavigation>
          <h2
            style={{
              color: '#fff',
            }}
          >
            Pro In
          </h2>
        </MainNavigation>
        <div className="forgot-password">
          <Card>
            <p>ПРОІН - сервіс адміністрування проектів</p>
            <hr />
            <form onSubmit={submitHandler}>
              <Input
                element="input"
                id="password"
                type="password"
                label="Введіть новий пароль"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Будь-ласка, додайте валідну електронну адресу."
                onInput={inputHandler}
              />
              <Button type="submit" disabled={!formState.isValid}>
                ВІДНОВИТИ ПАРОЛЬ
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
