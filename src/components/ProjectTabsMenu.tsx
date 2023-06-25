import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { getAuth } from '../modules/selectors/user';
import { FilesList } from './FilesList/FilesList';
import { ProjectFilesUpload } from './FormComponent/ProjectFilesUpload/ProjectFilesUpload';
import { InteractiveInput } from './FormComponent/InteractiveInput';
import { SubProjects } from './SubProjects';
import { TabsMenu } from './TabsMenu/TabsMenu';
import { UsersTabsMenu } from './UsersTabsMenu';
import { setIsActiveInput } from '../modules/actions/input';
import { IFile } from '../modules/types/mainProjects';
import {
  createNewSubproject,
  fetchProjects,
  updateFilesOrder,
  updateSubprojectFilesOrder,
} from '../modules/actions/mainProjects';
import { ProjectTasksComponent } from './ProjectTasksComponent';
import { useContext } from 'react';
import FilePickerRefContext from './ContextProvider/FilesPickerRefProvider';
import { createTransaction } from '../modules/actions/transactions';

interface IUsersTabsMenuProps {
  inputHandler: (id: string, value: string, isValid: boolean) => void;
  subprojectId?: string;
}

export const ProjectTabsMenu: React.FC<IUsersTabsMenuProps> = ({
  inputHandler,
  subprojectId,
}) => {
  const { token } = useSelector(getAuth);
  const currentProject = useSelector(getCurrentProject);
  const dispatch = useDispatch();
  const { pid } = useParams();
  const navigate = useNavigate();
  const tabsId = 'main-tabs';
  const filePickerRef = useContext(FilePickerRefContext);

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
    { label: 'Фінанси', panel: <div>finance</div> },
    {
      label: 'Задачі',
      panel: <ProjectTasksComponent />,
    },
  ];

  const handleOpenTaskNameInput = () => {
    dispatch(setIsActiveInput(true));
  };

  const handleCreateSubproject = async () => {
    if (!pid) return;

    try {
      const { _id } = await dispatch(createNewSubproject(pid) as any);

      navigate(`/project-edit/${pid}/${_id}`);
      await dispatch(fetchProjects() as any);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadFiles = () => {
    if (!filePickerRef) return;

    filePickerRef.current?.click();
  };

  const handleCreateTransaction = async () => {
    if (!pid) return

    const { transaction: { id } } = await dispatch(
      createTransaction(pid) as any
      );

    navigate(`/project-edit/${pid}/transaction/${id}`);
  };

  return (
    <TabsMenu
      tabs={tabs}
      handleClickCreateTaskButton={handleOpenTaskNameInput}
      handleCreateSubproject={handleCreateSubproject}
      handleDownloadFiles={handleDownloadFiles}
      handleCreateTransaction={handleCreateTransaction}
      tabsId={tabsId}
    />
  );
};
