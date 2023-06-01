import { Avatar, Paper, Typography } from '@mui/material';
import { ITask } from '../../modules/types/currentProjectTasks';
import { Draggable } from '@hello-pangea/dnd';
import { useSelector } from 'react-redux';
import { getTasks } from '../../modules/selectors/currentProjectTasks';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { chooseCurrentTaskSuccess } from '../../modules/actions/currentTask';
import { getFirstLetter, getStatusLabel } from '../../utils/utils';
import { backgroundColor } from '../../utils/avatar-view';
import { TaskStatusSelect } from '../FormComponent/TaskStatusSelect';

import './ProjectTaskItem.scss';

export const ProjectTaskItem = ({
  task,
  index,
}: {
  task: ITask;
  index: number;
}) => {
  const { timestamp, actions, _id } = task;
  const taskWrapperStyle = { padding: '10px', marginTop: '5px' };
  const tasks = useSelector(getTasks);
  const navigate = useNavigate();
  const { pid } = useParams();
  const dispatch = useDispatch();
  const lastAction = actions ? actions[actions.length - 1] : null;
  const firstLetter = lastAction ? getFirstLetter(lastAction.name) : null;
  const isStatusInfo = lastAction
    ? lastAction.description.includes('Статус')
    : false;
  const isFilesInfo = lastAction
    ? lastAction.description.includes('файл')
    : false;

  // Convert the timestamp to a Date object
  const taskDate = new Date(timestamp);
  const actionDate = lastAction ? new Date(lastAction.timestamp) : null;

  // Format the date and time
  const formattedDate = taskDate.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
  const formattedTime = taskDate.toLocaleTimeString('uk-UA', {
    hour: 'numeric',
    minute: 'numeric',
  });
  const formattedShortDate =
    actionDate &&
    actionDate.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'numeric',
    });

  const handleOpenTaskPage = (id: string) => {
    const currentTask = tasks.find((task) => task._id === id);

    if (currentTask) {
      dispatch(chooseCurrentTaskSuccess({ task: currentTask }));
      navigate(`/project-edit/${pid}/task/${currentTask._id}`);
    }
  };

  return (
    <Draggable draggableId={task.taskId} index={index}>
      {(provided) => (
        <div
          onClick={() => handleOpenTaskPage(task._id)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Paper style={taskWrapperStyle}>
            <Typography variant="h6">{task.name}</Typography>
            <div className="task-item__select-wrapper">
              <Typography
                variant="inherit"
                sx={{ color: '#979797' }}
              >{`${formattedDate} ${formattedTime}`}</Typography>
              <TaskStatusSelect id={_id} />
            </div>
            {lastAction && firstLetter && (
              <div className="task-item__align-center">
                <Avatar
                  alt="Remy Sharp"
                  // src={logoLink}
                  sx={{
                    bgcolor: () => backgroundColor(firstLetter),
                    width: 20,
                    height: 20,
                    fontSize: '.7rem',
                  }}
                >
                  {firstLetter}
                </Avatar>
                <Typography variant="inherit" className="task-item__text">
                  {formattedShortDate}:
                </Typography>
                <Typography variant="inherit" className="task-item__text">
                  {lastAction.description}
                </Typography>
                {!isFilesInfo && (
                  <>
                    <div style={{ marginLeft: '5px' }}>&#8594;</div>
                    <Typography
                      variant="inherit"
                      className="task-item__value-text"
                    >
                      {isStatusInfo
                        ? getStatusLabel(lastAction.newValue)
                        : lastAction.newValue}
                    </Typography>
                  </>
                )}
              </div>
            )}
          </Paper>
        </div>
      )}
    </Draggable>
  );
};
