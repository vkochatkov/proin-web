import { Avatar } from '@mui/material';
import { IAction } from '../../modules/types/tasks';
import { backgroundColor } from '../../utils/avatar-view';
import { getFirstLetter, getStatusLabel } from '../../utils/utils';
import { Card } from '../UIElements/Card';

import './UserAction.scss';

interface IProps {
  action: IAction;
}

const avatarStyle = {
  width: 20,
  height: 20,
  fontSize: '.7rem',
};

export const UserAction = ({ action }: IProps) => {
  const firstLetter = action.name ? getFirstLetter(action.name) : 'U';
  const isStatusInfo = action.description.includes('Статус');
  const isFilesInfo = action.description.includes('файл');

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const currentDate = new Date();

    if (Math.abs(currentDate.getTime() - date.getTime()) >= 86400000) {
      // If the difference is more than a day (86400000 milliseconds), format as date
      return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
    } else {
      // If the difference is less than a day, format as time
      return date.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  return (
    <Card className="user-action">
      <div className="user-action__top">
        <div className="user-action__info">
          <div>{action.description}</div>
          <div className="user-action__time">
            {formatTimestamp(action.timestamp)}
          </div>
        </div>
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
          <div className="user-action__old-value">
            {isStatusInfo ? getStatusLabel(action.oldValue) : action.oldValue}
          </div>
        )}
        {!isFilesInfo && (
          <>
            <div className="arrow-icon">&#8594;</div>
            <div className="user-action__new-value">
              {isStatusInfo ? getStatusLabel(action.newValue) : action.newValue}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
