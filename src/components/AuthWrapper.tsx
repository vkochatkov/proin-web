import { Navigate, Outlet } from 'react-router-dom';

export const AuthWrapper = () => {
  const userLogged = JSON.parse(localStorage.getItem('userData') || 'null');
  if (userLogged == null) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
};
