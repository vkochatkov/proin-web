import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { ITransaction } from '../../modules/types/transactions';
import { reorder } from '../../utils/utils';
import { TransactionItem } from '../TransactionItem/TransactionItem';

interface IProps {
  transactions: ITransaction[];
}

export const TransactionItemList: React.FC<IProps> = ({ transactions }) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newOrder = reorder(
      transactions,
      result.source.index,
      result.destination.index,
    );

    // changeOrder(newOrder);
    // dispatch(setIsDragging(false));
  };

  return (
    <div className='transaction-items'>
      <div>
        <DragDropContext
          onDragEnd={onDragEnd}
          // onDragStart={() => dispatch(setIsDragging(true))}
        >
          <Droppable droppableId='droppable'>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {transactions.map((transaction, index) => (
                  // <div>{transaction.sum}</div>
                  <TransactionItem
                    transaction={transaction}
                    index={index}
                    key={transaction.id}
                    // generateNavigationString={generateNavigationString}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
