import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signin, signout } from '../modules/actions/user';
import { getAuth } from '../modules/selectors/user';
import { filterNames } from '../config/contsants';
import { endLoading } from '../modules/actions/loading';

interface UserData {
  userId: string;
  token: string;
  email: string;
  name: string;
  expiration: string;
}

export const useAuth = (): {
  token: string;
  login: (
    userId: string,
    token: string,
    email: string,
    name: string,
    expirationDate?: Date,
  ) => void;
  logout: () => void;
  userId: string;
} => {
  const { token, userId } = useSelector(getAuth);
  const [lastActivityTime, setLastActivityTime] = useState<Date | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const sessionDuration = 1000 * 60 * 60;
  const sessionDuration = 8640000000000000;

  const login = useCallback(
    (uid: string, token: string, email: string, name: string) => {
      setLastActivityTime(new Date());

      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: uid,
          token,
          email,
          name,
          expiration: new Date(sessionDuration).toISOString(),
        }),
      );

      dispatch(signin(uid, token, email, name) as any);
    },
    [dispatch],
  );

  const handleUserActivity = () => {
    setLastActivityTime(new Date());

    const updatedExpiration = new Date(sessionDuration).toISOString();

    if (token) {
      localStorage.setItem(
        'userData',
        JSON.stringify({
          ...JSON.parse(localStorage.getItem('userData') || '{}'),
          expiration: updatedExpiration,
        }),
      );
    }
  };

  const removeFilteredValuesFromSessionStorage = () => {
    Object.keys(filterNames).forEach((key) => {
      sessionStorage.removeItem(filterNames[key]);
      sessionStorage.removeItem(`${filterNames[key]}SelectedValue`);
    });
  };

  const logout = useCallback(() => {
    localStorage.removeItem('userData');
    removeFilteredValuesFromSessionStorage();

    dispatch(signout() as any);
    navigate('/auth');
  }, [dispatch, navigate]);

  useEffect(() => {
    const storedDataString = localStorage.getItem('userData');

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);

    if (storedDataString) {
      const storedData: UserData = JSON.parse(storedDataString);

      if (storedData.token && new Date(storedData.expiration) > new Date()) {
        login(
          storedData.userId,
          storedData.token,
          storedData.email,
          storedData.name,
        );
      }
    } else {
      dispatch(endLoading());
    }

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
    };
  }, [login, dispatch]);

  // useEffect(() => {
  //   let logoutTimer: NodeJS.Timeout;

  //   // if (token && lastActivityTime) {
  //   //   const remainingTime =
  //   //     lastActivityTime.getTime() + sessionDuration - new Date().getTime();

  //   //   if (remainingTime > 0) {
  //   //     logoutTimer = setTimeout(logout, remainingTime);
  //   //   }
  //   // } else {
  //   //   clearTimeout(logoutTimer!);
  //   // }
  //   return () => clearTimeout(logoutTimer);
  // }, [token, logout, lastActivityTime]);

  return { token, login, logout, userId };
};
