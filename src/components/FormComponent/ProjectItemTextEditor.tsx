import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { useForm } from '../../hooks/useForm';
import {
  setCurrentProject,
  updateProject,
  updateProjectsSuccess,
} from '../../modules/actions/mainProjects';
import { Project } from '../../modules/reducers/mainProjects';
import { getCurrentProjects } from '../../modules/selectors/mainProjects';
import { getAuth } from '../../modules/selectors/user';
import { Input } from '../FormElement/Input';

import './ProjectItemTextEditor.scss';

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
  const dispatch = useDispatch();
  const { inputHandler } = useForm(
    {
      projectName: {
        value: '',
        isValid: true,
      },
    },
    true,
  );
  const { saveChanges } = useDebounce();

  const handleUpdateInputValue = useCallback(
    (inputKey: string, value: string, isValid: boolean) => {
      let updatedProjects;

      if (pid) {
        // Update subproject
        updatedProjects = projects.map((p) => {
          if (p._id === pid) {
            const updatedSubProjects = p.subProjects.map(
              (subProject: Project) =>
                subProject._id === id
                  ? { ...subProject, [inputKey]: value }
                  : subProject,
            );
            return { ...p, subProjects: updatedSubProjects };
          }
          return p;
        });

        const updatedProject = updatedProjects.find(
          (project) => project._id === pid,
        );

        if (!updatedProject) return;
        dispatch(setCurrentProject(updatedProject));
      } else {
        // Update main project
        const updatedProject = {
          ...project,
          [inputKey]: value,
        };

        updatedProjects = projects.map((p) =>
          p._id === id ? updatedProject : p,
        );
      }

      saveChanges(() =>
        dispatch(updateProject({ [inputKey]: value }, id) as any),
      );

      dispatch(updateProjectsSuccess(updatedProjects));
      inputHandler(inputKey, value, isValid);
    },

    [id, inputHandler, dispatch],
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
            projectId={id}
            isUpdateValue={true}
            project={project}
            isActive={isActive}
            className='project-item-text-editor__input'
          />
        </div>
      ) : (
        <p className='item__name'>{name}</p>
      )}
    </>
  );
};
