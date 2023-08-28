import { useState } from 'react';
import { Button } from '../FormElement/Button';

import EditIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmInputComponent } from '../ConfirmInputComponent/ConfirmInputComponent';
import { Draggable } from '@hello-pangea/dnd';

interface IProps {
  classifier: string;
  index: number;
  type: string;
  action: string;
  onSubmit: (props: {
    action: string;
    type: string;
    newValue: string;
    value: string;
  }) => void;
  onOpenModal: (type: string, classifier: string) => void;
}

export const ClassifierItem: React.FC<IProps> = ({
  classifier,
  type,
  action,
  onSubmit,
  onOpenModal,
  index,
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Draggable
      key={`${classifier}-${index}`}
      draggableId={`${classifier}-${index}`}
      index={index}
    >
      {(provided) => (
        <li
          className='classifiers__item'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {isActive && (
            <>
              <ConfirmInputComponent
                isActive={isActive}
                onConfirm={onSubmit}
                setIsActive={setIsActive}
                action={action}
                type={type}
                value={classifier}
              />
            </>
          )}
          {!isActive && <div>{classifier}</div>}
          {!isActive && (
            <div className='classifiers__btns-wrapper'>
              <Button
                transparent
                icon
                customClassName='classifiers__btn'
                onClick={() => setIsActive(true)}
              >
                <EditIcon />
              </Button>
              <Button
                customClassName='classifiers__btn'
                transparent
                icon
                onClick={() => onOpenModal(type, classifier)}
              >
                <DeleteIcon />
              </Button>
            </div>
          )}
        </li>
      )}
    </Draggable>
  );
};
