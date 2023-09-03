import { useSelector, useDispatch } from 'react-redux';
import { getMembers } from '../modules/selectors/projectMembers';
import { Member } from './Member/Member';
import { Grid, Paper } from '@mui/material';
import { removeProjectMember } from '../modules/actions/projectMembers';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from '../modules/selectors/user';
import { RemoveModal } from './Modals/RemoveModal';
import { getIdForRemove } from '../modules/selectors/idForRemove';
import { setIdForDelete } from '../modules/actions/idForRemove';
import { closeModal } from '../modules/actions/modal';

export const MembersInfo = () => {
  const members = useSelector(getMembers);
  const { pid } = useParams();
  const dispatch = useDispatch();
  const { userId } = useSelector(getAuth);
  const navigate = useNavigate();
  const id = useSelector(getIdForRemove);
  const modalId = 'remove-member';

  const handleRemoveUsersAccess = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    dispatch(
      closeModal({
        id: modalId,
      }),
    );

    if (id && pid) {
      await dispatch(removeProjectMember(id, pid) as any);

      if (userId === id) {
        navigate('/');
      }
    }

    dispatch(setIdForDelete(''));
  };

  return (
    <>
      <RemoveModal
        submitHandler={handleRemoveUsersAccess}
        modalId={modalId}
        text={'користувача'}
      />
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
    </>
  );
};
