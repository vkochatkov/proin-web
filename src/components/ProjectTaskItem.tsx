import { Paper, Typography } from '@mui/material';
import { ITask } from '../modules/types/currentProjectTasks';
import { Draggable } from '@hello-pangea/dnd';
import { useSelector } from 'react-redux';
import { getTasks } from '../modules/selectors/currentProjectTasks';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { chooseCurrentTaskSuccess } from '../modules/actions/currentTask';

export const ProjectTaskItem = ({
  task,
  index,
}: {
  task: ITask;
  index: number;
}) => {
  const { description, timestamp, name } = task;
  const taskWrapperStyle = { padding: '10px', marginTop: '5px' };
  const tasks = useSelector(getTasks);
  const navigate = useNavigate();
  const { pid } = useParams();
  const dispatch = useDispatch();

  // Convert the timestamp to a Date object
  const taskDate = new Date(timestamp);

  // Format the date and time
  const formattedDate = taskDate.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = taskDate.toLocaleTimeString('uk-UA', {
    hour: 'numeric',
    minute: 'numeric',
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
            <Typography
              variant="inherit"
              sx={{ color: '#979797' }}
            >{`${formattedDate} ${formattedTime}`}</Typography>
            <Typography variant="inherit">{name}</Typography>
            <Typography variant="inherit">{description}</Typography>
          </Paper>
        </div>
      )}
    </Draggable>
  );
};
