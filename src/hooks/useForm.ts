import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeFormInput, setFormDataAction } from '../modules/actions/form';
import { FormState, ISetFormData } from '../modules/reducers/formReducer';
import { RootState } from '../modules/store';

type InputHandler = (id: string, value: string, isValid: boolean) => void;

export const useForm = (
  initialInputs: FormState['inputs'],
  initialFormValidity: FormState['isValid']
): [FormState, InputHandler, ISetFormData] => {
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

  const ISetFormData = useCallback<ISetFormData>(
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

  return [formState, inputHandler, ISetFormData];
};
