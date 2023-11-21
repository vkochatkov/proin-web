import { Card } from '@mui/material';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from './FormElement/Button';
import { PROJECTS_PATH } from '../config/routes';
import { useNavigate } from 'react-router-dom';

interface IProps {
  children: ReactNode;
}

export const ErrorBoundaryComponent = ({ children }: IProps) => {
  const navigate = useNavigate();

  const ErrorFallback = ({
    resetErrorBoundary,
  }: {
    resetErrorBoundary: () => void;
  }) => {
    return (
      <Card
        sx={{
          '&.MuiPaper-root': {
            backgroundColor: 'rgba(248, 248, 248, 0.8)',
            padding: '15px',
            margin: '10px',
          },
        }}
      >
        <h2>Щось пішло не так.</h2>
        <Button onClick={resetErrorBoundary}>Спробувати ще раз</Button>
      </Card>
    );
  };

  const logError = (error: Error) => {
    console.error(error);
  };

  const handleResetError = () => {
    navigate(PROJECTS_PATH);
  };

  return (
    <ErrorBoundary
      onError={logError}
      onReset={handleResetError}
      FallbackComponent={ErrorFallback}
    >
      {children}
    </ErrorBoundary>
  );
};
