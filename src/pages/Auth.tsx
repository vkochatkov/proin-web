import React, { useState } from 'react';
import { Card } from '../components/UIElements/Card';
import { Input } from '../components/FormElement/Input';
import { Button } from '../components/FormElement/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../utils/validators';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { endLoading, startLoading } from '../modules/actions/loading';
import { getIsLoading } from '../modules/selectors/loading';
import axios from 'axios';
import { SnackbarUI } from '../components/UIElements/SnackbarUI';
import { changeSnackbarState } from '../modules/actions/snackbar';

import './Auth.scss';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { formState, inputHandler } = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const httpSource = axios.CancelToken.source();

    dispatch(startLoading());

    if (isLoginMode) {
      try {
        const { data } = await axios({
          method: 'POST',
          url: `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          data: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          cancelToken: httpSource.token,
        });

        login(data.userId, data.token, data.email);
        navigate('/');
      } catch (e: any) {
        dispatch(endLoading());
        dispatch(
          changeSnackbarState({
            id: 'error',
            open: true,
            message: `${e.response.data.message}. Перезавантажте сторінку`,
          })
        );
      }
    } else {
      try {
        const { data } = await axios({
          method: 'POST',
          url: `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          data: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          cancelToken: httpSource.token,
        });

        login(data.userId, data.token, data.email);
        navigate('/');
      } catch (err: any) {
        dispatch(endLoading());
        dispatch(
          changeSnackbarState({
            id: 'error',
            message: err.response.data.message,
            open: true,
          })
        );
      }
    }
  };

  return (
    <React.Fragment>
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay blue />}
        {isLoginMode ? <h2>Авторизація</h2> : <h2>Реєстрація</h2>}
        <p>ПРОІН - сервіс адміністрування проектів</p>
        <hr />
        <form onSubmit={authSubmitHandler}>
          <Input
            element="input"
            id="email"
            type="email"
            label="Електронна адреса"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Пароль"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          {isLoginMode && (
            <div className="authentication__link-wrapper">
              <NavLink to="/forgot-password">Відновити пароль</NavLink>
            </div>
          )}
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'ВХІД' : 'РЕЄСТРАЦІЯ'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {isLoginMode ? 'РЕЄСТРАЦІЯ' : 'АВТОРИЗАЦІЯ'}
        </Button>
      </Card>
      <SnackbarUI />
    </React.Fragment>
  );
};

export default Auth;
