import { useCallback, useEffect } from 'react';
import { Input } from '../FormElement/Input';
import { ProjectTextOutput } from './ProjectTextOutput';
import { useActiveInput } from '../../hooks/useActiveInput';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentProject } from '../../modules/actions/mainProjects';
import { debounce } from '../../utils/debounce';
import { Api } from '../../utils/API';
import { changeSnackbarState } from '../../modules/actions/snackbar';
import {
  updateCurrentTask,
  updateTaskState,
} from '../../modules/actions/currentTask';

import './ProjectInputEditor.scss';

interface Props {
  inputHandler: (id: string, value: string, isValid: boolean) => void;
  entity: any | null;
  token: string;
  id: string;
  label?: string;
}

export const InteractiveInput = ({
  inputHandler,
  entity,
  token,
  id,
  label,
}: Props) => {
  const { isActive, setIsActive, handleHideInput } = useActiveInput();
  const text = entity ? entity[id] : undefined;
  const { pid, subprojectId, taskId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if ((id === 'projectName' || id === 'name') && !text) {
      setIsActive(true);
    }
  }, [id, text]);

  const saveChanges = useCallback(
    debounce((callback: () => void) => {
      callback();
      // eslint-disable-next-line
    }, 1000),
    []
  );

  const handleChangeKeyValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;

    const updatedEntity = {
      ...entity,
      [id]: newValue,
    };

    if (updatedEntity.projectName === '') return;

    if (
      (pid && pid === updatedEntity.id) ||
      (subprojectId && subprojectId === updatedEntity.id)
    ) {
      dispatch(setCurrentProject(updatedEntity));

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

      saveChanges(callback);
    }

    if (pid && taskId && taskId === updatedEntity._id) {
      const callback = () =>
        dispatch(
          updateCurrentTask({ [id]: newValue }, pid, updatedEntity._id) as any
        );

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
