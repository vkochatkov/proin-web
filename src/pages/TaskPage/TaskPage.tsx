import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FilesList } from '../../components/FilesList/FilesList';
import { InteractiveInput } from '../../components/FormComponent/InteractiveInput';
import { TaskFilesUpload } from '../../components/FormComponent/TaskFilesUpload/TaskFilesUpload';
import { Button } from '../../components/FormElement/Button';
import { Header } from '../../components/Navigation/Header';
import { Card } from '../../components/UIElements/Card';
import { useForm } from '../../hooks/useForm';
import {
  removeFileFromTask,
  updateTaskFilesOrder,
} from '../../modules/actions/tasks';
import { setTabValue } from '../../modules/actions/tabs';
import { getCurrentTask } from '../../modules/selectors/currentTask';
import { IFile } from '../../modules/types/mainProjects';
import { SnackbarUI } from '../../components/UIElements/SnackbarUI';
import { TaskTabsMenu } from '../../components/TaskTabsMenu';
import { closeModal, openModal } from '../../modules/actions/modal';
import { RemoveModal } from '../../components/Modals/RemoveModal';

import '../HomePage.scss';
import './TaskPage.scss';

export const TaskPage = () => {
  const { inputHandler } = useForm(
    {
      name: {
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
  const task = useSelector(getCurrentTask);
  const { pid, subprojectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tabsId = 'main-tabs';
  const modalId = 'remove-file';
  const [selectedFileId, setSelectedFileId] = useState('');

  const handleCloseTaskPage = () => {
    if (pid && !subprojectId) {
      dispatch(setTabValue({ [tabsId]: 'Задачі' }));
      navigate(`/project-edit/${pid}`);
    } else if (subprojectId) {
      dispatch(setTabValue({ [tabsId]: 'Задачі' }));
      navigate(`/project-edit/${pid}/${subprojectId}`);
    } else {
      navigate(`/tasks`);
    }
  };

  const saveFilesOrder = (order: IFile[]) => {
    dispatch(updateTaskFilesOrder({ files: order, taskId: task._id }) as any);
  };

  const handleDeleteFile = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    dispatch(removeFileFromTask(task._id, selectedFileId) as any);
    dispatch(closeModal({ id: modalId }));
  };

  const handleOpenRemoveFileModal = (id: string) => {
    setSelectedFileId(id);
    dispatch(openModal({ id: modalId }));
  };

  return (
    <>
      <RemoveModal
        submitHandler={handleDeleteFile}
        modalId={modalId}
        text='файл'
      />
      <SnackbarUI />
      <div className='container'>
        <Header>
          <Button
            size='small'
            transparent={true}
            icon={true}
            customClassName='header__btn-close'
            onClick={handleCloseTaskPage}
          >
            <img src='/back.svg' alt='back_logo' className='button__icon' />
          </Button>
        </Header>
        <Card>
          <Card className='task-page__card'>
            <InteractiveInput
              id='name'
              inputHandler={inputHandler}
              entity={task}
            />
            <div className='task-page__input-wrapper'>
              <InteractiveInput
                label={'Опис'}
                id='description'
                inputHandler={inputHandler}
                entity={task}
              />
            </div>
            <FilesList
              files={task.files}
              saveFilesOrder={saveFilesOrder}
              handleOpenModal={handleOpenRemoveFileModal}
            />
            <div className='task-page__uploader'>
              <TaskFilesUpload id={'files'} />
            </div>
          </Card>
          <TaskTabsMenu />
          {/* <UserActivityDiary /> */}
        </Card>
      </div>
    </>
  );
};
