import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeFormInput, setFormDataAction } from '../modules/actions/form';
import { FormState, SetFormDataType } from '../modules/reducers/formReducer';
import { RootState } from '../modules/store/store';

type InputHandler = (id: string, value: string, isValid: boolean) => void;

export const useForm = (
  initialInputs: FormState['inputs'],
  initialFormValidity: FormState['isValid']
): {
  formState: FormState;
  inputHandler: InputHandler;
  setFormData: SetFormDataType;
} => {
  const formState = useSelector((state: RootState) => state.formData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setFormDataAction({
        inputs: initialInputs,
        formIsValid: initialFormValidity,
      })
    );
    // eslint-disable-next-line
  }, []);

  const inputHandler = useCallback<InputHandler>(
    (id, value, isValid) => {
      dispatch(
        changeFormInput({
          value,
          isValid,
          inputId: id,
        })
      );
    },
    [dispatch]
  );

  const setFormData = useCallback<SetFormDataType>(
    (inputData, formValidity) => {
      dispatch(
        setFormDataAction({
          inputs: inputData,
          formIsValid: formValidity,
        })
      );
    },
    [dispatch]
  );

  return { formState, inputHandler, setFormData };
};
