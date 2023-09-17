import React, { SyntheticEvent, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Typography, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button } from '../FormElement/Button';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getValueByTabId } from '../../modules/selectors/tabs';
import { RootState } from '../../modules/store/store';
import { setTabValue } from '../../modules/actions/tabs';
import { setActiveTabIndex } from '../../modules/actions/activeTabIndex';
import { getCurrentTabIndex } from '../../modules/selectors/activeTabIndex';
import SettingsIcon from '@mui/icons-material/Settings';

import './TabsMenu.scss';

interface TabData {
  label: string;
  panel: React.ReactNode;
}

interface TabsMenuProps {
  tabs: TabData[];
  tabsId: string;
  isTabIndex?: boolean;
  handleCreateTaskName?: () => void;
  handleCreateSubproject?: () => void;
  handleDownloadFiles?: () => void;
  handleCreateTransaction?: () => void;
  handleInviteNewMember?: () => void;
}

export const TabsMenu: React.FC<TabsMenuProps> = ({
  tabs,
  handleCreateTaskName,
  handleCreateSubproject,
  handleDownloadFiles,
  handleCreateTransaction,
  handleInviteNewMember,
  tabsId,
  isTabIndex,
}) => {
  const tabValue = useSelector((state: RootState) =>
    getValueByTabId(state)(tabsId),
  );
  const transactionsTabValue = useSelector((state: RootState) =>
    getValueByTabId(state)('transaction-tabs'),
  );
  const classifierTab = 'Класифікатори';
  const activeTabIndex = useSelector(getCurrentTabIndex);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { subprojectId } = useParams();
  const tabTextStyle = {
    textTransform: 'none',
    fontSize: isMobile ? '11px' : '1rem',
  };
  const tabStyle = {
    padding: '0 5px',
    '&': {
      minWidth: 0,
    },
    '&.Mui-selected': { color: 'black' },
  };
  const tabPanelStyle = { padding: '15px 5px 5px' };
  const tabListStyle = {
    borderBottom: 1,
    borderColor: 'divider',
    '& .MuiTabs-indicator': { backgroundColor: 'black' },
  };
  const isTaskTab = tabValue === 'Задачі';
  const isDescriptionTab = tabValue === 'Опис' && !subprojectId;
  const isFilesTab = tabValue === 'Вкладення';
  const isTransactionsTab = tabValue === 'Фінанси';
  const isUsersTab = tabValue === 'Користувачі';

  useEffect(() => {
    if (isTabIndex && transactionsTabValue !== classifierTab) {
      const currentTabLabel = tabs[activeTabIndex].label;

      dispatch(setTabValue({ [tabsId]: currentTabLabel }));
    }
  }, [
    activeTabIndex,
    isTabIndex,
    dispatch,
    tabsId,
    tabs,
    transactionsTabValue,
  ]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    dispatch(setTabValue({ [tabsId]: newValue }));

    if (isTabIndex && newValue !== classifierTab) {
      const tabIndex = tabs.findIndex((tab) => tab.label === newValue);
      dispatch(setActiveTabIndex(tabIndex));
    }
  };

  const addButtonConfig = {
    onClick: () => {
      if (isTaskTab && handleCreateTaskName) {
        handleCreateTaskName();
      } else if (isDescriptionTab && handleCreateSubproject) {
        handleCreateSubproject();
      } else if (isFilesTab && handleDownloadFiles) {
        handleDownloadFiles();
      } else if (isTransactionsTab && handleCreateTransaction) {
        handleCreateTransaction();
      } else if (isUsersTab && handleInviteNewMember) {
        handleInviteNewMember();
      }
    },
    icon: true,
    transparent: true,
    customClassName: 'tabs-menu__btn',
  };

  return (
    <Box
      sx={{
        width: '100%',
        typography: 'body1',
        marginTop: '1rem',
      }}
    >
      <TabContext value={tabValue}>
        <Box sx={tabListStyle}>
          <TabList
            onChange={handleChange}
            sx={{
              position: 'relative',
            }}
          >
            {(isTaskTab ||
              isDescriptionTab ||
              isFilesTab ||
              isTransactionsTab ||
              isUsersTab) && (
              <Button {...addButtonConfig}>
                <AddIcon />
              </Button>
            )}
            {tabs.map((tab) => (
              <Tab
                key={tab.label}
                value={tab.label}
                sx={{
                  ...tabStyle,
                  ...(tab.label === classifierTab
                    ? { marginLeft: 'auto' }
                    : {}),
                }}
                label={
                  tab.label !== classifierTab && (
                    <Typography variant='body1' sx={tabTextStyle}>
                      {tab.label}
                    </Typography>
                  )
                }
                icon={
                  tab.label === classifierTab ? <SettingsIcon /> : undefined
                }
              />
            ))}
          </TabList>
        </Box>
        {tabs.map((tab) => (
          <TabPanel key={tab.label} value={tab.label} sx={tabPanelStyle}>
            {tab.panel}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};
