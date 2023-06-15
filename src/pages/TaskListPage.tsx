import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Container } from '@mui/material';
import { MainNavigation } from '../components/Navigation/MainNavigation';
import { ProjectTaskItemList } from '../components/ProjectTaskItemList/ProjectTaskItemList';
import { fetchAllUserTasks } from '../modules/actions/tasks';
import { changeUserTasksOrder } from '../modules/actions/userTasks';
import { getAllUserTasks } from '../modules/selectors/userTasks';
import { ITask } from '../modules/types/projectTasks';

type Props = {};

const TaskListPage: React.FC<Props> = () => {
  const tasks = useSelector(getAllUserTasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUserTasks() as any);
  }, []);

  const handleSaveTaskItemOrder = (newOrder: ITask[]) => {
    dispatch(changeUserTasksOrder(newOrder) as any);
  };

  const handleGenerateNavigationQuery = (id: string) => {
    return `/tasks/${id}`;
  };

  return (
    <>
      <div
        style={{
          width: '100%',
        }}
      >
        <MainNavigation>
          <div />
        </MainNavigation>
      </div>
      <Container>
        <Card
          sx={{
            '&.MuiPaper-root': {
              backgroundColor: 'rgba(248, 248, 248, 0.8)',
              padding: '0 5px',
            },
          }}
        >
          <ProjectTaskItemList
            tasks={tasks}
            changeOrder={handleSaveTaskItemOrder}
            generateNavigationString={handleGenerateNavigationQuery}
          />
        </Card>
      </Container>
    </>
  );
};

export default TaskListPage;
