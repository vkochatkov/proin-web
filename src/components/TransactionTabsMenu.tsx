import { TabsMenu } from './TabsMenu/TabsMenu';

interface IProps {}

export const TransactionTabsMenu: React.FC<IProps> = () => {
  const tabsId = 'transaction-tabs';

  const tabs = [
    {
      label: 'Всі',
      panel: null,
    },
    {
      label: 'Витрати',
      panel: null,
    },
    {
      label: 'Доходи',
      panel: null,
    },
    {
      label: 'Перекази',
      panel: null,
    },
  ];

  return <TabsMenu tabs={tabs} isTabIndex tabsId={tabsId} />;
};
