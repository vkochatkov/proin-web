import React, { useState } from 'react';
import { Card } from '../components/UIElements/Card';
import { Input } from '../components/FormElement/Input';
import { Button } from '../components/FormElement/Button';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../utils/validators';
import { useForm } from '../hooks/useForm';
import { useHttpClient } from '../hooks/useHttpClient';
import { useAuth } from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { updateLogin } from '../modules/actions/user';
import './Auth.scss';

export const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, sendRequest } = useHttpClient();
  const dispatch = useDispatch();
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

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        navigate('/');
        dispatch(updateLogin(responseData));

        login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email?.value || '');
        formData.append('password', formState.inputs.password?.value || '');

        const responseData = await sendRequest(
          'http://localhost:5000/users/signup',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        navigate('/');
        dispatch(updateLogin(responseData));

        login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        {isLoginMode ? <h2>Логін</h2> : <h2>Реєстрація</h2>}
        <hr />
        <form onSubmit={authSubmitHandler}>
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};
