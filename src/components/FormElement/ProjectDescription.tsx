import { useState } from 'react';
import { Project } from '../../modules/reducers/mainProjects';
import { Input } from './Input';
import { ProjectTextOutput } from './ProjectTextOutput';

interface Props {
  inputHandler: (id: string, value: string, isValid: boolean) => void;
  project: Project | null;
  token: string;
}

export const ProjectDescription = ({ inputHandler, project, token }: Props) => {
  const [isActive, setIsActive] = useState(false);

  const handleHideInput = () => {
    setIsActive(false);
  };

  return (
    <>
      <h3>Опис</h3>
      {isActive && (
        <div onBlur={handleHideInput}>
          <Input
            id="description"
            element="textarea"
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
          style={{ minHeight: '10px' }}
          onClick={() => {
            setIsActive(true);
          }}
        >
          <ProjectTextOutput text={project ? project.description : undefined} />
        </div>
      )}
    </>
  );
};
