import { CommentsList } from './CommentsList';
import { MembersInfo } from './MembersInfo';
import { TabsMenu } from './TabsMenu/TabsMenu';

export const UsersTabsMenu = () => {
  const tabsId = 'comment-tabs';
  const tabs = [
    {
      label: 'Коментарі',
      panel: <CommentsList />,
    },
    {
      label: 'Користувачі',
      panel: <MembersInfo />,
    },
  ];

  return <TabsMenu tabs={tabs} tabsId={tabsId} />;
};
