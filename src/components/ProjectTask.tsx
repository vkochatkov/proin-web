import { Paper, Typography } from '@mui/material';
import { ITask } from '../modules/types/currentProjectTasks';

export const ProjectTask = ({
  task,
  index,
}: {
  task: ITask;
  index: number;
}) => {
  const { description, timestamp, name } = task;
  const taskWrapperStyle = { padding: '10px', marginTop: '5px' };

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

  return (
    <Paper style={taskWrapperStyle}>
      <Typography
        variant="inherit"
        sx={{ color: '#979797' }}
      >{`${formattedDate} ${formattedTime}`}</Typography>
      <Typography variant="inherit">{name}</Typography>
      <Typography variant="inherit">{description}</Typography>
      {/* Display other task details */}
    </Paper>
  );
};
