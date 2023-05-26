import { useEffect } from 'react';
import { Project } from '../../modules/reducers/mainProjects';
import { Input } from '../FormElement/Input';
import { ProjectTextOutput } from './ProjectTextOutput';
import { useActiveInput } from '../../hooks/useActiveInput';

import './ProjectInputEditor.scss';

interface Props {
  inputHandler: (id: string, value: string, isValid: boolean) => void;
  project: Project | null;
  token: string;
  id: string;
  label?: string;
}

export const InteractiveInput = ({
  inputHandler,
  project,
  token,
  id,
  label,
}: Props) => {
  const { isActive, setIsActive, handleHideInput } = useActiveInput();
  const text = project ? project[id] : undefined;

  useEffect(() => {
    if (id === 'projectName' && !text) {
      setIsActive(true);
    }
  }, [id, text]);

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
            projectId={project ? project._id : undefined}
            token={token}
            isUpdateValue={true}
            project={project}
            isActive={isActive}
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
