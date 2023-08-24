import { useDispatch, useSelector } from 'react-redux';
import { useActiveInput } from '../../hooks/useActiveInput';
import { updateTransactionOnServer } from '../../modules/actions/transactions';
import { getCurrentTransaction } from '../../modules/selectors/currentTransaction';
import { Button } from '../FormElement/Button';
import AddIcon from '@mui/icons-material/Add';
import { getCurrentProject } from '../../modules/selectors/mainProjects';
import { setCurrentProject } from '../../modules/actions/mainProjects';
import { IClassifiers } from '../../modules/types/transactions';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import { Input } from '@mui/material';

interface IProps {}

export const AddClassifierInputComponent: React.FC<IProps> = () => {
  const dispatch = useDispatch();
  const { isActive, setIsActive } = useActiveInput() as {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  };
  const currentProject = useSelector(getCurrentProject);
  const [changedValue, setChangedValue] = useState('');
  const currentTransaction = useSelector(getCurrentTransaction);

  const handleSaveClassifier = () => {
    if (!currentProject) return;

    if (!currentTransaction.type) {
      return;
    }

    const classifiersKey: keyof IClassifiers = currentTransaction.type;

    const updatedClassifiers = {
      ...currentTransaction.classifiers,
      [classifiersKey]:
        currentTransaction.classifiers[classifiersKey].concat(changedValue),
    };

    const updatedProject = {
      ...currentProject,
      classifiers: updatedClassifiers,
    };

    dispatch(setCurrentProject(updatedProject));
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
              if (!changedValue) {
                setIsActive(false);
              }
            }}
            className='transaction__input-container'
          >
            <Input
              sx={{
                width: '95%',
              }}
              placeholder='Введіть класифікатор'
              value={changedValue}
              onChange={(e) => setChangedValue(e.target.value)}
            />
            <Button icon transparent onClick={handleSaveClassifier}>
              <CheckIcon />
            </Button>
          </div>
        </>
      )}
    </>
  );
};
