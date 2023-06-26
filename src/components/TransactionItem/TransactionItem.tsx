import { Draggable } from '@hello-pangea/dnd';
import { Paper, Typography } from '@mui/material';
import { useContextMenu } from '../../hooks/useContextMenu';
import { ITransaction } from '../../modules/types/transactions';
import { Button } from '../FormElement/Button';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { getTransactionLabel } from '../../utils/utils';

interface IProps {
  transaction: ITransaction;
  index: number;
}

export const TransactionItem: React.FC<IProps> = ({ transaction, index }) => {
  const { handleClose, handleContextMenu, contextMenuPosition, anchorEl } =
    useContextMenu();

  const handleOpenTransaction = (e: React.MouseEvent<HTMLDivElement>) => {};
  return (
    <Draggable draggableId={transaction.id} index={index}>
      {(provided) => (
        <div
          onClick={(e) => handleOpenTransaction(e)}
          ref={provided.innerRef}
          className='task-item'
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Paper>
            {/* <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorPosition={{
                top: contextMenuPosition.top,
                left: contextMenuPosition.left,
              }}
            >
              <MenuItem onClick={() => handleOpenModal(modalId)}>
                Видалити
              </MenuItem>
            </Menu> */}
            <Typography>{getTransactionLabel(transaction.type)}</Typography>
            <Typography>{transaction.classifier}</Typography>
            <Typography>Сума:{transaction.sum}</Typography>
            <Button
              icon
              transparent
              customClassName='task-item__btn'
              onClick={handleContextMenu}
            >
              <MoreVertIcon className='item__icon' />
            </Button>
            {/* <Typography
                variant='inherit'
                sx={{ color: '#979797' }}
              >{`${formattedDate} ${formattedTime}`}</Typography> */}
          </Paper>
        </div>
      )}
    </Draggable>
  );
};
