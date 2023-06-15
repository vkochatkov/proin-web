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

import './InteractiveInput.scss';

interface Props {
  inputHandler: (id: string, value: string, isValid: boolean) => void;
  entity: any | null;
  token: string;
  id: string;
  label?: string;
  entities?: any[];
}

export const InteractiveInput = ({
  inputHandler,
  entity,
  token,
  id,
  label,
  entities = [],
}: Props) => {
  const { isActive, setIsActive, handleHideInput } = useActiveInput();
  const text = entity ? entity[id] : undefined;
  const { pid, subprojectId, taskId } = useParams();
  const dispatch = useDispatch();
  const { saveChanges } = useDebounce();

  useEffect(() => {
    if ((id === 'projectName' || id === 'name') && !text) {
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
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;

    const updatedEntity = {
      ...entity,
      [id]: newValue,
    };

    if (updatedEntity.projectName === '') return;

    const callback = () =>
      Api.Projects.patch({ [id]: newValue }, entity._id)
        .then(() => {})
        .catch(() => {
          dispatch(
            changeSnackbarState({
              id: 'error',
              message: 'Не вдалося зберегти, щось пішло не так',
              open: true,
            })
          );
        });

    if (pid && pid === updatedEntity.id) {
      dispatch(setCurrentProject(updatedEntity));
      saveChanges(callback);

      const updatedEntities: Project[] | undefined = handleUpdatingArray(
        updatedEntity,
        pid
      );

      if (!updatedEntities) return;

      dispatch(updateProjectsSuccess(updatedEntities));
    }

    if (subprojectId && subprojectId === updatedEntity.id) {
      dispatch(setCurrentProject(updatedEntity));
      saveChanges(callback);
    }

    if (pid && taskId && taskId === updatedEntity._id) {
      const callback = async () => {
        await dispatch(
          updateCurrentTask({ [id]: newValue }, updatedEntity._id) as any
        );
        dispatch(fetchTasks(pid) as any);
      };

      dispatch(updateTaskState({ task: updatedEntity }) as any);
      saveChanges(callback);
    }

    if (!pid && taskId && taskId === updatedEntity._id) {
      const callback = async () => {
        await dispatch(
          updateCurrentTask({ [id]: newValue }, updatedEntity._id) as any
        );
        dispatch(fetchAllUserTasks() as any);
      };

      dispatch(updateTaskState({ task: updatedEntity }) as any);
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
            element={id === 'description' ? 'textarea' : 'input'}
            onInput={inputHandler}
            isAnyValue={true}
            isAutosave={true}
            projectId={entity && entity.projectName ? entity._id : undefined}
            token={token}
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
            <div className="project-input-editor__btn">Додати опис</div>
          )}
          <ProjectTextOutput text={text} fieldId={id} />
        </div>
      )}
    </>
  );
};
