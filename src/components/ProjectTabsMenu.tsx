import { useSelector } from 'react-redux';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { getAuth } from '../modules/selectors/user';
import { FilesList } from './FilesList/FilesList';
import { FilesUpload } from './FormComponent/FileUploader/FilesUpload';
import { InteractiveInput } from './FormComponent/InteractiveInput';
import { ProjectTasks } from './ProjectTasksItem/ProjectTasksItem';
import { SubProjects } from './SubProjects';
import { TabsMenu } from './TabsMenu/TabsMenu';
import { UsersTabsMenu } from './UsersTabsMenu';
import { useDispatch } from 'react-redux';
import { setIsActiveInput } from '../modules/actions/input';

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
          <FilesList />
          <FilesUpload
            id={'files'}
            projectId={currentProject ? currentProject._id : undefined}
          />
        </>
      ),
    },
    { label: 'Фінанси', panel: <div>фінанси</div> },
    {
      label: 'Задачі',
      panel: <ProjectTasks />,
    },
  ];

  const handleOpenTaskNameInput = () => {
    dispatch(setIsActiveInput(true));
  };

  return <TabsMenu tabs={tabs} onClick={handleOpenTaskNameInput} />;
};
