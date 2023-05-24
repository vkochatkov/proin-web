import { createAction } from 'redux-act';
import { FormState } from '../reducers/formReducer';

export interface ChangeFormInput {
  inputId: string;
  isValid: boolean;
  value: string;
}

export const changeFormInput = createAction<ChangeFormInput>('changeFormInput');

export const clearFormInput = createAction('clearFormInput');

export const setFormDataAction = createAction<{
  inputs: FormState['inputs'];
  formIsValid: FormState['isValid'];
}>('setFormDataAction');
