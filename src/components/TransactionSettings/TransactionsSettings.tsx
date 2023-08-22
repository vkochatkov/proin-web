import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../FormElement/Button';
import { useForm } from '../../hooks/useForm';
import { Input } from '../FormElement/Input';
import { getCurrentProject } from '../../modules/selectors/mainProjects';
import { setCurrentProject } from '../../modules/actions/mainProjects';
import { getProjectTransactions } from '../../modules/selectors/transactions';
import { ITransaction } from '../../modules/types/transactions';
import { updateProjectTransactionsSuccess } from '../../modules/actions/transactions';
import { closeModal, openModal } from '../../modules/actions/modal';
import { RemoveClassifierModal } from '../Modals/RemoveClassifierModal';
import { ClassifiersComponent } from '../ClassifiersComponent/ClassifiersComponent';

import './TransactionSettings.scss';

const classifierToAdd = 'classifierToAdd';
const classifierToEdit = 'classifierToEdit';

type ClassifierAction = 'classifierToAdd' | 'classifierToEdit';
type ClassifierType = 'income' | 'expenses' | 'transfer';

export const TransactionsSettings = () => {
  const [selectedEdittingValue, setSelectedEdittingsValue] = useState('');
  const [selectedClassifierType, setSelectedClassifierType] = useState('');
  const [isActiveInput, setIsActiveInput] = useState(false);
  const [classifierAction, setClassifierAction] =
    useState<ClassifierAction>('classifierToAdd');
  const [placeholder, setPlaceholder] = useState('');
  const currentProject = useSelector(getCurrentProject);
  const projectTransactions = useSelector(getProjectTransactions);
  const modalId = 'remove-classifier';
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

  const handleUpdatingClassifierValues = (updatingClassifiers: {
    income: string[];
    expenses: string[];
    transfer: string[];
  }) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      classifiers: updatingClassifiers,
    };

    // dispatch(
    //   updateProject(
    //     {
    //       classifiers: updatingClassifiers,
    //       classifierType: selectedClassifierType,
    //     },
    //     currentProject.id,
    //   ) as any,
    // );

    if (
      (selectedClassifierType === 'income' ||
        selectedClassifierType === 'expenses' ||
        selectedClassifierType === 'transfer') &&
      updatingClassifiers[selectedClassifierType].includes(
        selectedEdittingValue,
      )
    ) {
      setSelectedEdittingsValue(selectedEdittingValue);
    } else {
      setSelectedEdittingsValue('');
    }

    dispatch(setCurrentProject(updatedProject));

    setIsActiveInput(false);
  };

  const handleSaveClassifier = (action: string) => {
    if (!currentProject) return;

    const classifiers = { ...currentProject.classifiers }; // Assuming you're using the new structure
    let updatedClassifiers = { ...classifiers };

    if (action === classifierToEdit) {
      const transactionsToUpdate = JSON.parse(
        JSON.stringify(projectTransactions),
      );

      const classifierIndex = updatedClassifiers[
        selectedClassifierType
      ].findIndex((classifier: string) => classifier === selectedEdittingValue);

      const classifiersByType = updatedClassifiers[selectedClassifierType];

      updatedClassifiers[selectedClassifierType] = classifiersByType.map(
        (classifier: string) =>
          classifier === selectedEdittingValue ? changedValue : classifier,
      );

      transactionsToUpdate.forEach((transaction: ITransaction) => {
        if (transaction.classifier === selectedEdittingValue) {
          transaction.classifier = classifiersByType[classifierIndex];
        }
      });

      dispatch(
        updateProjectTransactionsSuccess({
          transactions: transactionsToUpdate,
        }),
      );
    }

    if (action === classifierToAdd) {
      updatedClassifiers[selectedClassifierType] = updatedClassifiers[
        selectedClassifierType
      ].concat([changedValue]);
    }

    handleUpdatingClassifierValues(updatedClassifiers);
  };

  const handleRemoveClassifier = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!currentProject) return;

    const updatedClassifiers = {
      ...currentProject.classifiers,
      [selectedClassifierType]: currentProject.classifiers[
        selectedClassifierType
      ].filter((classifier: string) => classifier !== selectedEdittingValue),
    };
    const transactionsToUpdate = JSON.parse(
      JSON.stringify(projectTransactions),
    );

    transactionsToUpdate.forEach((transaction: ITransaction) => {
      if (transaction.classifier === selectedEdittingValue) {
        transaction.classifier = '';
      }
    });

    dispatch(
      updateProjectTransactionsSuccess({
        transactions: transactionsToUpdate,
      }),
    );
    handleUpdatingClassifierValues(updatedClassifiers);

    dispatch(closeModal({ id: modalId }));
  };

  const handleOpenModal = () => {
    dispatch(
      openModal({
        id: modalId,
      }),
    );
  };

  return (
    <>
      <RemoveClassifierModal submitHandler={handleRemoveClassifier} />
      <ClassifiersComponent
        classifiers={
          currentProject ? currentProject.classifiers['expenses'] : []
        }
        label='Витрати'
      />
      <ClassifiersComponent
        classifiers={currentProject ? currentProject.classifiers['income'] : []}
        label='Доходи'
      />
      <ClassifiersComponent
        classifiers={
          currentProject ? currentProject.classifiers['transfer'] : []
        }
        label='Переказ'
      />

      <div className='transaction-settings__select-wrapper'></div>
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
          // onClick={() =>
          //   handleSaveClassifier(
          //     classifierAction === classifierToEdit
          //       ? classifierToEdit
          //       : classifierToAdd,
          //   )
          // }
          >
            {classifierAction === classifierToEdit ? 'Редагувати' : 'Додати'}
          </Button>
        </div>
      )}
    </>
  );
};
