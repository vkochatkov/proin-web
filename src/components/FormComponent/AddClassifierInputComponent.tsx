import { useDispatch, useSelector } from "react-redux";
import { useActiveInput } from "../../hooks/useActiveInput";
import { useForm } from "../../hooks/useForm";
import { updateTransactionOnServer } from "../../modules/actions/transactions";
import { getCurrentTransaction } from "../../modules/selectors/currentTransaction";
import { Button } from "../FormElement/Button"
import { Input } from "../FormElement/Input";

interface IProps {
  inputHandler: (id: string, value: string, isValid: boolean) => void;
}

export const AddClassifierInputComponent: React.FC<IProps> = ({ inputHandler }) => {
  const dispatch = useDispatch();
  const { 
    isActive, 
    setIsActive, 
  } = useActiveInput();
  const inputKey = 'classifierToAdd'
  const { formState } = useForm(
    {
      [inputKey]: {
        value: '',
        isValid: true,
      },
    },
    true
  );
  const value = formState.inputs[inputKey] ? formState.inputs[inputKey].value : [];
  const currentTransaction = useSelector(getCurrentTransaction);

  const handleSaveClassifier = () => {
    const updatedClassifiers = currentTransaction.classifiers.concat(value);
   
    dispatch(updateTransactionOnServer(
      { classifiers: updatedClassifiers },
      currentTransaction.id,
      currentTransaction.projectId,
    ) as any);
    setIsActive(false);
  };

  return (
    <>
      {!isActive && (
      <>
        <Button 
          customClassName='transaction__btn' 
          transparent 
          onClick={() => setIsActive(true)}
        >
          Додати класифікатор
        </Button>
      </>
      )}
      {isActive && (
        <>
          <div onBlur={() => {
            if (!value) {
              setIsActive(false)
            }
            }}>
            <Input
              id={inputKey}
              element='input'
              onInput={inputHandler}
              isAnyValue={true}
              isUpdateValue={true}
              isActive={true}
              // changeHandler={handleChangeKeyValue}
            />
          </div>
          <Button 
            customClassName='transaction__btn' 
            transparent 
            onClick={handleSaveClassifier}
          >
            Додати класифікатор
          </Button>
        </>
      )
      }
    </>
  )
}