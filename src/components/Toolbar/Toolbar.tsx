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
}

export const Toolbar: React.FC<Props> = ({
  showSearchInput,
  setShowSearchInput,
}) => {
  const handleCreateNewTask = (props: {
    action: string;
    type: string;
    newValue: string;
  }) => {
    const { newValue } = props;
  };
  return (
    <div className='toolbar'>
      <ConfirmInputComponent
        isActive={showSearchInput}
        onConfirm={handleCreateNewTask}
        setIsActive={setShowSearchInput}
        type={'task'}
        action={'addTask'}
        placeholder=' пошук'
      />
      <div className='toolbar__btns-wrapper'>
        <Button icon transparent onClick={() => setShowSearchInput(true)}>
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
