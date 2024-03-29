import { useEffect, useState } from 'react';
import {
  Avatar,
  Checkbox,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { ITask } from '../../modules/types/tasks';
import { Draggable } from '@hello-pangea/dnd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { chooseCurrentTaskSuccess } from '../../modules/actions/currentTask';
import { getFirstLetter, getStatusLabel } from '../../utils/utils';
import { backgroundColor } from '../../utils/avatar-view';
import { TaskStatusSelect } from '../FormComponent/TaskStatusSelect';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useContextMenu } from '../../hooks/useContextMenu';
import { Button } from '../FormElement/Button';
import { openModal } from '../../modules/actions/modal';
import { selectTask } from '../../modules/actions/selectedTask';
import { RootState } from '../../modules/store/store';
import { updateTaskById } from '../../modules/actions/tasks';
import { getUserTask } from '../../modules/selectors/userTasks';

import './TaskItem.scss';

export const TaskItem = ({
  task,
  index,
  generateNavigationString,
}: {
  task: ITask;
  index: number;
  generateNavigationString: (id: string) => void;
}) => {
  const { timestamp, actions, _id, status } = task;
  const navigate = useNavigate();
  const { pid } = useParams();
  const dispatch = useDispatch();
  const lastAction = actions ? actions[actions.length - 1] : null;
  const firstLetter = lastAction
    ? lastAction.name
      ? getFirstLetter(lastAction.name)
      : 'U'
    : null;
  const isStatusInfo = lastAction
    ? lastAction.description.includes('Статус')
    : false;
  const isFilesInfo = lastAction
    ? lastAction.description.includes('файл')
    : false;
  const { handleClose, handleContextMenu, contextMenuPosition, anchorEl } =
    useContextMenu();
  const [checked, setChecked] = useState(status === 'done');
  const taskWrapperStyle = {
    padding: '10px',
    marginTop: '5px',
    backgroundColor: checked ? 'rgba(236, 240, 241, 0.9)' : '',
  };
  const currentTask = useSelector((state: RootState) =>
    getUserTask(state)(_id),
  );
  const statusValues = ['new', 'in progress', 'done', 'canceled'];
  const [selectedValue, setSelectedValue] = useState(
    currentTask ? currentTask.status : statusValues[0],
  );
  const modalId = 'remove-task';

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

  useEffect(() => {
    setChecked(status === 'done');
  }, [status]);

  const handleOpenTaskPage = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      return;
    }

    dispatch(chooseCurrentTaskSuccess({ task }));

    if (anchorEl) {
      handleClose();
    } else {
      const query = generateNavigationString(task._id);
      navigate(`${query}`);
    }
  };

  const handleOpenModal = (modalId: string) => {
    dispatch(openModal({ id: modalId }));
    dispatch(selectTask(task._id));
  };

  const handleChangeCeckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!_id) return;

    const isChecked = e.target.checked;
    const finishedTaskStatus = 'done';
    const newTaskStatus = 'new';

    setChecked(e.target.checked);

    let newValue;

    if (isChecked) {
      setSelectedValue('done');
      newValue = finishedTaskStatus;
    } else {
      setSelectedValue('new');
      newValue = newTaskStatus;
    }

    dispatch(updateTaskById({ status: newValue }, _id, pid) as any);
  };

  return (
    <Draggable draggableId={task.taskId} index={index}>
      {(provided) => (
        <div
          onClick={(e) => handleOpenTaskPage(e)}
          ref={provided.innerRef}
          className='task-item'
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Paper style={taskWrapperStyle}>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorPosition={{
                top: contextMenuPosition.top,
                left: contextMenuPosition.left,
              }}
            >
              <MenuItem onClick={() => handleOpenModal(modalId)}>
                Видалити
              </MenuItem>
            </Menu>
            <div className='task-item__checkbox-wrapper'>
              <Checkbox
                sx={{
                  padding: 0,
                  marginRight: '10px',
                }}
                checked={checked}
                onChange={handleChangeCeckbox}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              <Typography
                sx={{
                  marginRight: '10px',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {task.name}
              </Typography>
            </div>
            <Button
              icon
              transparent
              customClassName='task-item__btn'
              onClick={handleContextMenu}
            >
              <MoreVertIcon className='item__icon' />
            </Button>
            <div className='task-item__select-wrapper'>
              <Typography
                variant='inherit'
                sx={{ color: '#979797' }}
              >{`${formattedDate} ${formattedTime}`}</Typography>
              <TaskStatusSelect
                id={_id}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
                valuesArray={statusValues}
              />
            </div>
            {lastAction && firstLetter && (
              <div className='task-item__align-center'>
                <Avatar
                  alt='Remy Sharp'
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
                <Typography variant='inherit' className='task-item__text'>
                  {formattedShortDate}:
                </Typography>
                <Typography
                  variant='inherit'
                  className='task-item__text'
                  sx={{
                    minWidth: '80px',
                  }}
                >
                  {lastAction.description}
                </Typography>
                {!isFilesInfo && (
                  <>
                    <div style={{ marginLeft: '5px' }}>&#8594;</div>
                    <Typography
                      variant='inherit'
                      className='task-item__value-text'
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
