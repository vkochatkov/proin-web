import { ClassifierItem } from '../ClassifierItem/ClassifierItem';

interface IProps {
  classifiers: string[];
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

export const ClassifiersList: React.FC<IProps> = ({
  classifiers,
  type,
  action,
  onSubmit,
  onOpenModal,
}) => {
  return (
    <ul className='classifiers__list'>
      {classifiers.map((classifier: string, index: number) => (
        <ClassifierItem
          key={`${classifier}-${index}`}
          classifier={classifier}
          type={type}
          action={action}
          onSubmit={onSubmit}
          onOpenModal={onOpenModal}
        />
      ))}
    </ul>
  );
};
