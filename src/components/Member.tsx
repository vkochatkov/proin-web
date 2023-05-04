import React from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Grid } from '@mui/material';
import { IMember } from '../modules/types/projectMembers';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from './FormElement/Button';
import { backgroundColor } from '../utils/avatar-view';
import { removeProjectMember } from '../modules/actions/projectMembers';
import { useParams } from 'react-router-dom';

import './Member.scss';

export const Member = ({ member }: { member: IMember }) => {
  const dispatch = useDispatch();
  const id = member.userId;
  const firstLetter = member.name.charAt(0).toUpperCase();
  const { pid } = useParams();

  const handleRemoveUsersAccess = () => {
    if (id && pid) {
      dispatch(removeProjectMember(id, pid) as any);
    }
  };

  return (
    <Grid
      container
      sx={{
        borderBottom: '1px solid lightgray',
      }}
    >
      <Grid
        item
        xs={3}
        sx={{
          py: 1,
        }}
      >
        <Avatar
          alt="Remy Sharp"
          src={''}
          sx={{
            bgcolor: () => backgroundColor(firstLetter),
            width: 40,
            height: 40,
          }}
        >
          {firstLetter}
        </Avatar>
      </Grid>
      <Grid
        item
        xs={7}
        sx={{
          display: 'grid',
          py: 1,
        }}
      >
        <div className="member__item">
          <p className="member__name">{member.name}</p>
          <p className="member__subline">{member.email}</p>
          <div>Статус: {member.status}</div>
          <div className="member__item">
            {member.role === 'admin' ? 'Адміністратор' : member.role}
          </div>
        </div>
      </Grid>
      <Grid item xs={2} sx={{ py: 1, display: 'grid' }}>
        <Button
          customClassName="member__btn"
          icon
          transparent
          onClick={handleRemoveUsersAccess}
        >
          <DeleteIcon />
        </Button>
      </Grid>
    </Grid>
  );
};
