import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const InvitePage = () => {
  const { id, invitationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(
      'accessInfo',
      JSON.stringify({
        id,
        invitationId,
      })
    );

    navigate('/');
  }, [id, invitationId, navigate]);

  return null;
};
