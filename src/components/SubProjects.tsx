import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { openCurrentProject } from '../modules/actions/mainProjects';
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

  return (
    <>
      {currentProject &&
        currentProject.subProjects &&
        currentProject.subProjects.length > 0 && (
          <>
            <h3>Вкладені проекти</h3>
            <ListItems
              projects={currentProject.subProjects}
              updateOrder={() => console.log('updateOrder')}
              onClick={handleOpenProject}
            />
          </>
        )}
    </>
  );
};
