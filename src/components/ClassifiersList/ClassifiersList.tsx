import { reorder } from '../../utils/utils';
import { ClassifierItem } from '../ClassifierItem/ClassifierItem';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

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
  onChangeOrder: (newOrder: string[], type: string) => void;
}

export const ClassifiersList: React.FC<IProps> = ({
  classifiers,
  type,
  action,
  onSubmit,
  onOpenModal,
  onChangeOrder,
}) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newOrder = reorder(
      classifiers,
      result.source.index,
      result.destination.index,
    );
    // Update your state with the newOrder
    onChangeOrder(newOrder, type);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='classifiers'>
        {(provided) => (
          <ul
            className='classifiers__list'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {classifiers &&
              classifiers.map((classifier: string, index: number) => (
                <ClassifierItem
                  key={`${classifier}-${index}`}
                  index={index}
                  classifier={classifier}
                  type={type}
                  action={action}
                  onSubmit={onSubmit}
                  onOpenModal={onOpenModal}
                />
              ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};
