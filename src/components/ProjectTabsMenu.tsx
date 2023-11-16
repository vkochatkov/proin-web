import { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { InteractiveInput } from './FormComponent/InteractiveInput';
import { SubProjects } from './SubProjects';
import { TabsMenu } from './TabsMenu/TabsMenu';
import { ProjectCommentsComponent } from './ProjectCommentsComponent';
import { setIsActiveInput } from '../modules/actions/input';
import {
  createNewSubproject,
  fetchProjects,
} from '../modules/actions/mainProjects';
import { ProjectTasksComponent } from './ProjectTasksComponent';
import FilePickerRefContext from './ContextProvider/FilesPickerRefProvider';
import { createTransaction } from '../modules/actions/transactions';
import { ProjectTransactionsComponent } from './ProjectTransactionsComponent/ProjectTransactionsComponent';
import { startLoading } from '../modules/actions/loading';
import { openModal } from '../modules/actions/modal';
import { MembersInfo } from './MembersInfo';
import { PROJECTS_PATH } from '../config/routes';
import { FilesComponent } from './FilesComponent';
import { setDefaultTabValue } from '../modules/actions/tabs';

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
          <ProjectCommentsComponent currentObj={currentProject} />
        </>
      ),
    },
    {
      label: 'Вкладення',
      panel: <FilesComponent subprojectId={subprojectId} />,
    },
    {
      label: 'Фінанси',
      panel: <ProjectTransactionsComponent />,
    },
    {
      label: 'Задачі',
      panel: <ProjectTasksComponent />,
    },
    {
      label: 'Користувачі',
      panel: <MembersInfo />,
    },
  ];

  useEffect(() => {
    return () => {
      dispatch(setDefaultTabValue());
    };
  }, [pid]);

  const handleOpenTaskNameInput = () => {
    dispatch(setIsActiveInput(true));
  };

  const handleCreateSubproject = async () => {
    if (!pid) return;

    try {
      const { _id } = await dispatch(createNewSubproject(pid) as any);

      navigate(`${PROJECTS_PATH}/${pid}/${_id}`);
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
      navigate(`${PROJECTS_PATH}/${pid}/transaction/${id}`);
    }

    if (subprojectId) {
      navigate(`${PROJECTS_PATH}/${pid}/${subprojectId}/transaction/${id}`);
    }
  };

  const handleOpenInvitationPopup = () => {
    const inviteModalId = 'invite';

    dispatch(openModal({ id: inviteModalId }));
  };

  return (
    <TabsMenu
      tabs={tabs}
      handleCreateTaskName={handleOpenTaskNameInput}
      handleCreateSubproject={handleCreateSubproject}
      handleDownloadFiles={handleDownloadFiles}
      handleCreateTransaction={handleCreateTransaction}
      handleInviteNewMember={handleOpenInvitationPopup}
      tabsId={tabsId}
    />
  );
};
