import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateLogin } from '../modules/actions/user';

interface UserData {
  userId: string;
  token: string;
  expiration: string;
}

export const useAuth = (): {
  token: string;
  login: (userId: string, token: string, expirationDate?: Date) => void;
  logout: () => void;
  userId: string;
} => {
  const [token, setToken] = useState<string>('');
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>();
  const [userId, setUserId] = useState<string>('');
  const dispatch = useDispatch();

  const login = useCallback(
    (
      uid: string,
      token: string,
      expirationDate: Date = new Date(new Date().getTime() + 1000 * 60 * 60)
    ) => {
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate = expirationDate;
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: uid,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken('');
    setTokenExpirationDate(null);
    setUserId('');
    localStorage.removeItem('userData');
  }, []);

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
          new Date(storedData.expiration)
        );
        dispatch(
          updateLogin({
            userId: storedData.userId,
            token: storedData.token,
          })
        );
      }
    }
  }, [login, dispatch]);

  return { token, login, logout, userId };
};
