import { Dispatch, SetStateAction, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Button } from '../FormElement/Button';
import { ConfirmInputComponent } from '../ConfirmInputComponent/ConfirmInputComponent';

import './Toolbar.scss';

interface Props {
  showSearchInput: boolean;
  setShowSearchInput: Dispatch<SetStateAction<boolean>>;
  handleSearching: (props: {
    action: string;
    type: string;
    newValue: string;
    value: string;
  }) => void;
}

export const Toolbar: React.FC<Props> = ({
  showSearchInput,
  setShowSearchInput,
  handleSearching,
}) => {
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
        <Button icon transparent>
          <SortIcon />
        </Button>
        <Button icon transparent>
          <FilterListIcon />
        </Button>
      </div>
    </div>
  );
};
