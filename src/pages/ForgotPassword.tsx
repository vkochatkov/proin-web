import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '../components/FormElement/Button';
import { Input } from '../components/FormElement/Input';
import { MainNavigation } from '../components/Navigation/MainNavigation';
import { Card } from '../components/UIElements/Card';
import { useForm } from '../hooks/useForm';
import { sendRecaveryEmail } from '../modules/actions/user';
import { VALIDATOR_EMAIL } from '../utils/validators';

import './ForgotPassword.scss';
import './HomePage.scss';

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { formState, inputHandler } = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const submitHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    dispatch(sendRecaveryEmail() as any);
  };

  return (
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
          <h2>Введіть свій email</h2>
          <hr />
          <form onSubmit={submitHandler}>
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
              ВВЕСТИ
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
