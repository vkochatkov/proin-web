import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CommentsList } from './CommentsList';
import { MembersInfo } from './MembersInfo';

export default function TabsMenu() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', marginTop: '1rem' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Коментарі" value="1" />
            <Tab label="Користувачі" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ padding: '20px 5px 5px' }}>
          <CommentsList />
        </TabPanel>
        <TabPanel value="2" sx={{ padding: '20px 5px 5px' }}>
          <MembersInfo />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
