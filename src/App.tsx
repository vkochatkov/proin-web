import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './modules/store';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Auth } from './pages/Auth';
import { HomePage } from './pages/HomePage';
import './App.scss';

//@ts-ignore
export const App: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.user);

  return (
    <Router>
      <main>
        {token ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        )}
      </main>
    </Router>
  );
};
