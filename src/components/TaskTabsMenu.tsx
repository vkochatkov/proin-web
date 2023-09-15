import { useSelector } from 'react-redux';
import { getCurrentTask } from '../modules/selectors/currentTask';
import { TabsMenu } from './TabsMenu/TabsMenu';
import { UserActivityDiary } from './UserActivityDiary';
import { TaskCommentsComponent } from './TaskCommentsComponent';

export const TaskTabsMenu: React.FC = () => {
  const currentTask = useSelector(getCurrentTask);
  const tabsId = 'task-tabs';

  const tabs = [
    {
      label: 'Коментарі',
      panel: <TaskCommentsComponent currentObj={currentTask} />,
    },
    {
      label: 'Журнал',
      panel: <UserActivityDiary />,
    },
  ];

  return <TabsMenu tabs={tabs} tabsId={tabsId} />;
};
