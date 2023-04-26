import { useSelector } from 'react-redux';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { ListItems } from './ListItems';

export const SubProjects = () => {
  const currentProject = useSelector(getCurrentProject);

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
              onClick={(projectId) => console.log(`click: ${projectId}`)}
            />
          </>
        )}
    </>
  );
};
