import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentProject } from '../modules/selectors/mainProjects';
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
import { ProjectTransactionsComponent } from './ProjectTransactionsComponent/ProjectTransactionsComponent';
import { startLoading } from '../modules/actions/loading';

interface IUsersTabsMenuProps {
  inputHandler: (id: string, value: string, isValid: boolean) => void;
  subprojectId?: string;
}

export const ProjectTabsMenu: React.FC<IUsersTabsMenuProps> = ({
  inputHandler,
  subprojectId,
}) => {
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
            id='description'
            inputHandler={inputHandler}
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
    {
      label: 'Фінанси',
      panel: <ProjectTransactionsComponent />,
    },
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
    if (!pid) return;

    const projectId = pid && subprojectId ? subprojectId : pid;

    dispatch(startLoading());

    const {
      transaction: { id },
    } = await dispatch(createTransaction(projectId) as any);

    if (pid && !subprojectId) {
      navigate(`/project-edit/${pid}/transaction/${id}`);
    }

    if (subprojectId) {
      navigate(`/project-edit/${pid}/${subprojectId}/transaction/${id}`);
    }
  };

  return (
    <TabsMenu
      tabs={tabs}
      handleCreateTaskName={handleOpenTaskNameInput}
      handleCreateSubproject={handleCreateSubproject}
      handleDownloadFiles={handleDownloadFiles}
      handleCreateTransaction={handleCreateTransaction}
      tabsId={tabsId}
    />
  );
};
