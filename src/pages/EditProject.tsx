import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { useForm } from '../hooks/useForm';
import {
  getCurrentProject,
  getCurrentProjectId,
  getCurrentProjects,
} from '../modules/selectors/mainProjects';
import { Button } from '../components/FormElement/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Navigation/Header';
import { getIsLoading } from '../modules/selectors/loading';
import {
  clearCurrentProject,
  fetchProjects,
  openCurrentProject,
} from '../modules/actions/mainProjects';
import { Card } from '@mui/joy';
import { SnackbarUI } from '../components/UIElements/SnackbarUI';
import { InviteModal } from '../components/Modals/InviteModal';
import { MoveProjectModal } from '../components/Modals/MoveProjectModal';
import { Project } from '../modules/reducers/mainProjects';
import { RemoveProjectModal } from '../components/Modals/RemoveProjectModal';
import { clearFormInput } from '../modules/actions/form';
import { ImageUpload } from '../components/FormComponent/ImageUpload';
import { endLoading, startLoading } from '../modules/actions/loading';
import { fetchTasks } from '../modules/actions/tasks';
import { ProjectTabsMenu } from '../components/ProjectTabsMenu';
import { RemoveTaskModal } from '../components/Modals/RemoveTaskModal';
import { setDefaultTabValue } from '../modules/actions/tabs';
import { FilePickerRefProvider } from '../components/ContextProvider/FilesPickerRefProvider';
import {
  fetchTransactions,
  saveProjectTransactionsOrder,
} from '../modules/actions/transactions';
import { RemoveTransactionModal } from '../components/Modals/RemoveTransactionModal';
import { getProjectTransactions } from '../modules/selectors/transactions';
import { ITransaction } from '../modules/types/transactions';
import { TransactionListSlider } from '../components/TransactionListSlider/TransactionListSlider';
import { RootState } from '../modules/store/store';
import { getValueByTabId } from '../modules/selectors/tabs';

import './HomePage.scss';

type Props = {};

const EditProject: React.FC<Props> = () => {
  const { pid, subprojectId } = useParams();
  const isLoading = useSelector(getIsLoading);
  const currentProject = useSelector(getCurrentProject);
  const currentProjectId = useSelector(getCurrentProjectId);
  const projects = useSelector(getCurrentProjects);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const transactions = useSelector(getProjectTransactions);
  const { inputHandler } = useForm(
    {
      projectName: {
        value: '',
        isValid: true,
      },
      description: {
        value: '',
        isValid: true,
      },
    },
    true,
  );
  const tabValue = useSelector((state: RootState) =>
    getValueByTabId(state)('main-tabs'),
  );

  useEffect(() => {
    if (!currentProjectId || !pid) return;

    if (pid === currentProjectId) {
      dispatch(fetchTasks(pid) as any);
      dispatch(fetchTransactions(pid) as any);
    }

    if (!subprojectId) return;

    if (subprojectId === currentProjectId) {
      dispatch(fetchTasks(subprojectId) as any);
      dispatch(fetchTransactions(subprojectId) as any);
    }

    // eslint-disable-next-line
  }, [dispatch, currentProjectId]);

  useEffect(() => {
    if (!currentProject || (currentProject && !currentProject._id)) return;

    const foundProjects = projects.find((project) =>
      project.subProjects.some((p: Project) => p.id === subprojectId),
    );

    const subProject = foundProjects ? foundProjects.subProjects[0] : null;

    if (
      pid &&
      !subprojectId &&
      currentProject &&
      currentProject._id.length !== pid.length
    ) {
      navigate('/');
      return;
    }

    if (
      pid &&
      currentProject._id &&
      currentProject._id !== pid &&
      !subprojectId
    ) {
      dispatch(openCurrentProject(pid) as any);
      return;
    }

    if (pid && !currentProject && !subprojectId) {
      dispatch(openCurrentProject(pid) as any);
      return;
    }

    if (
      subprojectId &&
      currentProject &&
      currentProject.id &&
      currentProject.id.length !== subprojectId.length
    ) {
      navigate(`/project-edit/${pid}`);
      return;
    }

    if (subprojectId && subProject && !currentProject) {
      dispatch(openCurrentProject(subprojectId, true) as any);

      return;
    }

    if (subprojectId && currentProject && currentProject.id !== subprojectId) {
      dispatch(openCurrentProject(subprojectId, true) as any);
    }
    // eslint-disable-next-line
  }, [pid, subprojectId, currentProject, navigate, dispatch]);

  const handleCloseProject = async () => {
    if (subprojectId) {
      dispatch(startLoading());
      await dispatch(fetchProjects() as any);
      navigate(`/project-edit/${pid}`);
      dispatch(endLoading());
      dispatch(setDefaultTabValue());
    } else {
      navigate('/');
      dispatch(clearCurrentProject());
      dispatch(clearFormInput());
      dispatch(setDefaultTabValue());
    }
  };

  const handleChangeTaskItemOrder = (newOrder: ITransaction[]) => {
    if (!pid) return;

    if (!subprojectId) {
      dispatch(saveProjectTransactionsOrder(newOrder, pid) as any);
    } else {
      dispatch(saveProjectTransactionsOrder(newOrder, subprojectId) as any);
    }
  };

  const handleGenerateNavigationQuery = (id: string) => {
    const query =
      pid && subprojectId
        ? `/project-edit/${pid}/${subprojectId}/transaction/${id}`
        : `/project-edit/${pid}/transaction/${id}`;

    return query;
  };

  return (
    <>
      <div className='container'>
        <Header>
          <Button
            size='small'
            transparent={true}
            icon={true}
            customClassName='header__btn-close'
            onClick={handleCloseProject}
          >
            <img src='/back.svg' alt='back_logo' className='button__icon' />
          </Button>
        </Header>
        {isLoading ? (
          <div className='loading'>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <Card
              sx={{
                background: 'rgba(248, 248, 248, .8)',
                margin: '0 1rem',
              }}
            >
              <div>
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  ></div>
                  <FilePickerRefProvider>
                    <ImageUpload
                      onInput={inputHandler}
                      projectId={
                        currentProject ? currentProject._id : undefined
                      }
                      id='logoUrl'
                      inputHandler={inputHandler}
                      isUpdateValue={true}
                    />
                    <ProjectTabsMenu
                      subprojectId={subprojectId}
                      inputHandler={inputHandler}
                    />
                  </FilePickerRefProvider>
                </>
              </div>
            </Card>
            {tabValue === 'Фінанси' &&
              transactions &&
              transactions.length > 0 && (
                <div
                  style={{
                    margin: '1rem',
                  }}
                >
                  <TransactionListSlider
                    generateNavigationString={handleGenerateNavigationQuery}
                    transactions={transactions}
                  />
                </div>
              )}
          </>
        )}
      </div>
      <InviteModal />
      <MoveProjectModal />
      <SnackbarUI />
      <RemoveProjectModal />
      <RemoveTaskModal />
      <RemoveTransactionModal />
    </>
  );
};

export default EditProject;
