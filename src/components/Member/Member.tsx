import React from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Grid } from '@mui/material';
import { IMember } from '../../modules/types/projectMembers';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '../FormElement/Button';
import { backgroundColor } from '../../utils/avatar-view';
import { openModal } from '../../modules/actions/modal';
import { setIdForDelete } from '../../modules/actions/idForRemove';

import './Member.scss';

export const Member = ({
  member,
  disabled,
}: {
  member: IMember;
  disabled: boolean;
}) => {
  const dispatch = useDispatch();
  const id = member.userId;
  const firstLetter = member.name.charAt(0).toUpperCase();
  const modalId = 'remove-member';

  const handleOpenRemoveModal = () => {
    dispatch(
      openModal({
        id: modalId,
      }),
    );
    dispatch(setIdForDelete(id));
  };

  return (
    <Grid
      container
      sx={{
        borderTop: '1px solid lightgray',
        borderBottom: '1px solid lightgray',
        margin: '2px 0',
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
          alt='Remy Sharp'
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
        <div className='member__item'>
          <p className='member__name'>{member.name}</p>
          <p className='member__subline'>{member.email}</p>
          <div>Статус: {member.status}</div>
          <div className='member__item'>
            {member.role === 'admin' ? 'Адміністратор' : member.role}
          </div>
        </div>
      </Grid>
      <Grid item xs={2} sx={{ py: 1, display: 'grid' }}>
        <Button
          disabled={disabled}
          customClassName='member__btn'
          icon
          transparent
          onClick={handleOpenRemoveModal}
        >
          <DeleteIcon />
        </Button>
      </Grid>
    </Grid>
  );
};
