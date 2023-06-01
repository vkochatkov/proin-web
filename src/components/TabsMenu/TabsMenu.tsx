import React, { SyntheticEvent, useState } from 'react';
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

import './TabsMenu.scss';

interface TabData {
  label: string;
  panel: React.ReactNode;
}

interface TabsMenuProps {
  tabs: TabData[];
  handleTasksClick?: () => void;
  handleCreateSubproject?: () => void;
}

export const TabsMenu = ({
  tabs,
  handleTasksClick,
  handleCreateSubproject,
}: TabsMenuProps) => {
  const [value, setValue] = useState(tabs[0].label);
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
  const tabPanelStyle = { padding: '20px 5px 5px' };
  const tabListStyle = {
    borderBottom: 1,
    borderColor: 'divider',
    '& .MuiTabs-indicator': { backgroundColor: 'black' },
  };
  const isTaskTab = value === 'Задачі';
  const isDescriptionTab = value === 'Опис' && !subprojectId;

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const addButtonConfig = {
    onClick: () => {
      if (isTaskTab && handleTasksClick) {
        handleTasksClick();
      } else if (isDescriptionTab && handleCreateSubproject) {
        handleCreateSubproject();
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
      <TabContext value={value}>
        <Box sx={tabListStyle}>
          <TabList
            onChange={handleChange}
            sx={{
              position: 'relative',
            }}
          >
            {(isTaskTab || isDescriptionTab) && (
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
                  <Typography variant="body1" sx={tabTextStyle}>
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
