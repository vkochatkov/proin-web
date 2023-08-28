import { useState } from 'react';
import { Button } from '../FormElement/Button';
import { ConfirmInputComponent } from '../ConfirmInputComponent/ConfirmInputComponent';
import { ClassifiersList } from '../ClassifiersList/ClassifiersList';

import AddIcon from '@mui/icons-material/Add';

import './ClassifiersComponent.scss';

interface IProps {
  classifiers: string[];
  label: string;
  type: string;
  action: { classifierToAdd: string; classifierToEdit: string };
  onSubmit: (props: {
    action: string;
    type: string;
    newValue: string;
    value: string;
  }) => void;
  onOpenModal: (type: string, classifier: string) => void;
  onChangeOrder: (newOrder: string[], type: string) => void;
}

export const ClassifiersComponent: React.FC<IProps> = ({
  classifiers,
  label,
  type,
  action,
  onSubmit,
  onOpenModal,
  onChangeOrder,
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className='classifiers'>
      <div className='classifiers__label-wrapper'>
        <h3>{label}</h3>
        <Button
          transparent
          icon
          customClassName='classifiers__btn'
          onClick={() => {
            setIsActive(true);
          }}
        >
          <AddIcon />
        </Button>
      </div>
      <ConfirmInputComponent
        isActive={isActive}
        onConfirm={onSubmit}
        setIsActive={setIsActive}
        type={type}
        action={action.classifierToAdd}
      />
      <ClassifiersList
        classifiers={classifiers}
        type={type}
        action={action.classifierToEdit}
        onSubmit={onSubmit}
        onOpenModal={onOpenModal}
        onChangeOrder={onChangeOrder}
      />
    </div>
  );
};
