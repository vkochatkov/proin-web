import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { ITransaction } from '../../modules/types/transactions';
import { reorder } from '../../utils/utils';
import { TransactionItem } from '../TransactionItem/TransactionItem';
import { MoveItemModal } from '../Modals/MoveItemModal';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentTransaction } from '../../modules/selectors/currentTransaction';
import { changeTransactionProject } from '../../modules/actions/transactions';

interface IProps {
  transactions: ITransaction[];
  changeOrder?: (transactions: ITransaction[]) => void;
  generateNavigationString: (id: string) => void;
  droppableId?: string;
  isDraggable?: boolean;
}

export const TransactionItemList: React.FC<IProps> = ({
  transactions,
  changeOrder,
  generateNavigationString,
  droppableId = 'droppable',
  isDraggable = false,
}) => {
  const currentTransaction = useSelector(getCurrentTransaction);
  const dispatch = useDispatch();
  const onDragEnd = (result: any) => {
    if (!result.destination || !changeOrder) {
      return;
    }

    const newOrder = reorder(
      transactions,
      result.source.index,
      result.destination.index,
    );

    changeOrder(newOrder);
  };

  const handleSubmitTransactionMoving = (projectId: string) => {
    dispatch(changeTransactionProject(currentTransaction.id, projectId) as any);
  };

  return (
    <>
      <MoveItemModal
        modalId='move-transaction'
        handleSubmit={handleSubmitTransactionMoving}
        currentProjectId={currentTransaction.projectId}
      />
      <div className='transaction-items'>
        {isDraggable ? (
          <div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId={droppableId}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {transactions.map((transaction, index) => (
                      <TransactionItem
                        transaction={transaction}
                        index={index}
                        key={transaction.id}
                        generateNavigationString={generateNavigationString}
                        isDraggable={isDraggable}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        ) : (
          <div>
            <div>
              {transactions.map((transaction, index) => (
                <TransactionItem
                  transaction={transaction}
                  index={index}
                  key={transaction.id}
                  generateNavigationString={generateNavigationString}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
