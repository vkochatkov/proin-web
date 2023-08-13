import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionSelect } from '../FormComponent/TransactionSelect';
import { Button } from '../FormElement/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from '../../hooks/useForm';
import { Input } from '../FormElement/Input';
import { getCurrentProject } from '../../modules/selectors/mainProjects';
import {
  setCurrentProject,
  updateProject,
} from '../../modules/actions/mainProjects';
import { getProjectTransactions } from '../../modules/selectors/transactions';
import { ITransaction } from '../../modules/types/transactions';
import { updateProjectTransactionsSuccess } from '../../modules/actions/transactions';

import './TransactionSettings.scss';

const classifierToAdd = 'classifierToAdd';
const classifierToEdit = 'classifierToEdit';

type ClassifierAction = 'classifierToAdd' | 'classifierToEdit';

export const TransactionsSettings = () => {
  const [selectedEdittingValue, setSelectedEdittingsValue] = useState('');
  const [isActiveInput, setIsActiveInput] = useState(false);
  const [classifierAction, setClassifierAction] =
    useState<ClassifierAction>('classifierToAdd');
  const [placeholder, setPlaceholder] = useState('');
  const currentProject = useSelector(getCurrentProject);
  const projectTransactions = useSelector(getProjectTransactions);
  const { inputHandler } = useForm(
    {
      [classifierAction]: {
        value: '',
        isValid: true,
      },
    },
    true,
  );
  const [changedValue, setChangedValue] = useState('');
  const dispatch = useDispatch();

  const handleActiveInput = (
    inputId: ClassifierAction,
    inputPlacehoder: string,
  ) => {
    setIsActiveInput(true);
    setClassifierAction(inputId);
    setPlaceholder(inputPlacehoder);
  };

  const handleAddClassifier = () => {
    const inputId = classifierToAdd;
    const inputPlacehoder = 'Додати класифікатор';

    handleActiveInput(inputId, inputPlacehoder);
  };

  const handleEditClassifier = () => {
    const inputId = classifierToEdit;
    const inputPlacehoder = 'Редагувати класифікатор';

    handleActiveInput(inputId, inputPlacehoder);
  };

  const handleSaveClassifier = (action: string) => {
    if (!currentProject) return;

    const classifiers = currentProject.classifiers;

    let updatingArrayWithValues: string[] = [];

    if (action === classifierToEdit) {
      const transactionsToUpdate = JSON.parse(
        JSON.stringify(projectTransactions),
      );
      const classifierIndex = classifiers.findIndex(
        (classifier: string) => classifier === selectedEdittingValue,
      );

      updatingArrayWithValues = [...classifiers];
      updatingArrayWithValues.splice(classifierIndex, 1, changedValue);

      transactionsToUpdate.forEach((transaction: ITransaction) => {
        if (transaction.classifier === selectedEdittingValue) {
          transaction.classifier = updatingArrayWithValues[classifierIndex];
        }
      });

      dispatch(
        updateProjectTransactionsSuccess({
          transactions: transactionsToUpdate,
        }),
      );
    }

    if (action === classifierToAdd) {
      updatingArrayWithValues = classifiers.concat([changedValue]);
    }

    const updatedProject = {
      ...currentProject,
      classifiers: updatingArrayWithValues,
    };

    dispatch(
      updateProject(
        { classifiers: updatingArrayWithValues },
        currentProject.id,
      ) as any,
    );

    if (updatingArrayWithValues.includes(selectedEdittingValue)) {
      setSelectedEdittingsValue(selectedEdittingValue);
    } else {
      setSelectedEdittingsValue('');
    }

    dispatch(setCurrentProject(updatedProject));

    setIsActiveInput(false);
  };

  return (
    <>
      <div className='transaction-settings__select-wrapper'>
        <TransactionSelect
          label={'Класифікатор'}
          keyValue={'classifier'}
          selectedValue={selectedEdittingValue}
          setSelectedValue={setSelectedEdittingsValue}
          values={currentProject ? currentProject.classifiers : []}
          styling={{ margin: 1, width: '75%' }}
          isCommon
        />
        <Button
          transparent
          icon
          customClassName='transaction-settings__btn transaction-settings__btn--1'
          onClick={handleAddClassifier}
        >
          <AddIcon />
        </Button>
        <Button
          transparent
          icon
          customClassName='transaction-settings__btn transaction-settings__btn--2'
          onClick={handleEditClassifier}
          disabled={selectedEdittingValue === ''}
        >
          <EditIcon />
        </Button>
        <Button
          transparent
          icon
          customClassName='transaction-settings__btn transaction-settings__btn--3'
        >
          <DeleteIcon />
        </Button>
      </div>
      {isActiveInput && (
        <div
          onBlur={() => {
            if (!changedValue) {
              setIsActiveInput(false);
            }
          }}
          className='transaction-settings__input-wrapper'
        >
          <Input
            id={classifierAction}
            element='input'
            placeholder={placeholder}
            onInput={inputHandler}
            isAnyValue={true}
            isUpdateValue={true}
            isActive={true}
            className='transaction-settings__input'
            initialValue={
              classifierAction === classifierToEdit ? selectedEdittingValue : ''
            }
            changeHandler={(e) => setChangedValue(e.target.value)}
          />
          <Button
            onClick={() =>
              handleSaveClassifier(
                classifierAction === classifierToEdit
                  ? classifierToEdit
                  : classifierToAdd,
              )
            }
          >
            {classifierAction === classifierToEdit ? 'Редагувати' : 'Додати'}
          </Button>
        </div>
      )}
    </>
  );
};
