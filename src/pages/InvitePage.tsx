import { Card } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from '../modules/selectors/user';
import Auth from './Auth';

export const InvitePage = () => {
  const { id, invitationId } = useParams();
  const { token } = useSelector(getAuth);
  const isLoggedIn = Boolean(token);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(
      'accessInfo',
      JSON.stringify({
        id,
        invitationId,
      })
    );

    if (isLoggedIn) {
      navigate('/');
    }
  }, [id, invitationId, navigate, isLoggedIn]);

  return (
    <>
      {!isLoggedIn ? (
        <>
          <h2
            style={{
              color: '#fff',
            }}
          >
            Вас запросили до проекту.
          </h2>
          <Card
            sx={{
              padding: '0 20px',
              width: '90%',
              maxWidth: '25rem',
            }}
          >
            <p>
              Зареєструйтесь або зайдіть до свого акаунту, щоб підтвердити свою
              згоду приєднатися
            </p>
          </Card>
          <Auth />
        </>
      ) : null}
    </>
  );
};
