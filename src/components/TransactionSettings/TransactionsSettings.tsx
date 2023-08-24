import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentProject } from '../../modules/selectors/mainProjects';
import {
  setCurrentProject,
  updateProject,
} from '../../modules/actions/mainProjects';
import { getProjectTransactions } from '../../modules/selectors/transactions';
import { IClassifiers, ITransaction } from '../../modules/types/transactions';
import { updateProjectTransactionsSuccess } from '../../modules/actions/transactions';
import { closeModal, openModal } from '../../modules/actions/modal';
import { RemoveClassifierModal } from '../Modals/RemoveClassifierModal';
import { ClassifiersComponent } from '../ClassifiersComponent/ClassifiersComponent';

import './TransactionSettings.scss';

const classifierToAdd = 'classifierToAdd';
const classifierToEdit = 'classifierToEdit';

export const TransactionsSettings = () => {
  const [valueForRemove, setValueForRemove] = useState('');
  const [selectedClassifierType, setSelectedClassifierType] =
    useState<string>('expenses');
  const currentProject = useSelector(getCurrentProject);
  const projectTransactions = useSelector(getProjectTransactions);
  const modalId = 'remove-classifier';
  const dispatch = useDispatch();

  const handleUpdatingClassifierValues = ({
    updatedClassifiers,
    type,
  }: {
    updatedClassifiers: IClassifiers;
    type: string;
  }) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      classifiers: updatedClassifiers,
    };

    dispatch(
      updateProject(
        {
          classifiers: updatedClassifiers[type],
          classifierType: type,
        },
        currentProject.id,
      ) as any,
    );
    dispatch(setCurrentProject(updatedProject));
  };

  const handleSaveClassifier = ({
    action,
    type,
    newValue,
    value,
  }: {
    action: string;
    type: string;
    newValue: string;
    value?: string;
  }) => {
    if (!currentProject) return;

    const classifiers = { ...currentProject.classifiers };
    let updatedClassifiers: IClassifiers = { ...classifiers };

    if (action === classifierToEdit && value) {
      const transactionsToUpdate = JSON.parse(
        JSON.stringify(projectTransactions),
      );

      const classifierIndex = updatedClassifiers[type].findIndex(
        (classifier: string) => classifier === value,
      );

      updatedClassifiers[type] = updatedClassifiers[type].map(
        (classifier: string) => (classifier === value ? newValue : classifier),
      );

      transactionsToUpdate.forEach((transaction: ITransaction) => {
        if (transaction.classifier === value) {
          transaction.classifier = updatedClassifiers[type][classifierIndex];
        }
      });

      dispatch(
        updateProjectTransactionsSuccess({
          transactions: transactionsToUpdate,
        }),
      );
    }

    if (action === classifierToAdd) {
      updatedClassifiers[type] = updatedClassifiers[type].concat([newValue]);
    }

    handleUpdatingClassifierValues({ updatedClassifiers, type });
  };

  const handleRemoveClassifier = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!currentProject) return;

    const updatedClassifiers = {
      ...currentProject.classifiers,
      [selectedClassifierType]: currentProject.classifiers[
        selectedClassifierType
      ].filter((classifier: string) => classifier !== valueForRemove),
    };
    const transactionsToUpdate = JSON.parse(
      JSON.stringify(projectTransactions),
    );

    transactionsToUpdate.forEach((transaction: ITransaction) => {
      if (transaction.classifier === valueForRemove) {
        transaction.classifier = '';
      }
    });

    dispatch(
      updateProjectTransactionsSuccess({
        transactions: transactionsToUpdate,
      }),
    );
    handleUpdatingClassifierValues({
      updatedClassifiers,
      type: selectedClassifierType,
    });
    dispatch(closeModal({ id: modalId }));
  };

  const handleOpenModal = (type: string, classifier: string) => {
    setSelectedClassifierType(type);
    setValueForRemove(classifier);

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
        classifiers={currentProject ? currentProject.classifiers.expenses : []}
        label='Витрати'
        type='expenses'
        action={{ classifierToAdd, classifierToEdit }}
        onSubmit={handleSaveClassifier}
        onOpenModal={handleOpenModal}
      />
      <ClassifiersComponent
        classifiers={currentProject ? currentProject.classifiers.income : []}
        label='Доходи'
        type='income'
        action={{ classifierToAdd, classifierToEdit }}
        onSubmit={handleSaveClassifier}
        onOpenModal={handleOpenModal}
      />
      <ClassifiersComponent
        classifiers={currentProject ? currentProject.classifiers.transfer : []}
        label='Переказ'
        type='transfer'
        action={{ classifierToAdd, classifierToEdit }}
        onSubmit={handleSaveClassifier}
        onOpenModal={handleOpenModal}
      />
    </>
  );
};
