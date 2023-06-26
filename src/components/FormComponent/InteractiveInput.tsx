import { useEffect } from 'react';
import { Input } from '../FormElement/Input';
import { ProjectTextOutput } from './ProjectTextOutput';
import { useActiveInput } from '../../hooks/useActiveInput';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  setCurrentProject,
  updateProjectsSuccess,
} from '../../modules/actions/mainProjects';
import { Api } from '../../utils/API';
import { changeSnackbarState } from '../../modules/actions/snackbar';
import {
  updateCurrentTask,
  updateTaskState,
} from '../../modules/actions/currentTask';
import { useDebounce } from '../../hooks/useDebounce';
import { Project } from '../../modules/reducers/mainProjects';
import { fetchAllUserTasks, fetchTasks } from '../../modules/actions/tasks';
import {
  setCurrentTransaction,
  updateTransactionOnServer,
} from '../../modules/actions/transactions';

import './InteractiveInput.scss';

interface Props {
  inputHandler: (id: string, value: string, isValid: boolean) => void;
  entity: any | null;
  id: string;
  label?: string;
  entities?: any[];
  type?: string;
}

export const InteractiveInput = ({
  inputHandler,
  entity,
  id,
  label,
  entities = [],
  type,
}: Props) => {
  const { isActive, setIsActive, handleHideInput } = useActiveInput();
  const text = entity ? entity[id] : undefined;
  const { pid, subprojectId, tid, transactionId } = useParams();
  const dispatch = useDispatch();
  const { saveChanges } = useDebounce();

  useEffect(() => {
    if (
      (id === 'projectName' ||
        id === 'name' ||
        id === 'sum' ||
        id === 'classifier') &&
      !text
    ) {
      setIsActive(true);
    }
  }, [id, text]);

  const handleUpdatingArray = (updatedEntity: any, id: string) => {
    const entityIndex = entities.findIndex((entity) => entity._id === id);

    if (entityIndex === -1) {
      return;
    }

    return [
      ...entities.slice(0, entityIndex),
      updatedEntity,
      ...entities.slice(entityIndex + 1),
    ];
  };

  const handleChangeKeyValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = event.target.value;

    const updatedEntity = {
      ...entity,
      [id]: newValue,
    };

    if (updatedEntity.projectName === '' || updatedEntity.name === '') return;

    const callback = () =>
      Api.Projects.patch({ [id]: newValue }, entity._id)
        .then(() => {})
        .catch(() => {
          dispatch(
            changeSnackbarState({
              id: 'error',
              message: 'Не вдалося зберегти, щось пішло не так',
              open: true,
            }),
          );
        });

    if (pid && pid === updatedEntity._id) {
      dispatch(setCurrentProject(updatedEntity));
      saveChanges(callback);

      const updatedEntities: Project[] | undefined = handleUpdatingArray(
        updatedEntity,
        pid,
      );

      if (!updatedEntities) return;

      dispatch(updateProjectsSuccess(updatedEntities));
    }

    if (subprojectId && subprojectId === updatedEntity._id) {
      dispatch(setCurrentProject(updatedEntity));
      saveChanges(callback);
    }

    if (tid && tid === updatedEntity._id) {
      const callback = async () => {
        await dispatch(
          updateCurrentTask({ [id]: newValue }, updatedEntity._id) as any,
        );

        if (pid) {
          dispatch(fetchTasks(pid) as any);
        } else {
          dispatch(fetchAllUserTasks() as any);
        }
      };

      dispatch(updateTaskState({ task: updatedEntity }) as any);
      saveChanges(callback);
    }

    if (transactionId && transactionId === updatedEntity._id) {
      const callback = async () => {
        await dispatch(
          updateTransactionOnServer(
            {
              [id]: newValue,
            },
            transactionId,
            updatedEntity.projectId,
          ) as any,
        );
      };

      dispatch(setCurrentTransaction(updatedEntity));
      saveChanges(callback);
    }
  };

  return (
    <>
      {label ? <h3>{label}</h3> : null}
      {isActive && (
        <div onBlur={() => handleHideInput(id, text)}>
          <Input
            id={id}
            type={type ? type : undefined}
            element={id === 'description' ? 'textarea' : 'input'}
            onInput={inputHandler}
            isAnyValue={true}
            projectId={entity && entity.projectName ? entity._id : undefined}
            isUpdateValue={true}
            project={entity}
            isActive={isActive}
            changeHandler={handleChangeKeyValue}
          />
        </div>
      )}
      {!isActive && (
        <div
          onClick={(e) => {
            setIsActive(true);
          }}
        >
          {!text && id === 'description' && (
            <div className='project-input-editor__btn'>Додати опис</div>
          )}
          <ProjectTextOutput
            text={text ? text.toString() : text}
            fieldId={id}
          />
        </div>
      )}
    </>
  );
};
