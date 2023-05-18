import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { updateProjects } from '../../modules/actions/mainProjects';
import { Project } from '../../modules/reducers/mainProjects';
import { getCurrentProjects } from '../../modules/selectors/mainProjects';
import { getAuth } from '../../modules/selectors/user';
import { Input } from '../FormElement/Input';

interface IProps {
  id: string;
  onBlur: (id: string, text: string) => void;
  name: string;
  isActive: boolean;
  project: Project;
}

export const ProjectItemTextEditor = ({
  id,
  onBlur,
  name,
  isActive,
  project,
}: IProps) => {
  const projects = useSelector(getCurrentProjects);
  const { pid } = useParams();
  const { token } = useSelector(getAuth);
  const dispatch = useDispatch();
  const { inputHandler } = useForm(
    {
      projectName: {
        value: '',
        isValid: true,
      },
    },
    true
  );

  const handleUpdateInputValue = useCallback(
    (inputKey: string, value: string, isValid: boolean) => {
      const updatedProject = {
        ...project,
        [inputKey]: value,
      };

      const updatedProjects = projects.map((p) =>
        p._id === id ? updatedProject : p
      );

      dispatch(updateProjects(updatedProjects));
      inputHandler(inputKey, value, isValid);
    },

    [id, inputHandler, dispatch]
  );

  return (
    <>
      {isActive ? (
        <div onBlur={() => onBlur(id, name)}>
          <Input
            id={'projectName'}
            element={'input'}
            onInput={handleUpdateInputValue}
            isAnyValue={true}
            isAutosave={true}
            projectId={id}
            token={token}
            isUpdateValue={true}
            project={project}
            isActive={isActive}
          />
        </div>
      ) : (
        <p className="item__name">{name}</p>
      )}
    </>
  );
};
