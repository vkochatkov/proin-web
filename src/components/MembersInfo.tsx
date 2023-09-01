import { Grid, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getMembers } from '../modules/selectors/projectMembers';
import { Member } from './Member/Member';

export const MembersInfo = () => {
  const members = useSelector(getMembers);

  return (
    <Paper style={{ padding: '20px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2rem',
        }}
      ></div>
      <Grid>
        {members.map((member) => (
          <Member
            key={member.userId}
            member={member}
            disabled={members.length <= 1}
          />
        ))}
      </Grid>
    </Paper>
  );
};
