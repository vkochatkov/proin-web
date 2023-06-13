import { Card, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { MainNavigation } from '../components/Navigation/MainNavigation';
import { ProjectTaskItemList } from '../components/ProjectTaskItemList/ProjectTaskItemList';
import { getAllUserTasks } from '../modules/selectors/userTasks';
import { ITask } from '../modules/types/projectTasks';

type Props = {};

const TaskListPage: React.FC<Props> = () => {
  const tasks = useSelector(getAllUserTasks);

  const handleSaveTaskItemOrder = (newOrder: ITask[]) => {};

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
          />
        </Card>
      </Container>
    </>
  );
};

export default TaskListPage;
