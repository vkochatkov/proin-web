import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { getAuth } from '../modules/selectors/user';
import { FilesList } from './FilesList/FilesList';
import { ProjectFilesUpload } from './FormComponent/ProjectFilesUpload/ProjectFilesUpload';
import { InteractiveInput } from './FormComponent/InteractiveInput';
import { ProjectTasksItem } from './ProjectTasksItem/ProjectTasksItem';
import { SubProjects } from './SubProjects';
import { TabsMenu } from './TabsMenu/TabsMenu';
import { UsersTabsMenu } from './UsersTabsMenu';
import { setIsActiveInput } from '../modules/actions/input';
import { IFile } from '../modules/types/mainProjects';
import {
  updateFilesOrder,
  updateSubprojectFilesOrder,
} from '../modules/actions/mainProjects';

interface IUsersTabsMenuProps {
  inputHandler: (id: string, value: string, isValid: boolean) => void;
  subprojectId?: string;
}

export const ProjectTabsMenu = ({
  inputHandler,
  subprojectId,
}: IUsersTabsMenuProps) => {
  const { token } = useSelector(getAuth);
  const currentProject = useSelector(getCurrentProject);
  const dispatch = useDispatch();
  const { pid } = useParams();

  const saveFilesOrder = (order: IFile[]) => {
    if (!pid) return;
    if (!subprojectId) {
      dispatch(updateFilesOrder(pid, order) as any);
    } else {
      dispatch(updateSubprojectFilesOrder(pid, subprojectId, order) as any);
    }
  };

  const tabs = [
    {
      label: 'Опис',
      panel: (
        <>
          <InteractiveInput
            id="description"
            inputHandler={inputHandler}
            token={token}
            entity={currentProject}
          />
          {subprojectId ? null : <SubProjects />}
          <UsersTabsMenu />
        </>
      ),
    },
    {
      label: 'Вкладення',
      panel: (
        <>
          <FilesList
            files={
              currentProject && currentProject.files ? currentProject.files : []
            }
            saveFilesOrder={saveFilesOrder}
          />
          <ProjectFilesUpload
            id={'files'}
            projectId={currentProject ? currentProject._id : undefined}
          />
        </>
      ),
    },
    { label: 'Фінанси', panel: <div>фінанси</div> },
    {
      label: 'Задачі',
      panel: <ProjectTasksItem />,
    },
  ];

  const handleOpenTaskNameInput = () => {
    dispatch(setIsActiveInput(true));
  };

  return <TabsMenu tabs={tabs} onClick={handleOpenTaskNameInput} />;
};
