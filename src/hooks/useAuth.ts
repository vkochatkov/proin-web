import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signin, signout } from '../modules/actions/user';
import { getAuth } from '../modules/selectors/user';

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
    expirationDate?: Date
  ) => void;
  logout: () => void;
  userId: string;
} => {
  const { token, userId } = useSelector(getAuth);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>();
  const dispatch = useDispatch();

  const login = useCallback(
    (
      uid: string,
      token: string,
      email: string,
      name: string,
      expirationDate: Date = new Date(new Date().getTime() + 1000 * 60 * 60)
    ) => {
      setTokenExpirationDate(expirationDate);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: uid,
          token,
          email,
          name,
          expiration: expirationDate.toISOString(),
        })
      );

      dispatch(signin(uid, token, email, name) as any);
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('userData');
    dispatch(signout() as any);
  }, [dispatch]);

  useEffect(() => {
    let logoutTimer: NodeJS.Timeout;
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer!);
    }
    return () => clearTimeout(logoutTimer);
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedDataString = localStorage.getItem('userData');

    if (storedDataString) {
      const storedData: UserData = JSON.parse(storedDataString);

      if (storedData.token && new Date(storedData.expiration) > new Date()) {
        login(
          storedData.userId,
          storedData.token,
          storedData.email,
          storedData.name,
          new Date(storedData.expiration)
        );
      }
    }
  }, [login, dispatch]);

  return { token, login, logout, userId };
};
