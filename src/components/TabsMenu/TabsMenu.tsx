import React, { SyntheticEvent } from 'react';
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

import './TabsMenu.scss';

interface TabData {
  label: string;
  panel: React.ReactNode;
}

interface TabsMenuProps {
  tabs: TabData[];
  handleCreateTaskName?: () => void;
  handleCreateSubproject?: () => void;
  tabsId: string;
  handleDownloadFiles?: () => void;
  handleCreateTransaction?: () => void;
}

export const TabsMenu: React.FC<TabsMenuProps> = ({
  tabs,
  handleCreateTaskName,
  handleCreateSubproject,
  handleDownloadFiles,
  handleCreateTransaction,
  tabsId,
}) => {
  const tabValue = useSelector((state: RootState) =>
    getValueByTabId(state)(tabsId),
  );
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { subprojectId } = useParams();
  const tabTextStyle = {
    textTransform: 'none',
    fontSize: isMobile ? '12px' : '1rem',
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

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    dispatch(setTabValue({ [tabsId]: newValue }));
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
              isTransactionsTab) && (
              <Button {...addButtonConfig}>
                <AddIcon />
              </Button>
            )}
            {tabs.map((tab) => (
              <Tab
                key={tab.label}
                value={tab.label}
                sx={tabStyle}
                label={
                  <Typography variant='body1' sx={tabTextStyle}>
                    {tab.label}
                  </Typography>
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
