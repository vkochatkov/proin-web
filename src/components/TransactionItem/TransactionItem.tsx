import { useNavigate } from 'react-router-dom';
import { Draggable } from '@hello-pangea/dnd';
import { Paper, Typography } from '@mui/material';
import { useContextMenu } from '../../hooks/useContextMenu';
import { ITransaction } from '../../modules/types/transactions';
import { Button } from '../FormElement/Button';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { getTransactionLabel } from '../../utils/utils';

import './TransactionItem.scss';

interface IProps {
  transaction: ITransaction;
  index: number;
  generateNavigationString: (id: string) => void;
}

export const TransactionItem: React.FC<IProps> = ({
  transaction,
  index,
  generateNavigationString,
}) => {
  const { handleClose, handleContextMenu, contextMenuPosition, anchorEl } =
    useContextMenu();
  const navigate = useNavigate();
  const transactionkWrapperStyle = {
    padding: '10px',
    marginTop: '5px',
    backgroundColor: transaction.type === 'income' ? '#86e7d6' : '#DCA2A3',
  };

  const handleOpenTransaction = () => {
    const query = generateNavigationString(transaction.id);
    navigate(`${query}`);
  };
  return (
    <Draggable draggableId={transaction.id} index={index}>
      {(provided) => (
        <div
          onClick={handleOpenTransaction}
          ref={provided.innerRef}
          className='transaction-item'
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Paper sx={transactionkWrapperStyle}>
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
            <Typography>
              {getTransactionLabel(transaction.type)}: {transaction.sum}
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
