import { ReactNode } from 'react';
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface IProps {
  open: boolean;
  handleClose: () => void;
  label: string;
  children: ReactNode;
}

export const Modal = ({ open, handleClose, label, children }: IProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': {
          width: '100%',
          maxWidth: '400px',
          padding: '10px 0',
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid #ccc',
          margin: '0 1rem',
          padding: '5px 0',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: 'medium',
          }}
        >
          {label}
        </span>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            padding: '0',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {children}
    </Dialog>
  );
};
