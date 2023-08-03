import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { LoadingSpinner } from './components/UIElements/LoadingSpinner';
import { InvitePage } from './pages/InvitePage';
import { AuthWrapper } from './components/AuthWrapper';
import { TaskPage } from './pages/TaskPage/TaskPage';

import './App.scss';

const Auth = React.lazy(() => import('./pages/Auth'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const EditProject = React.lazy(() => import('./pages/EditProject'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const TaskListPage = React.lazy(() => import('./pages/TaskListPage'));
const TransactionPage = React.lazy(() => import('./pages/TransactionPage'));
const TransactionListPage = React.lazy(
  () => import('./pages/TransactionListPage'),
);

export const App: React.FC = () => {
  return (
    <Router>
      <main>
        <Suspense
          fallback={
            <div className='loading'>
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            <Route element={<AuthWrapper />}>
              <Route path='/' element={<HomePage />} />
              <Route path='/tasks' element={<TaskListPage />} />
              <Route path='/transactions' element={<TransactionListPage />} />
              <Route
                path='/project-edit/:pid/:subprojectId?'
                element={<EditProject />}
              />
              <Route
                path='/project-edit/:pid/:subprojectId?/transaction/:transactionId'
                element={<TransactionPage />}
              />
              <Route
                path='/transactions/:transactionId'
                element={<TransactionPage />}
              />
              <Route
                path='/project-edit/:pid/:subprojectId?/task/:tid'
                element={<TaskPage />}
              />
              <Route path='/tasks/:tid' element={<TaskPage />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Route>
            <Route path='/auth' element={<Auth />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />
            <Route
              path='/projects/:id/invitations/:invitationId'
              element={<InvitePage />}
            />
            <Route path='*' element={<Navigate to='/auth' replace />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
};
