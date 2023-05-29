import { Avatar } from '@mui/material';
import { IAction } from '../../modules/types/currentProjectTasks';
import { backgroundColor } from '../../utils/avatar-view';
import { getFirstLetter } from '../../utils/utils';
import { Card } from '../UIElements/Card';

import './UserAction.scss';

interface IProps {
  action: IAction;
}

const avatarStyle = {
  width: 20,
  height: 20,
  fontSize: '1rem',
};

export const UserAction = ({ action }: IProps) => {
  const firstLetter = getFirstLetter(action.name);

  return (
    <Card className="user-action">
      <div className="user-action__top">
        <div>{action.description}</div>
        <Avatar
          alt="Remy Sharp"
          src={action.userLogo}
          sx={{
            bgcolor: () => backgroundColor(firstLetter),
            ...avatarStyle,
          }}
        >
          {firstLetter}
        </Avatar>
      </div>
      <div className="user-action__wrapper">
        {action.oldValue && (
          <div className="user-action__old-value">{action.oldValue}</div>
        )}
        <div className="arrow-icon">&#8594;</div>
        <div className="user-action__new-value">{action.newValue}</div>
      </div>
    </Card>
  );
};
