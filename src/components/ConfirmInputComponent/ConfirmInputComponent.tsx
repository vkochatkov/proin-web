import { Dispatch, SetStateAction, useState } from 'react';
import { Action } from 'redux-act';
import { Button } from '../FormElement/Button';
import CheckIcon from '@mui/icons-material/Check';
import { Input } from '@mui/material';

import './ConfirmInputComponent.scss';

interface IProps {
  isActive: boolean;
  onConfirm: (props: {
    action: string;
    type: string;
    newValue: string;
    value: string;
  }) => void;
  setIsActive:
    | Dispatch<SetStateAction<boolean>>
    | ((value: boolean) => Action<boolean, {}>);
  action: string;
  type: string;
  value?: string;
  placeholder: string;
}

export const ConfirmInputComponent: React.FC<IProps> = ({
  isActive,
  onConfirm,
  setIsActive,
  placeholder,
  action,
  type,
  value = '',
}) => {
  const [changedValue, setChangedValue] = useState(value);

  const handleConfirm = () => {
    onConfirm({ action, type, newValue: changedValue, value });
    setIsActive(false);
    setChangedValue('');
  };

  return (
    <>
      {isActive && (
        <div
          className='confirm-input__input-wrapper'
          onBlur={() => {
            if (!changedValue) {
              setIsActive(false);
            }
          }}
        >
          <Input
            sx={{
              width: '95%',
            }}
            placeholder={placeholder}
            value={changedValue}
            onChange={(e) => setChangedValue(e.target.value)}
          />
          <Button icon transparent onClick={handleConfirm}>
            <CheckIcon />
          </Button>
        </div>
      )}
    </>
  );
};
