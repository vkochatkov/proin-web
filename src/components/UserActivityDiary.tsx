import { useSelector } from 'react-redux';
import { getCurrentTask } from '../modules/selectors/currentTask';
import { UserAction } from './UserAction/UserAction';

export const UserActivityDiary = () => {
  const actions = useSelector(getCurrentTask).actions;
  return (
    <>
      {actions &&
        actions?.map((action) => (
          <UserAction key={action._id} action={action} />
        ))}
    </>
  );
};
