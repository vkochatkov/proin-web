import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Button } from '../FormElement/Button';
import { ConfirmInputComponent } from '../ConfirmInputComponent/ConfirmInputComponent';
import { useContextMenu } from '../../hooks/useContextMenu';
import { Menu, MenuItem } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { openModal } from '../../modules/actions/modal';
import { useDispatch } from 'react-redux';

import './Toolbar.scss';

interface Props {
  selectedSortOption: string;
  handleSearching: (props: {
    action: string;
    type: string;
    newValue: string;
    value: string;
  }) => void;
  onSortByAddingDate: () => void;
  onSortByDeadline: () => void;
  onSortByLastCommentDate: () => void;
  onSortDefaultState: () => void;
  modalId: string;
}

export const Toolbar: React.FC<Props> = ({
  selectedSortOption,
  handleSearching,
  onSortByAddingDate,
  onSortByDeadline,
  onSortByLastCommentDate,
  onSortDefaultState,
  modalId,
}) => {
  const dispatch = useDispatch();

  const { handleClose, contextMenuPosition, anchorEl, handleContextMenu } =
    useContextMenu();

  const handleSortByAddingDate = () => {
    handleClose();
    onSortByAddingDate();
  };
  const handleSortByDeadlineDate = () => {
    handleClose();
    onSortByDeadline();
  };
  const handleSortByDateOfLastComment = () => {
    handleClose();
    onSortByLastCommentDate();
  };
  const handleSortByDefault = () => {
    handleClose();
    onSortDefaultState();
  };

  const handleOpenFilterModal = () => {
    dispatch(openModal({ id: modalId }));
  };

  return (
    <div className='toolbar'>
      <ConfirmInputComponent
        isActive={true}
        onConfirm={handleSearching}
        type={'item'}
        action={'addItem'}
        placeholder=' пошук'
        isSearching
      />
      <div className='toolbar__btns-wrapper'>
        {/* <Button icon transparent>
          <SearchIcon />
        </Button> */}
        <Button icon transparent onClick={handleContextMenu}>
          <SortIcon />
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorPosition={{
            top: contextMenuPosition.top,
            left: contextMenuPosition.left,
          }}
        >
          <MenuItem onClick={handleSortByAddingDate}>
            По даті додавання
            <span>
              {selectedSortOption === 'byAddingDate' && <CheckIcon />}
            </span>
          </MenuItem>
          <MenuItem onClick={handleSortByDeadlineDate}>
            По даті дедлайну
            {selectedSortOption === 'byDeadlineDate' && <CheckIcon />}
          </MenuItem>
          <MenuItem onClick={handleSortByDateOfLastComment}>
            По даті останнього коментаря
            {selectedSortOption === 'byLastCommentDate' && <CheckIcon />}
          </MenuItem>
          <MenuItem onClick={handleSortByDefault}>
            По замовчуванню
            <span> {selectedSortOption === 'default' && <CheckIcon />}</span>
          </MenuItem>
        </Menu>
        <Button icon transparent onClick={handleOpenFilterModal}>
          <FilterListIcon />
        </Button>
      </div>
    </div>
  );
};
