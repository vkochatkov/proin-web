import { Button } from '../FormElement/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';

import './ClassifiersComponent.scss';

interface IProps {
  classifiers: string[];
  label: string;
}

export const ClassifiersComponent: React.FC<IProps> = ({
  classifiers,
  label,
}) => {
  return (
    <div className='classifiers'>
      <div className='classifiers__label-wrapper'>
        <h3>{label}</h3>
        <Button
          transparent
          icon
          customClassName='classifiers__btn'
          // onClick={handleAddClassifier}
        >
          <AddIcon />
        </Button>
      </div>
      <ul className='classifiers__list'>
        {classifiers.map((classifier: string) => (
          <li className='classifiers__item'>
            <div>{classifier}</div>
            <div className='classifiers__btns-wrapper'>
              <Button
                transparent
                icon
                customClassName='classifiers__btn'
                // onClick={handleEditClassifier}
                // disabled={selectedEdittingValue === ''}
              >
                <EditIcon />
              </Button>
              <Button
                // onClick={handleOpenModal}
                transparent
                icon
                // disabled={selectedEdittingValue === ''}
              >
                <DeleteIcon />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
