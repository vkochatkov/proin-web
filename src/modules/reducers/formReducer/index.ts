import { createReducer } from 'redux-act';
import { changeFormInput, setFormDataAction } from '../../actions/form';

export type FormState = {
  inputs: {
    [key: string]: {
      value: string;
      isValid: boolean;
    };
  };
  isValid: boolean;
};

export type SetFormDataType = (
  inputData: FormState['inputs'],
  formValidity: FormState['isValid']
) => void;

const initialState: FormState = { inputs: {}, isValid: false };

export const formReducer = createReducer({}, initialState);

formReducer.on(changeFormInput, (state, payload) => {
  let updatedFormIsValid = true as any;
  for (const inputId in state.inputs) {
    if (inputId === payload.inputId) {
      updatedFormIsValid = updatedFormIsValid && payload.isValid;
    } else {
      updatedFormIsValid = updatedFormIsValid && state.inputs[inputId]?.isValid;
    }
  }
  return {
    ...state,
    inputs: {
      ...state.inputs,
      [payload.inputId as string]: {
        value: payload.value as string,
        isValid: payload.isValid as boolean,
      },
    },
    isValid: updatedFormIsValid,
  };
});

formReducer.on(setFormDataAction, (_, payload) => {
  return {
    inputs: payload.inputs as FormState['inputs'],
    isValid: payload.formIsValid as FormState['isValid'],
  };
});
