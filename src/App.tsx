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
import { NewProject } from './pages/NewProject';
import './App.scss';

export const App: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.user);

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project-edit/:pid" element={<NewProject />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <Router>
      <main>{routes}</main>
    </Router>
  );
};
