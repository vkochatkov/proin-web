import { Dispatch, SetStateAction } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Button } from '../FormElement/Button';
import { ConfirmInputComponent } from '../ConfirmInputComponent/ConfirmInputComponent';
import { useContextMenu } from '../../hooks/useContextMenu';
import { Menu, MenuItem } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import './Toolbar.scss';

interface Props {
  showSearchInput: boolean;
  selectedSortOption: string;
  setShowSearchInput: Dispatch<SetStateAction<boolean>>;
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
}

export const Toolbar: React.FC<Props> = ({
  showSearchInput,
  selectedSortOption,
  setShowSearchInput,
  handleSearching,
  onSortByAddingDate,
  onSortByDeadline,
  onSortByLastCommentDate,
  onSortDefaultState,
}) => {
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

  return (
    <div className='toolbar'>
      <ConfirmInputComponent
        isActive={showSearchInput}
        onConfirm={handleSearching}
        setIsActive={setShowSearchInput}
        type={'task'}
        action={'addTask'}
        placeholder=' пошук'
        isSearching
      />
      <div className='toolbar__btns-wrapper'>
        <Button
          icon
          transparent
          onClick={() => setShowSearchInput((prevState) => !prevState)}
        >
          <SearchIcon />
        </Button>
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
        <Button icon transparent>
          <FilterListIcon />
        </Button>
      </div>
    </div>
  );
};
