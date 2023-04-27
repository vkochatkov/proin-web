import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  openCurrentProject,
  updatedSubProjectsOrder,
} from '../modules/actions/mainProjects';
import { Project } from '../modules/reducers/mainProjects';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { getAuth } from '../modules/selectors/user';
import { ListItems } from './ListItems';

export const SubProjects = () => {
  const currentProject = useSelector(getCurrentProject);
  const { token } = useSelector(getAuth);
  const dispatch = useDispatch();

  const handleOpenProject = async (projectId: string) => {
    const sendRequest = true;

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
            <h3>Вкладені проекти</h3>
            <ListItems
              projects={currentProject.subProjects}
              updateOrder={handleUpdateSubProjectsOrder}
              onClick={handleOpenProject}
            />
          </>
        )}
    </>
  );
};
