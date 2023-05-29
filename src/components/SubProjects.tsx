import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  openCurrentProject,
  updatedSubProjectsOrder,
} from '../modules/actions/mainProjects';
import { Project } from '../modules/reducers/mainProjects';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { getAuth } from '../modules/selectors/user';
import { ListProjectItem } from './ListProjectItem';

export const SubProjects = () => {
  const currentProject = useSelector(getCurrentProject);
  const { token } = useSelector(getAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenProject = async (projectId: string) => {
    const sendRequest = true;

    if (!currentProject) return;
    navigate(`/project-edit/${currentProject._id}/${projectId}`);
    await dispatch(openCurrentProject(token, projectId, sendRequest) as any);
  };

  const handleUpdateSubProjectsOrder = (
    orderedProjects: Project[],
    index?: string
  ) => {
    if (!currentProject) return;

    const projectId = currentProject._id;

    dispatch(
      updatedSubProjectsOrder({
        projectId,
        newOrder: orderedProjects,
        subProjectIndex: index ? index : '0',
      }) as any
    );
  };

  return (
    <>
      {currentProject &&
        currentProject.subProjects &&
        currentProject.subProjects.length > 0 && (
          <>
            <h4>Вкладені проекти</h4>
            <ListProjectItem
              projects={currentProject.subProjects}
              updateOrder={handleUpdateSubProjectsOrder}
              onClick={handleOpenProject}
            />
          </>
        )}
    </>
  );
};
