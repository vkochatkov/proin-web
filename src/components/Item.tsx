import React from 'react';
import { Card } from './UIElements/Card';
import './Item.scss';

interface Props {
  name?: string;
  logo?: string;
  description?: string;
}

export const Item: React.FC<Props> = ({ name, logo, description }) => {
  const img = (
    <img src={logo ? `http://localhost:5000/${logo}` : ''} alt="logo" />
  );
  return (
    <Card className="item">
      {!logo && <div className="item__image-empty" />}
      {logo && img}
      <div className="item__text-container">
        <p>{name}</p>
        <p>{description}</p>
      </div>
    </Card>
  );
};
