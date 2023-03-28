import React from 'react';
import { Card } from './UIElements/Card';
import { Draggable } from '@hello-pangea/dnd';
import './Item.scss';

interface Props {
  name?: string;
  logo?: string;
  description?: string;
  projectId: string;
  index: number;
  onClick: (projectId: string) => void;
}

export const Item: React.FC<Props> = ({
  name,
  logo,
  description,
  projectId,
  index,
  onClick,
}) => {
  const img = <img src={logo ? `${logo}` : ''} alt="logo" />;

  return (
    <Draggable draggableId={projectId} index={index} key={projectId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          onClick={() => onClick(projectId)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="item">
            {!logo && <div className="item__image-empty" />}
            {logo && img}
            <div className="item__text-container">
              <p className="item__name">{name}</p>
              <p className="item__description">{description}</p>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};
