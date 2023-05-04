import React from 'react';
import { Grid, Paper } from '@mui/material';
import { Button } from './FormElement/Button';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { openPopup } from '../modules/actions/popup';
import { useSelector } from 'react-redux';
import { getMembers } from '../modules/selectors/projectMembers';
import { Member } from './Member';

export const MembersInfo = () => {
  const dispatch = useDispatch();
  const members = useSelector(getMembers);

  const handleOpenInvitationPopup = () => {
    dispatch(openPopup({ id: 'invite' }));
  };

  return (
    <Paper style={{ padding: '20px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2rem',
        }}
      >
        <p style={{ margin: 0 }}>Додати користувача:</p>
        <Button transparent icon onClick={handleOpenInvitationPopup}>
          <AddIcon />
        </Button>
      </div>
      <hr />
      <Grid>
        {members.map((member) => (
          <Member key={member.userId} member={member} />
        ))}
      </Grid>
    </Paper>
  );
};
