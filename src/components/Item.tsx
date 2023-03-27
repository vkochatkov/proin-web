import React from 'react';
import { Card } from './UIElements/Card';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from '../modules/selectors/user';
import { editCurrentProject } from '../modules/actions/mainProjects';
import { useNavigate } from 'react-router-dom';
import { startLoading } from '../modules/actions/loading';
import './Item.scss';

interface Props {
  name?: string;
  logo?: string;
  description?: string;
  projectId: string;
}

export const Item: React.FC<Props> = ({
  name,
  logo,
  description,
  projectId,
}) => {
  const { token } = useSelector(getAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    dispatch(startLoading());
    dispatch(editCurrentProject(token, id) as any);
    navigate(`/project-edit/${id}`);
  };

  const img = <img src={logo ? `${logo}` : ''} alt="logo" />;

  return (
    <div onClick={() => handleClick(projectId)}>
      <Card className="item">
        {!logo && <div className="item__image-empty" />}
        {logo && img}
        <div className="item__text-container">
          <p className="item__name">{name}</p>
          <p className="item__description">{description}</p>
        </div>
      </Card>
    </div>
  );
};
