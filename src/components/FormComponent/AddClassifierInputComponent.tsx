import { useDispatch, useSelector } from 'react-redux';
import { useActiveInput } from '../../hooks/useActiveInput';
import { useForm } from '../../hooks/useForm';
import { updateTransactionOnServer } from '../../modules/actions/transactions';
import { getCurrentTransaction } from '../../modules/selectors/currentTransaction';
import { Button } from '../FormElement/Button';
import { Input } from '../FormElement/Input';
import AddIcon from '@mui/icons-material/Add';

interface IProps {}

export const AddClassifierInputComponent: React.FC<IProps> = () => {
  const dispatch = useDispatch();
  const { isActive, setIsActive } = useActiveInput();
  const inputKey = 'classifierToAdd';
  const { formState, inputHandler } = useForm(
    {
      [inputKey]: {
        value: '',
        isValid: true,
      },
    },
    true,
  );
  const value = formState.inputs[inputKey]
    ? formState.inputs[inputKey].value
    : [];
  const currentTransaction = useSelector(getCurrentTransaction);

  const handleSaveClassifier = () => {
    const updatedClassifiers = currentTransaction.classifiers.concat(value);

    dispatch(
      updateTransactionOnServer(
        { classifiers: updatedClassifiers },
        currentTransaction.id,
        currentTransaction.projectId,
      ) as any,
    );
    setIsActive(false);
  };

  return (
    <>
      {!isActive && (
        <>
          <Button
            customClassName='transaction__btn built-in__btn'
            transparent
            icon
            onClick={() => setIsActive(true)}
          >
            <AddIcon />
          </Button>
        </>
      )}
      {isActive && (
        <>
          <div
            onBlur={() => {
              if (!value) {
                setIsActive(false);
              }
            }}
            className='transaction__input-wrapper'
          >
            <Input
              id={inputKey}
              element='input'
              placeholder='Додайте класифікатор'
              onInput={inputHandler}
              isAnyValue={true}
              isUpdateValue={true}
              isActive={true}
              // changeHandler={handleChangeKeyValue}
            />
            <Button
              customClassName='transaction__btn'
              transparent
              icon
              onClick={handleSaveClassifier}
            >
              <AddIcon />
            </Button>
          </div>
        </>
      )}
    </>
  );
};
