import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FilesList } from '../../components/FilesList/FilesList';
import { InteractiveInput } from '../../components/FormComponent/InteractiveInput';
import { FileUploadComponent } from '../../components/FormComponent/FileUploadComponent/FileUploadComponent';
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
import { closeModal } from '../../modules/actions/modal';
import { RemoveModal } from '../../components/Modals/RemoveModal';
import { useFiles } from '../../hooks/useFiles';
import { updateCurrentTask } from '../../modules/actions/currentTask';
import { PROJECTS_PATH } from '../../config/routes';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button } from '../../components/FormElement/Button';
import { getAllUserProjects } from '../../modules/selectors/mainProjects';
import { useOpenProjectLink } from '../../hooks/useOpenProjectLink';
import { useDraggingMode } from '../../hooks/useDraggingMode';
import { FormControlLabel, Switch } from '@mui/material';

import '../../index.scss';
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
  const { pid, subprojectId, tid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(getAllUserProjects);
  const currentProject = projects.find(
    (project) => project._id === task.projectId,
  );
  const tabsId = 'main-tabs';
  const modalId = 'remove-file';
  const {
    files,
    setFiles,
    generateDataUrl,
    selectedFileId,
    handleOpenRemoveFileModal,
  } = useFiles(modalId);
  const { handleOpenTheProject } = useOpenProjectLink();
  const { draggingMode, handleChangeDraggingMode } = useDraggingMode();

  const handleCloseTaskPage = () => {
    if (pid && !subprojectId) {
      dispatch(setTabValue({ [tabsId]: 'Задачі' }));
      navigate(`${PROJECTS_PATH}/${pid}`);
    } else if (subprojectId) {
      dispatch(setTabValue({ [tabsId]: 'Задачі' }));
      navigate(`${PROJECTS_PATH}/${pid}/${subprojectId}`);
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

  const sendFilesToServer = async (files: File[]) => {
    try {
      const fileDataArray = await generateDataUrl(files);

      if (!task.projectId || !tid) return;

      dispatch(
        updateCurrentTask(
          { files: fileDataArray, projectId: task.projectId },
          tid,
        ) as any,
      );
    } catch (err) {
      console.log(err);
    }
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
        <Card>
          <Button
            size='small'
            transparent
            icon
            customClassName='back__btn'
            onClick={handleCloseTaskPage}
          >
            <ArrowBackIosIcon />
            <p>Назад</p>
          </Button>
          <h3 className='task-page__title'>Проект</h3>
          <p
            style={{
              cursor: 'pointer',
            }}
            onClick={
              currentProject
                ? (e) => handleOpenTheProject(e, currentProject)
                : undefined
            }
          >
            {currentProject?.projectName}
          </p>
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
            {task.files.length > 0 && (
              <FormControlLabel
                control={<Switch onChange={handleChangeDraggingMode} />}
                label='Режим перетягування'
              />
            )}
            <FilesList
              files={task.files}
              saveFilesOrder={saveFilesOrder}
              handleOpenModal={handleOpenRemoveFileModal}
              draggingMode={draggingMode}
            />
            <div className='task-page__uploader'>
              <FileUploadComponent
                id={'files'}
                files={files}
                setFiles={setFiles}
                sendFilesToServer={sendFilesToServer}
              />
            </div>
          </Card>
          <TaskTabsMenu />
        </Card>
      </div>
    </>
  );
};
