import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PROJECTS_PATH } from '../config/routes';
import {
  openCurrentProject,
  updatedSubProjectsOrder,
} from '../modules/actions/mainProjects';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { ListProjectItem } from './ListProjectItem';
import { Project } from '../modules/types/mainProjects';

export const SubProjects = () => {
  const currentProject = useSelector(getCurrentProject);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenProject = async (projectId: string) => {
    const sendRequest = true;

    if (!currentProject) return;
    navigate(`${PROJECTS_PATH}/${currentProject._id}/${projectId}`);
    await dispatch(openCurrentProject(projectId, sendRequest) as any);
  };

  const handleUpdateSubProjectsOrder = (
    orderedProjects: Project[],
    index?: string,
  ) => {
    if (!currentProject) return;

    const projectId = currentProject._id;

    dispatch(
      updatedSubProjectsOrder({
        projectId,
        newOrder: orderedProjects,
        subProjectIndex: index ? index : '0',
      }) as any,
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
