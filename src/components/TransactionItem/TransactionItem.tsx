import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Draggable } from '@hello-pangea/dnd';
import { Menu, MenuItem, Paper, Typography } from '@mui/material';
import { useContextMenu } from '../../hooks/useContextMenu';
import { ITransaction } from '../../modules/types/transactions';
import { Button } from '../FormElement/Button';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { getTransactionLabel } from '../../utils/utils';
import { setCurrentTransaction } from '../../modules/actions/transactions';
import { openModal } from '../../modules/actions/modal';

import './TransactionItem.scss';

interface IProps {
  transaction: ITransaction;
  index: number;
  generateNavigationString: (id: string) => void;
  isDraggable?: boolean;
}

export const TransactionItem: React.FC<IProps> = ({
  transaction,
  index,
  generateNavigationString,
  isDraggable = false,
}) => {
  const { handleClose, handleContextMenu, contextMenuPosition, anchorEl } =
    useContextMenu();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalId = 'remove-transaction';
  const transactionkWrapperStyle = {
    padding: '10px',
    marginTop: '5px',
    // backgroundColor: transaction.type === 'income' ? '#86e7d6' : '#DCA2A3',
  };
  // Convert the timestamp to a Date object
  const transactionDate = new Date(transaction.timestamp);

  // Format the date and time
  const formattedDate = transactionDate.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  const handleOpenTransaction = () => {
    dispatch(setCurrentTransaction(transaction));

    if (anchorEl) {
      handleClose();
    } else {
      const query = generateNavigationString(transaction.id);
      navigate(`${query}`);
    }
  };

  const handleOpenModal = (modalId: string) => {
    dispatch(openModal({ id: modalId }));
    dispatch(setCurrentTransaction(transaction));
  };

  const renderItem = () => (
    <Paper sx={transactionkWrapperStyle}>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorPosition={{
          top: contextMenuPosition.top,
          left: contextMenuPosition.left,
        }}
      >
        <MenuItem onClick={() => handleOpenModal(modalId)}>Видалити</MenuItem>
      </Menu>
      <Typography
        variant='inherit'
        // sx={{ color: '#979797' }}
      >{`${formattedDate}`}</Typography>
      <Typography
        sx={{
          display: 'inline-block',
          background: `${
            transaction.type === 'expenses'
              ? '#DCA2A3'
              : transaction.type === 'income'
              ? '#86e7d6'
              : 'lightblue'
          }`,
        }}
      >
        {getTransactionLabel(transaction.type)}
        {transaction.type && ':'} {transaction.sum}
      </Typography>
      <Typography>{transaction.classifier}</Typography>
      <Button
        icon
        transparent
        customClassName='transaction-item__btn'
        onClick={handleContextMenu}
      >
        <MoreVertIcon className='transaction-item__icon' />
      </Button>
    </Paper>
  );

  return (
    <>
      {isDraggable && (
        <Draggable draggableId={transaction.id} index={index}>
          {(provided) => (
            <div
              onClick={handleOpenTransaction}
              ref={provided.innerRef}
              className='transaction-item'
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {renderItem()}
            </div>
          )}
        </Draggable>
      )}
      {!isDraggable && (
        <div onClick={handleOpenTransaction} className='transaction-item'>
          {renderItem()}
        </div>
      )}
    </>
  );
};
