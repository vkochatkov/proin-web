import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './modules/store';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { LoadingSpinner } from './components/UIElements/LoadingSpinner';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import './App.scss';

const Auth = React.lazy(() => import('./pages/Auth'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const EditProject = React.lazy(() => import('./pages/EditProject'));

export const App: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.user);

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project-edit/:pid" element={<EditProject />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <Router>
      <main>
        <Suspense
          fallback={
            <div className="loading">
              <LoadingSpinner />
            </div>
          }
        >
          {routes}
        </Suspense>
      </main>
    </Router>
  );
};
