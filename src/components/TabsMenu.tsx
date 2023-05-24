import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CommentsList } from './CommentsList';
import { MembersInfo } from './MembersInfo';
import { ProjectTasks } from './ProjectTasks/ProjectTasks';
import { Typography } from '@mui/material';

export default function TabsMenu() {
  const [value, setValue] = React.useState('1');
  const tabTextStyle = {
    textTransform: 'none',
  };
  const tabStyle = { padding: '2px' };
  const tabPanelStyle = { padding: '20px 5px 5px' };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', marginTop: '1rem' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            <Tab
              value="1"
              sx={tabStyle}
              label={
                <Typography variant="body1" sx={tabTextStyle}>
                  Коментарі
                </Typography>
              }
            />
            <Tab
              value="2"
              sx={tabStyle}
              label={
                <Typography variant="body1" sx={tabTextStyle}>
                  Задачі
                </Typography>
              }
            />
            <Tab
              value="3"
              sx={tabStyle}
              label={
                <Typography variant="body1" sx={tabTextStyle}>
                  Користувачі
                </Typography>
              }
            />
          </TabList>
        </Box>
        <TabPanel value="1" sx={tabPanelStyle}>
          <CommentsList />
        </TabPanel>
        <TabPanel value="2" sx={tabPanelStyle}>
          <ProjectTasks />
        </TabPanel>
        <TabPanel value="3" sx={tabPanelStyle}>
          <MembersInfo />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
