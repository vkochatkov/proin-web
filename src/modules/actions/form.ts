import { createAction } from 'redux-act';
import { FormState } from '../reducers/formReducer';

export interface ChangeFormInput {
  inputId: string;
  isValid: boolean;
  value: string;
}

export const changeFormInput =
  createAction<ChangeFormInput>('CHANGE_FORM_INPUT');

export const setFormDataAction = createAction<{
  inputs: FormState['inputs'];
  formIsValid: FormState['isValid'];
}>('SET_FORM_DATA');
