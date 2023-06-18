import { TabsMenu } from './TabsMenu/TabsMenu';
import { UserActivityDiary } from './UserActivityDiary';

export const TaskTabsMenu = () => {
  const tabsId = 'task-tabs';
  const tabs = [
    {
      label: 'Коментарі',
      // panel: <CommentsList />,
      panel: <div>comments</div>,
    },
    {
      label: 'Щоденник',
      panel: <UserActivityDiary />,
    },
  ];

  return <TabsMenu tabs={tabs} tabsId={tabsId} />;
};
